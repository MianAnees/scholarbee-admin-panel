import express from 'express'
import payload from 'payload'
import cors from 'cors'; // Import the CORS middleware
import crypto from 'crypto';
import { transporter } from './utiles/mailConfig';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
// import { assignSortingWeightsToPrograms } from './utiles/sortingWeights';

// import router from './customRoutes/routes';
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
// app.get('/test', (_, res) => {
//   console.log("----test--")
//   res.send(assignSortingWeightsToPrograms());
//   // res.send(assignRandomSeatsToPrograms());
//   // res.send(updateSortingWeights());
// })

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
      fromName: 'Admin Scholarbee ',
      fromAddress: 'Alitahir@pickysolutions.com',
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
        from: 'alitahir@pickysolutions.com',
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
      console.log(error)
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

  // Helper function to build base pipeline
  // ******************* Filter based admission programs **********************

  app.get('/api/admission-programs-with-filters', async (req, res) => {
    const { _id, major, fee, year, intake, programName, university, studyLevel, courseForm, campusId, page = 1, limit = 10 } = req.query;
    console.log(_id, major, fee, year, intake, programName, university, studyLevel, courseForm, campusId, "----- in aggregation ----");

    try {
      const pipeline = [];

      // Check if _id is present in query params
      if (_id) {
        pipeline.push({
          $match: {
            _id: { $eq: new ObjectId(_id.toString()) }, // Ensure proper conversion to ObjectId
          },
        });

        // Add lookups for a single record
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
              {
                $lookup: {
                  from: 'academic_departments',
                  let: { academicDepartmentId: '$academic_departments' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$_id', { $toObjectId: '$$academicDepartmentId' }],
                        },
                      },
                    },
                  ],
                  as: 'academic_departments',
                },
              },
              { $unwind: { path: '$academic_departments', preserveNullAndEmptyArrays: true } },
              // Include sorting_weight in the pipeline
            ],
            as: 'program',
          },
        });

        pipeline.push({ $unwind: '$program' });

        pipeline.push({
          $lookup: {
            from: 'fee_structures',
            let: { programId: '$program._id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toObjectId: '$program_id' }, '$$programId'],
                  },
                },
              },
            ],
            as: 'fee_structures',
          },
        });

        // Sorting for single record (not relevant but kept for consistency)
        pipeline.push({ $sort: { 'program.sorting_weight': -1 } });

        const result = await payload.db.collections['admission_programs'].aggregate(pipeline);

        if (result.length > 0) {
          res.status(200).json({ doc: result[0] });
        } else {
          res.status(404).json({ error: 'Record not found.' });
        }

        return; // Return after processing single record
      }

      // Pagination and filtering logic for multiple records
      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 10;
      const skip = (pageNum - 1) * limitNum;

      pipeline.push({
        $lookup: {
          from: 'admissions',
          let: { admissionId: { $toObjectId: '$admission' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$admissionId'],
                },
              },
            },
            {
              $lookup: {
                from: 'universities',
                let: { universityId: { $toObjectId: '$university_id' } },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$universityId'],
                      },
                    },
                  },
                ],
                as: 'university',
              },
            },
            { $unwind: { path: '$university', preserveNullAndEmptyArrays: true } },
            {
              $lookup: {
                from: 'campuses',
                let: { campusId: { $toObjectId: '$campus_id' } },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$campusId'],
                      },
                    },
                  },
                  {
                    $lookup: {
                      from: 'addresses',
                      let: { addressId: { $toObjectId: '$address_id' } },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $eq: ['$_id', '$$addressId'],
                            },
                          },
                        },
                      ],
                      as: 'address',
                    },
                  },
                  { $unwind: { path: '$address', preserveNullAndEmptyArrays: true } },
                ],
                as: 'campus',
              },
            },
            { $unwind: { path: '$campus', preserveNullAndEmptyArrays: true } },
          ],
          as: 'admission',
        },
      });
      pipeline.push({ $unwind: '$admission' });

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
            {
              $lookup: {
                from: 'academic_departments',
                let: { academicDepartmentId: '$academic_departments' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', { $toObjectId: '$$academicDepartmentId' }],
                      },
                    },
                  },
                ],
                as: 'academic_departments',
              },
            },
            { $unwind: { path: '$academic_departments', preserveNullAndEmptyArrays: true } },
            // Include sorting_weight for consistency
          ],
          as: 'program',
        },
      });
      pipeline.push({ $unwind: '$program' });

      pipeline.push({
        $lookup: {
          from: 'fee_structures',
          let: { programId: '$program._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toObjectId: '$program_id' }, '$$programId'],
                },
              },
            },
          ],
          as: 'fee_structures',
        },
      });

      // Apply filters
      if (major) pipeline.push({ $match: { 'program.name': { $regex: major, $options: 'i' } } });
      if (programName) pipeline.push({ $match: { 'program.name': { $regex: programName, $options: 'i' } } });
      if (university) pipeline.push({ $match: { 'admission.university_id': { $eq: university } } });
      if (campusId) pipeline.push({ $match: { 'program.campus_id': { $eq: campusId } } });
      if (year) pipeline.push({ $match: { 'admission.admission_startdate': { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year}-12-31`) } } });
      if (intake) pipeline.push({ $match: { 'program.intake_periods.intake_period': { $regex: intake, $options: 'i' } } });
      if (studyLevel) pipeline.push({ $match: { 'program.degree_level': { $regex: studyLevel, $options: 'i' } } });
      if (courseForm) pipeline.push({ $match: { 'program.mode_of_study': { $regex: courseForm, $options: 'i' } } });
      if (fee) {
        const [minFee, maxFee] = (fee as string).split('-').map(Number);
        pipeline.push({ $match: { 'fee_structures.tuition_fee': { $gte: minFee, $lte: maxFee } } });
      }

      // Add sorting by program.sorting_weight
      pipeline.push({ $sort: { 'program.sorting_weight': -1 } });

      // Pagination
      pipeline.push({
        $facet: {
          docs: [{ $skip: skip }, { $limit: limitNum }],
          totalCount: [{ $count: 'count' }],
        },
      });

      const result = await payload.db.collections['admission_programs'].aggregate(pipeline)

      const docs = result[0]?.docs || [];
      const totalCount = result[0]?.totalCount?.[0]?.count || 0;
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

      // res.status(200).json({ docs, totalCount, totalPages, currentPage: pageNum });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



  app.get('/api/admission-dashboard-stats', async (req, res) => {
    const { campusId, year } = req.query;

    try {
      const pipeline = [];

      // Match by campusId if provided (you may need to adjust how this is handled if there's a relation to departments or programs)
      if (campusId) {
        pipeline.push({
          $match: {
            'campus_id': { $eq: campusId }, // Modify based on how campus_id is stored
          },
        });
      }

      // Match by year if provided
      if (year) {
        pipeline.push({
          $match: {
            'submission_date': {
              $gte: new Date(`${year}-01-01`),
              $lt: new Date(`${year}-12-31`),
            },
          },
        });
      }

      // Group stats based on status
      pipeline.push({
        $group: {
          _id: null,
          totalReceived: { $sum: 1 },
          totalApproved: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0],
            },
          },
          totalRejected: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0],
            },
          },
          totalPending: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0],
            },
          },
          dailyReceived: {
            $sum: {
              $cond: [
                { $gte: ['$submission_date', new Date(Date.now() - 24 * 60 * 60 * 1000)] },
                1,
                0,
              ],
            },
          },
        },
      });

      // Run aggregation
      const result = await payload.db.collections['applications'].aggregate(pipeline);
      console.log(result, "-----in stats of applications------", pipeline)
      if (result.length > 0) {
        const stats = result[0];
        res.status(200).json({
          receivedAdmissions: {
            count: stats.totalReceived,
            daily: stats.dailyReceived,
          },
          approvedAdmissions: {
            count: stats.totalApproved,
            daily: stats.dailyReceived, // Adjust based on approval time if needed
          },
          rejectedAdmissions: {
            count: stats.totalRejected,
            daily: stats.dailyReceived, // Adjust based on rejection time if needed
          },
          pendingAdmissions: {
            count: stats.totalPending,
            daily: stats.dailyReceived, // Adjust based on pending time if needed
          },
        });
      } else {
        res.status(404).json({ error: 'No statistics available for the given filters.' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.get('/api/contact-us-stats', async (req, res) => {
    try {
      // Step 1: Count total records for percentage calculation
      const totalRecords = await payload.db.collections['contact-us'].countDocuments();

      // Aggregation Pipelines for Other Stats
      const pipeline = [
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            type: '$_id',
            count: 1,
            _id: 0
          }
        }
      ];

      const userTypePipeline = [
        {
          $group: {
            _id: '$user_type',
            count: { $sum: 1 }
          }
        }
      ];

      const studyLevelPipeline = [
        {
          $group: {
            _id: '$study_level',
            count: { $sum: 1 }
          }
        }
      ];

      const scholarshipPipeline = [
        {
          $group: {
            _id: '$is_scholarship',
            count: { $sum: 1 }
          }
        }
      ];

      // Gender Pipeline with Percentage Calculation
      const genderPipeline = [
        {
          $group: {
            _id: '$gender',
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            gender: '$_id',
            count: 1,
            percentage: {
              $multiply: [
                { $divide: ['$count', totalRecords] },
                100
              ]
            },
            _id: 0
          }
        }
      ];

      // Execute all aggregations in parallel
      const [
        inquiryTypeStats,
        userTypeStats,
        studyLevelStats,
        scholarshipStats,
        genderStats
      ] = await Promise.all([
        payload.db.collections['contact-us'].aggregate(pipeline),
        payload.db.collections['contact-us'].aggregate(userTypePipeline),
        payload.db.collections['contact-us'].aggregate(studyLevelPipeline),
        payload.db.collections['contact-us'].aggregate(scholarshipPipeline),
        payload.db.collections['contact-us'].aggregate(genderPipeline),
      ]);

      // Send the response with the stats
      res.status(200).json({
        inquiryTypeStats,
        userTypeStats,
        studyLevelStats,
        scholarshipStats,
        genderStats // This will include gender percentages
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
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
