import React, { useState } from 'react';
import { useDocument } from 'payload/components';
import { useForm } from 'react-hook-form';

const DynamicForm = ({ form }) => {
    const { register, handleSubmit } = useForm();
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (data) => {
        try {
            setSubmitting(true);
            // Handle form submission logic here
            console.log('Form data:', data);
            // You can submit form data to a backend API or store it in the database
            alert('Form submission logic can be implemented here.');
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {form.fields.map((field, index) => (
                <div key={index}>
                    <label>{field.label}</label>
                    {field.type === 'text' && (
                        <input
                            type="text"
                            name={`field_${field._id}`} // Replace with appropriate field ID or name
                            ref={register({ required: field.required })}
                        />
                    )}
                    {/* Add other field types (textarea, select, etc.) as needed */}
                </div>
            ))}
            <button type="submit" disabled={submitting}>
                Submit
            </button>
        </form>
    );
};

export default DynamicForm;
