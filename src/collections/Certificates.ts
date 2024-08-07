import { CollectionConfig } from 'payload/types';

const Certificates: CollectionConfig = {
    slug: 'certificates',
    labels: {
        singular: 'Certificate',
        plural: 'Certificates',
    },
    admin: {
        useAsTitle: 'certificate_name',
    },
    fields: [
        {
            name: 'certificate_name',
            type: 'text',
            required: true,
            label: 'Certificate Name',
            admin: {
                description: 'Name of the certificate',
            },
        },
        {
            name: 'certificate_type',
            type: 'select',
            options: [
                'High School Diploma',
                "Bachelor's Degree",
                "Master's Degree",
                'Ph.D.',
                'Other',
            ],
            required: true,
            label: 'Certificate Type',
            admin: {
                description: 'Type of the certificate',
            },
        },
        {
            name: 'attachment_url',
            type: 'upload',
            relationTo: 'media',
            required: false,
            label: 'Attachment URL',
            admin: {
                description: 'Certificates',
            },
        },
        {
            name: 'certificate_created_date',
            type: 'date',
            required: true,
            label: 'Certificate Creation Date',
            admin: {
                description: 'Date when the certificate was created',
            },
        },
        {
            name: 'user_id',
            type: 'relationship',
            relationTo: 'users',
            label: 'User',
            admin: {
                description: 'User who created the certificate',
            },
        },
    ],
};

export default Certificates;
