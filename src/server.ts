import express from 'express'
import payload from 'payload'
import cors from 'cors'; // Import the CORS middleware
import crypto from 'crypto';
import { transporter } from './utiles/mailConfig';
import dotenv from 'dotenv';
dotenv.config();
const app = express()

// Enable CORS
app.use(cors({
  origin: '*', // You can restrict this to specific origins if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin')
})

app.use('/media', express.static('media'));

// app.use('/api', router);

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
    email: {
      transportOptions: {
        host: process.env.SMTP_HOST,
        auth: {
          user: process.env.SES_SMTP_USERNAME,
          pass: process.env.SES_SMTP_PASSWORD,
        },
        port: Number(process.env.SMTP_HOST),
        secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false (the default) for 587 and others
        requireTLS: true,
      },
      fromName: 'no-reply@scholarbee.pk',
      fromAddress: 'basitafraz8@gmail.com',
    },
  })




  app.post('/api/signup', async (req, res) => {
    const { email, password, first_name, last_name, phone_number, user_type } = req.body;
    let userCreated = false;
    let user: any;
    try {
      const existingUser = await payload.find({
        collection: 'users',
        where: { email: { equals: email } },
        limit: 1
      });

      if (existingUser && existingUser.docs.length > 0) {
        return res.status(400).json({ error: "Email already exists." });
      }

      user = await payload.create({
        collection: 'users',
        data: {
          email, password, first_name, last_name, phone_number, user_type
        },
        overrideAccess: true,
      });
      userCreated = true;

      const verifyToken = crypto.randomBytes(20).toString('hex');

      await payload.update({
        collection: 'users',
        id: user.id,
        data: { verifyToken, _verified: false },
        overrideAccess: true,
      });

      const verificationUrl = `${process.env.FRONTEND_URL}/verification/${verifyToken}`;
      const mailOptions: any = {
        from: 'basitafraz8@gmail.com',
        to: user.email,
        subject: 'Verify Your Email Address',
        html: `<p>Please verify your email by clicking the following link: <a href=${verificationUrl}>Verification Link</a></p>`
      };

      transporter.sendMail(mailOptions).then((res) => {
        console.log(res)
      }).catch((error) => {
        console.log(error, "while sending verification email!")
      })
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error: 'Failed to complete signup.' });
    }
  });


  app.get('/api/verify-email/:verifyToken', async (req, res) => {
    const { verifyToken } = req.params;

    try {
      const result = await payload.find({
        collection: 'users',
        where: {
          verifyToken: {
            equals: verifyToken
          }
        },
        limit: 1
      });

      if (!result || result.docs.length === 0) {
        return res.status(400).json({ error: 'Verification token is invalid or expired.' });
      }

      const user = result.docs[0];

      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          _verified: true,
          verifyToken: ''
        },
        overrideAccess: true
      });

      res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
      console.error('Failed to verify email:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ******************* Filter based admission programs **********************

  app.get('/api/admission-programs-with-filters', async (req, res) => {
    const { major, fee, year, intake, programName, university, studyLevel, courseForm, campusId, page = 1, limit = 10 } = req.query;
    console.log(major, fee, year, intake, programName, university, studyLevel, courseForm, campusId, "----- in aggregation ----");

    try {
      const pipeline: any[] = [];
      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 10;
      const skip = (pageNum - 1) * limitNum;

      // Lookup for Admissions
      pipeline.push({
        $lookup: {
          from: 'admissions',
          let: { admissionId: '$admission' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', { $toObjectId: '$$admissionId' }],
                },
              },
            },
          ],
          as: 'admission',
        },
      });
      pipeline.push({ $unwind: '$admission' });

      // Lookup for Programs
      pipeline.push({
        $lookup: {
          from: 'programs',
          let: { programId: '$program' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', { $toObjectId: '$$programId' }],
                },
              },
            },
          ],
          as: 'program',
        },
      });
      pipeline.push({ $unwind: '$program' });

      // Lookup for Fee Structures (append as array)
      pipeline.push({
        $lookup: {
          from: 'fee_structures',
          let: { programId: '$program._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    {
                      $toObjectId: '$program_id', // Convert program_id to ObjectId
                    },
                    '$$programId', // Compare to ObjectId from the previous stage
                  ],
                },
              },
            },
          ],
          as: 'fee_structures', // Store as an array
        },
      });

      // Apply filters only if they are provided in the query

      // Filter by Major
      if (major) {
        pipeline.push({
          $match: {
            'program.name': { $regex: major, $options: 'i' },
          },
        });
      }

      // Search based on Program Name
      if (programName) {
        pipeline.push({
          $match: {
            'program.name': { $regex: programName, $options: 'i' },
          },
        });
      }

      // Filter by University ID
      if (university) {
        pipeline.push({
          $match: {
            'admission.university_id': { $eq: university },
          },
        });
      }

      // Filter by Campus ID
      if (campusId) {
        pipeline.push({
          $match: {
            'program.campus_id': { $eq: campusId },
          },
        });
      }

      // Filter by Year
      if (year) {
        pipeline.push({
          $match: {
            'admission.admission_startdate': {
              $gte: new Date(`${year}-01-01`),
              $lt: new Date(`${year}-12-31`),
            },
          },
        });
      }

      // Filter by Intake Period
      if (intake) {
        pipeline.push({
          $match: {
            'program.intake_periods.intake_period': { $regex: intake, $options: 'i' },
          },
        });
      }

      // Filter by Study Level
      if (studyLevel) {
        pipeline.push({
          $match: {
            'program.degree_level': { $regex: studyLevel, $options: 'i' },
          },
        });
      }

      // Filter by Course Form
      if (courseForm) {
        pipeline.push({
          $match: {
            'program.mode_of_study': { $regex: courseForm, $options: 'i' },
          },
        });
      }

      // Apply fee filtering only if 'fee' query parameter is provided
      if (fee) {
        const [minFee, maxFee] = (fee as string).split('-').map(Number);
        pipeline.push({
          $match: {
            'fee_structures.tuition_fee': { $gte: minFee, $lte: maxFee },
          },
        });
      }

      // Pagination
      pipeline.push({
        $facet: {
          docs: [
            { $skip: skip },
            { $limit: limitNum },
          ],
          totalCount: [
            { $count: 'count' },
          ],
        },
      });

      // Execute the aggregation pipeline
      const result = await payload.db.collections['admission_programs'].aggregate(pipeline)

      const docs = result[0].docs;
      const totalCount = result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;
      const totalPages = Math.ceil(totalCount / limitNum);

      const pagination = {
        totalDocs: totalCount,
        limit: limitNum,
        totalPages,
        page: pageNum,
        pagingCounter: skip + 1,
        hasPrevPage: pageNum > 1,
        hasNextPage: pageNum < totalPages,
        prevPage: pageNum > 1 ? pageNum - 1 : null,
        nextPage: pageNum < totalPages ? pageNum + 1 : null,
      };

      res.status(200).json({ docs, pagination });
    } catch (error) {
      console.error('Error fetching admission programs:', error);
      res.status(500).json({ error: 'Failed to fetch admission programs.' });
    }
  });





  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      // Use Payload's login method
      const user = await payload.find({
        collection: 'users',  // Replace with your actual collection slug
        where: {
          email: {
            equals: email,
          },
        },
      });

      // If no user is found, throw an error
      if (user.totalDocs === 0) {
        return res.status(400).json({ error: 'Invalid email or password.' });
      }

      const result = await payload.login({
        collection: 'users',  // Replace with your actual collection slug
        data: {
          email,
          password
        }
      });

      // Check if email is verified
      if (!result.user._verified) {
        return res.status(401).json({ error: 'Please verify your email before logging in.' });
      }

      // Return the user and token
      res.status(200).json({
        message: 'Login successful.',
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      console.error('Login failed:', error);

      // Handle specific error responses
      if (error.message === 'Incorrect email or password') {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  app.listen(process.env.PORT || 3000)
}

start()
