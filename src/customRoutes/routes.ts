import { Router } from 'express';
import { generateERD } from '../scripts/generate-erd';

const router = Router();

// Route to handle form submissions
// router.post('/form-submissions', async (req, res) => {
//     const { formData, submittedAt } = req.body;

//     try {
//         // Process formData and save it to your database or perform other actions
//         // Example: Save formData to a collection dedicated to form submissions
//         const submission = await FormResponses.create({
//             formData,
//             submittedAt,
//         });

//         res.status(201).json(submission);
//     } catch (error) {
//         console.error('Error processing form submission:', error);
//         res.status(500).json({ error: 'Failed to process form submission' });
//     }
// });

router.post('/generate-erd', async (req, res) => {
    try {
        res.status(201).json({ data: generateERD() })
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate the ERD, ' + error.message });
    }
})

export default router;
