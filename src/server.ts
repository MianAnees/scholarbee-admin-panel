import express from 'express'
import payload from 'payload'
import cors from 'cors'; // Import the CORS middleware
import crypto from 'crypto';
import { transporter } from './utiles/mailConfig';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import { insertDataToCollections } from './scripts/insert-data-api';

import { assignSortingWeightsToPrograms } from './utiles/sortingWeights';

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
app.get('/test', (_, res) => {
  console.log("----test--")
  res.send(assignSortingWeightsToPrograms());
  // res.send(assignRandomSeatsToPrograms());
  // res.send(updateSortingWeights());
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
                    $and: [
                      { $eq: ['$_id', { $toObjectId: '$$admissionId' }] }, // Match the admission ID
                      { $gt: ['$$NOW', '$admission_deadline'] }, // Ensure current date is past the admission_deadline
                    ],
                  },
                },
              },
            ],
            as: 'admission',
          },
        });

        // Unwind the resulting `admission` array
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



  app.post('/api/compare-universities', async (req, res) => {
    try {
      const { programIds } = req.body;

      const comparisonData = await payload.db.collections["programs"].aggregate([
        // Match the specified program IDs
        {
          "$match": {
            "_id": { "$in": programIds.map((id) => new ObjectId(id)) }
          }
        },
        // Lookup campus details
        {
          "$lookup": {
            "from": "campuses",
            "let": { "campusId": { "$toObjectId": "$campus_id" } },
            "pipeline": [
              {
                "$match": {
                  "$expr": { "$eq": ["$_id", "$$campusId"] }
                }
              }
            ],
            "as": "campus"
          }
        },
        {
          "$unwind": {
            "path": "$campus",
            "preserveNullAndEmptyArrays": true
          }
        },
        // Lookup address details
        {
          "$lookup": {
            "from": "addresses",
            "let": { "addressId": { "$toObjectId": "$campus.address_id" } },
            "pipeline": [
              {
                "$match": {
                  "$expr": { "$eq": ["$_id", "$$addressId"] }
                }
              }
            ],
            "as": "campusAddress"
          }
        },
        {
          "$unwind": {
            "path": "$campusAddress",
            "preserveNullAndEmptyArrays": true
          }
        },
        // Lookup fee structures
        {
          "$lookup": {
            "from": "fee_structures",
            "let": { "programId": "$_id" },
            "pipeline": [
              {
                "$match": {
                  "$expr": {
                    "$eq": [
                      { "$toObjectId": "$program_id" },
                      { "$toObjectId": "$$programId" }
                    ]
                  }
                }
              }
            ],
            "as": "fees"
          }
        },
        {
          "$unwind": {
            "path": "$fees",
            "preserveNullAndEmptyArrays": true
          }
        },
        // Lookup university details
        {
          "$lookup": {
            "from": "universities",
            "let": { "universityId": { "$toObjectId": "$campus.university_id" } },
            "pipeline": [
              {
                "$match": {
                  "$expr": { "$eq": ["$_id", "$$universityId"] }
                }
              }
            ],
            "as": "university"
          }
        },
        {
          "$unwind": {
            "path": "$university",
            "preserveNullAndEmptyArrays": true
          }
        },
        // Add tuitionFee and applicationFee fields with default values
        {
          "$addFields": {
            "tuitionFee": { "$ifNull": ["$fees.tuition_fee", 0] },
            "applicationFee": { "$ifNull": ["$fees.application_fee", 0] }
          }
        },
        // Group the results
        {
          "$group": {
            "_id": "$_id",
            "programName": { "$first": "$name" },
            "major": { "$first": "$major" },
            "duration": { "$first": "$duration" },
            "creditHours": { "$first": "$credit_hours" },
            "degreeLevel": { "$first": "$degree_level" },
            "modeOfStudy": { "$first": "$mode_of_study" },
            "languageOfInstruction": { "$first": "$language_of_instruction" },
            "campusName": { "$first": "$campus.name" },
            "campusFacilities": { "$first": "$campus.facilities" },
            "campusLogo": { "$first": "$campus.logo_url" },
            "campusAddress": { "$first": "$campusAddress" },
            "universityName": { "$first": "$university.name" },
            "universityRanking": { "$first": "$university.ranking" },
            "totalTuitionFee": { "$sum": "$tuitionFee" },
            "totalApplicationFee": { "$sum": "$applicationFee" },
            "currency": { "$first": "$fees.currency" }
          }
        },
        // Calculate total fee
        {
          "$addFields": {
            "totalFee": {
              "$add": ["$totalTuitionFee", "$totalApplicationFee"]
            }
          }
        }
      ]
      );
      console.log(JSON.stringify([
        // Match the specified program IDs
        {
          $match: {
            _id: { $in: programIds.map((id) => new ObjectId(id)) },
          },
        },
        // Lookup campus details

        {
          $lookup: {
            from: "campuses",
            let: {
              campusId: {
                $toObjectId: "$campus_id"
              }
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$campusId"]
                  }
                }
              }
            ],
            as: "campus"
          }
        },
        {
          $unwind: {
            path: "$campus",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "fee_structures",
            let: {
              programId: "$_id"
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [
                      {
                        $toObjectId: "$program_id"
                      },
                      {
                        $toObjectId: "$$programId"
                      }
                    ]
                  }
                }
              }
            ],
            as: "fees"
          }
        },
        {
          $unwind: {
            path: "$fees",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "universities",
            let: {
              universityId: {
                $toObjectId: "$campus.university_id"
              }
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$universityId"]
                  }
                }
              }
            ],
            as: "university"
          }
        },
        {
          $unwind: {
            path: "$university",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            tuitionFee: {
              $ifNull: ["$fees.tuition_fee", 0]
            },
            applicationFee: {
              $ifNull: ["$fees.application_fee", 0]
            }
          }
        },
        {
          $group: {
            _id: "$_id",
            programName: {
              $first: "$name"
            },
            major: {
              $first: "$major"
            },
            duration: {
              $first: "$duration"
            },
            creditHours: {
              $first: "$credit_hours"
            },
            degreeLevel: {
              $first: "$degree_level"
            },
            modeOfStudy: {
              $first: "$mode_of_study"
            },
            languageOfInstruction: {
              $first: "$language_of_instruction"
            },
            campusName: {
              $first: "$campus.name"
            },
            campusFacilities: {
              $first: "$campus.facilities"
            },
            universityName: {
              $first: "$university.name"
            },
            universityRanking: {
              $first: "$university.ranking"
            },
            totalTuitionFee: {
              $sum: "$tuitionFee"
            },
            totalApplicationFee: {
              $sum: "$applicationFee"
            },
            currency: {
              $first: "$fees.currency"
            }
          }
        },
        {
          $addFields: {
            totalFee: {
              $add: [
                "$totalTuitionFee",
                "$totalApplicationFee"
              ]
            }
          }
        }

      ]))
      res.status(200).json({ comparison: comparisonData });
    } catch (error) {
      console.error('Error fetching comparison data:', error);
      res.status(500).json({ error: 'Failed to fetch comparison data.' });
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


  app.post('/api/insert-data', async (req, res) => {
    try {
      const data = req.body;
      if (!data || !data.universities) {
        console.log(data)
        return res.status(400).json({ message: 'Invalid request data' });
      }
      console.log(data, "---- out of if ---")

      await insertDataToCollections(data);
      res.status(200).json({ message: 'Data inserted successfully!' });
    } catch (error) {
      console.error('Error in /api/insert-data:', error);
      res.status(500).json({ message: 'An error occurred during insertion.', error });
    }
  });

  // app.post('/api/compare-universities', async (req, res) => {
  //   try {
  //     const { universityIds } = req.body; // Array of university IDs to compare

  //     if (!universityIds || universityIds.length !== 2) {
  //       return res.status(400).json({ error: 'Please provide exactly two university IDs for comparison.' });
  //     }

  //     // Fetch universities
  //     const universities = await payload.db.collections.universities.find({
  //       where: {
  //         id: {
  //           in: universityIds,
  //         },
  //       },
  //     });

  //     // Fetch campuses associated with the universities
  //     const campuses = await payload.db.collections.campuses.find({
  //       where: {
  //         university_id: {
  //           in: universityIds,
  //         },
  //       },
  //     });

  //     // Fetch programs associated with the campuses
  //     const programIds = campuses.docs.map((campus) => campus.id);
  //     const programs = await payload.db.collections.programs.find({
  //       where: {
  //         campus_id: {
  //           in: programIds,
  //         },
  //       },
  //     });

  //     // Fetch fee structures associated with the programs
  //     const feeStructures = await payload.db.collections.fee_structures.find({
  //       where: {
  //         program_id: {
  //           in: programs.docs.map((program) => program.id),
  //         },
  //       },
  //     });

  //     // Process the comparison data
  //     const comparisonData = universities.docs.map((university) => {
  //       const campus = campuses.docs.find((c) => c.university_id === university.id);
  //       const uniPrograms = programs.docs.filter((p) => p.campus_id === campus?.id);
  //       const fees = feeStructures.docs.filter((f) =>
  //         uniPrograms.some((p) => p.id === f.program_id)
  //       );

  //       return {
  //         name: university.name,
  //         location: campus?.address_id, // Replace with actual field if `address_id` needs mapping
  //         gpa: university.gpa || 'N/A',
  //         ib: university.ib || 'N/A',
  //         percentageSystem: university.percentageSystem || 'N/A',
  //         tuition: fees.reduce((sum, f) => sum + f.tuition_fee, 0) || 0,
  //         costOfLiving: campus?.cost_of_living || 0,
  //         total: fees.reduce((sum, f) => sum + f.tuition_fee, 0) + (campus?.cost_of_living || 0),
  //         ielts: university.ielts || 'N/A',
  //         toefl: university.toefl || 'N/A',
  //         sat: university.sat || 'N/A',
  //         students: university.total_students || 0,
  //         facultyStrength: university.total_faculty || 0,
  //         internationalStudents: university.international_students || 0,
  //         acceptanceRate: university.acceptance_rate || 'N/A',
  //         numberOfCourses: uniPrograms.length || 0,
  //       };
  //     });

  //     res.status(200).json({ comparison: comparisonData });
  //   } catch (error) {
  //     console.error('Error fetching comparison data:', error);
  //     res.status(500).json({ error: 'Failed to fetch comparison data.' });
  //   }
  // });

  app.listen(process.env.PORT || 3000)
}

start()
