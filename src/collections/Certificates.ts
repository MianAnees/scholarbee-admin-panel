import { CollectionConfig } from 'payload/types';

const Certificates: CollectionConfig = {
    slug: 'certificates',
    admin: {
        useAsTitle: "certificate_name"
    },
    fields: [
        {
            name: 'certificate_name',
            type: 'text',
            required: true,
            admin: {
                description: 'Name of the certificate',
            },
        },
        {
            name: 'certificate_type',
            type: 'select',
            options: [
                'High School Diploma',
                'Bachelor\'s Degree',
                'Master\'s Degree',
                'Ph.D.',
                'Other',
            ],
            required: true,
            admin: {
                description: 'Type of the certificate',
            },
        },
        {
            name: 'attachment_url',
            type: 'upload',
            relationTo: 'media',
            required: false,
            admin: {
                description: 'Certificates',
            },
        },
        {
            name: 'certificate_created_date',
            label: "Certificate Creation Date",
            type: 'date',
            required: true,
            admin: {
                description: 'Date when the certificate was created',
            },
        },
        {
            name: 'user_id',
            type: 'relationship',
            relationTo: 'users',
            admin: {
                description: 'User who created the certificate',
            },
        },
    ],
};

export default Certificates;
