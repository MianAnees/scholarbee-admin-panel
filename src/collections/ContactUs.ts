import { CollectionConfig } from 'payload/types';

const ContactUs: CollectionConfig = {
    slug: 'contact-us',
    labels: {
        singular: 'Contact Us',
        plural: 'Contact Us',
    },
    auth: false, // Disable authentication for this collection
    access: {
        // Public access to read and create
        read: () => true,  // Allow public read access (if needed, otherwise you can restrict it)
        create: () => true,  // Allow public creation of contact entries
    },
    fields: [
        {
            name: 'type',
            type: 'select',
            options: [
                {
                    label: 'General Inquiry',
                    value: 'general',
                },
                {
                    label: 'Technical Support',
                    value: 'technical_support',
                },
                {
                    label: 'Sales',
                    value: 'sales',
                },
                {
                    label: 'Registration',
                    value: 'registration',
                },
                {
                    label: 'Feedback',
                    value: 'feedback',
                },
                // You can add more types as needed
            ],
            required: false,
            label: 'Type of Inquiry',
        },
        {
            name: 'email',
            type: 'email',
            required: false,
            label: 'Email Address',
        },
        {
            name: 'phone',
            type: 'text',
            required: false,
            label: 'Phone Number',
        },
        {
            name: 'name',
            type: 'text',
            required: false,
            label: 'Full Name',
        },
        {
            name: 'user_type',
            type: 'select',
            options: [
                'Student',
                'Admin',
            ],
            required: true,
            label: 'User Type',
        },
        {
            name: 'study_level',
            type: 'select',
            options: [
                'Bachelor',
                'Master',
                'Phd',
            ],
            required: false,
            label: 'Study Type',
        },
        {
            name: 'study_country',
            type: 'text',
            required: false,
            label: 'Country',
        },
        {
            name: 'is_scholarship',
            type: 'checkbox',
            defaultValue: false,
            label: 'Scholarships',
        },
        {
            name: 'message',
            type: 'textarea',
            required: false,
            label: 'Message',
        },
        {
            name: 'created_at',
            type: 'date',
            admin: {
                readOnly: true,
            },
            defaultValue: () => new Date().toISOString(),
            label: 'Created At',
        },
    ],
};

export default ContactUs;


