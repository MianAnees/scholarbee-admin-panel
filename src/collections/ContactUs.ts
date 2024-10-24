import { CollectionConfig } from 'payload/types';

const ContactUs: CollectionConfig = {
    slug: 'contact-us',
    labels: {
        singular: 'Contact Us',
        plural: 'Contact Us',
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
