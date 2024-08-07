import React from 'react';
import axios from 'axios';

const FormSubmissionButton = ({ documentId }) => {
    const handleFormSubmission = async () => {
        try {
            // Fetch the form document by ID
            const response = await axios.get(`/api/forms/${documentId}`);
            const formData = response.data;

            // Process formData and submit it
            // Example: You can submit form data using another API endpoint
            const submitResponse = await axios.post('/api/form-submissions', {
                formData,
                submittedAt: new Date().toISOString(),
            });

            // Handle success or display notification
            console.log('Form submitted successfully:', submitResponse.data);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <button onClick={handleFormSubmission}>Submit Form</button>
    );
};

export default FormSubmissionButton;
