import { CollectionConfig } from 'payload/types';

const AdmissionPrograms: CollectionConfig = {
    slug: 'admission_programs',
    access: {
        // Allow public read access
        read: () => true,

        // Restrict create, update, and delete to authenticated users
        create: ({ req: { user } }) => {
            return !!user; // Only allow if a user is logged in
        },
        update: ({ req: { user } }) => {
            return !!user; // Only allow if a user is logged in
        },
        delete: ({ req: { user } }) => {
            return !!user; // Only allow if a user is logged in
        },
    },
    labels: {
        singular: 'Admission Program',
        plural: 'Admission Programs',
    },
    fields: [
        {
            name: 'admission',
            type: 'relationship',
            relationTo: 'admissions',
            required: true,
            label: 'Admission',
        },
        {
            name: 'program',
            type: 'relationship',
            relationTo: 'programs',
            required: true,
            label: 'Program',
        },
        {
            name: 'admission_fee',
            type: 'text',
            required: false,
            label: 'Fee',
        },
        {
            name: 'redirect_deeplink',
            type: 'text',
            required: false,
            label: 'Redirection Link',
        },
        {
            name: 'available_seats',
            type: 'number',
            required: true,
            label: 'Available Seats',
        },
        {
            name: 'admission_requirements',
            type: 'array',
            label: 'Admission Requirements',
            fields: [
                {
                    name: 'key',
                    type: 'text',
                    label: 'Requirement Key',
                    required: true,
                },
                {
                    name: 'value',
                    type: 'richText', // Changed to richText
                    label: 'Requirement Value',
                    required: true,
                },
            ],
        },
        {
            name: 'favouriteBy',
            type: 'relationship',
            relationTo: 'users',
            hasMany: true, // Allows multiple users to be stored
            label: 'Favourite By Users',
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
        {
            name: 'createdBy',
            type: 'relationship',
            relationTo: 'users', // Assuming 'users' is the slug for your users collection
            admin: {
                position: 'sidebar',
                readOnly: true,
            },
        },
    ],
    hooks: {
        beforeChange: [
            ({ data, req, operation }) => {
                if (operation === 'create' && req.user) {
                    data.createdBy = req.user.id; // Assign the user ID to the createdBy field
                }
                return data;
            },
        ],
    },
};

export default AdmissionPrograms;
