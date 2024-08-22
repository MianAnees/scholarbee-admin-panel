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
    let userCreated = false; // Flag to track if the user was successfully created
    let user: any;
    try {
      // Check if the email already exists
      const existingUser = await payload.find({
        collection: 'users',
        where: { email: { equals: email } },
        limit: 1
      });

      if (existingUser && existingUser.docs.length > 0) {
        return res.status(400).json({ error: "Email already exists." });
      }

      // Create user
      user = await payload.create({
        collection: 'users',
        data: {
          email, password, first_name, last_name, phone_number, user_type
        },
        overrideAccess: true,
      });
      userCreated = true; // Update flag once user is created

      // Generate verification token
      const verifyToken = crypto.randomBytes(20).toString('hex');

      // Attempt to update user with verification token (could be combined in creation step)
      await payload.update({
        collection: 'users',
        id: user.id,
        data: { verifyToken, _verified: false },
        overrideAccess: true,
      });

      // Prepare and send the verification email
      const verificationUrl = `${process.env.FRONTEND_URL}/verification/${verifyToken}`;
      const mailOptions: any = {
        from: 'basitafraz8@gmail.com',
        to: user.email,
        subject: 'Verify Your Email Address',
        html: `<p>Please verify your email by clicking the following link: <a href="Verification Link">${verificationUrl}</a></p>`
      };

      transporter.sendMail(mailOptions);
      res.status(200).json({ user }); // Final success response
    } catch (error) {
      res.status(500).json({ error: 'Failed to complete signup.' });
    }
  });


  app.get('/api/verify-email/:verifyToken', async (req, res) => {
    const { verifyToken } = req.params;

    try {
      // Find the user with the given verification token
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
        return res.status(404).json({ error: 'Verification token is invalid or expired.' });
      }

      const user = result.docs[0];

      // Update the user's verified status
      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          _verified: true,
          verifyToken: ''  // Optionally clear the verification token
        },
        overrideAccess: true
      });

      res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
      console.error('Failed to verify email:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      // Use Payload's login method
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
