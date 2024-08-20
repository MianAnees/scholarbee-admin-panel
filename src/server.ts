import express from 'express'
import payload from 'payload'
import router from './customRoutes/routes'
import cors from 'cors'; // Import the CORS middleware

require('dotenv').config()
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
  })

  app.post('/api/signup', async (req, res) => {
    const { email, password, first_name, last_name, phone_number, user_type } = req.body;

    try {
      const user = await payload.create({
        collection: 'users',
        data: {
          email,
          password,
          first_name,
          last_name,
          phone_number,
          user_type
        },
        overrideAccess: true,
      });

      res.status(200).json({ user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.listen(process.env.PORT || 3000)
}

start()
