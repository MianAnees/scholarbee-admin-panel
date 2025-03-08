import { CollectionConfig } from 'payload/types';

const Universities: CollectionConfig = {
    slug: 'universities',
    labels: {
        singular: 'University',
        plural: 'Universities',

    },
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'logo_url'],
    },
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
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Name',
        },
        {
            name: 'founded',
            type: 'date',
            required: false,
            label: 'Founded',
        },
        {
            name: 'description',
            type: 'textarea',
            required: false,
            label: 'Description',
        },
        {
            name: 'address_id',
            type: 'relationship',
            relationTo: 'addresses',
            required: false,
            label: 'Address',
        },
        {
            name: 'website',
            type: 'text',
            required: false,
            label: 'Website',
        },
        {
            name: 'ranking',
            type: 'text',
            required: false,
            label: 'Ranking',
        },
        {
            name: 'affiliations',
            type: 'textarea',
            required: false,
            label: 'Affiliations',
        },
        {
            name: 'motto',
            type: 'text',
            required: false,
            label: 'Motto',
        },
        {
            name: 'colors',
            type: 'text',
            required: false,
            label: 'Colors',
        },
        {
            name: 'mascot',
            type: 'text',
            required: false,
            label: 'Mascot',
        },
        {
            name: 'type',
            type: 'text',
            required: false,
            label: 'Type',
        },
        {
            name: 'total_students',
            type: 'number',
            required: false,
            label: 'Total Students',
        },
        {
            name: 'total_faculty',
            type: 'number',
            required: false,
            label: 'Total Faculty',
        },
        {
            name: 'total_alumni',
            type: 'number',
            required: false,
            label: 'Total Alumni',
        },
        {
            name: 'endowment',
            type: 'text',
            required: false,
            label: 'Endowment',
        },
        {
            name: 'campus_size',
            type: 'text',
            required: false,
            label: 'Campus Size',
        },
        {
            name: 'annual_budget',
            type: 'number',
            required: false,
            label: 'Annual Budget (Millions)',
        },
        {
            name: 'research_output',
            type: 'number',
            required: false,
            label: 'Research Output',
        },
        {
            name: 'international_students',
            type: 'number',
            required: false,
            label: 'International Students',
        },
        {
            name: 'languages',
            type: 'textarea',
            required: false,
            label: 'Languages',
        },
        {
            name: 'logo_url',
            type: 'text',
            required: false,
            label: 'Logo Image URL',
            admin: {
                description: 'Provide the URL of the logo image stored in S3 or another storage service.',
            },
        },
        {
            name: 'accreditations',
            type: 'textarea',
            required: false,
            label: 'Accreditations',
        },
        {
            name: 'notable_alumni',
            type: 'textarea',
            required: false,
            label: 'Notable Alumni',
        },
        {
            name: 'created_at',
            type: 'date',
            required: false,
            label: 'Created At',
            admin: {
                readOnly: true,
            },
            defaultValue: () => new Date().toISOString(),
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

export default Universities;
