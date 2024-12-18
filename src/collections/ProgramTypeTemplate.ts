import { CollectionConfig } from 'payload/types';

const ProgramTypeTemplate: CollectionConfig = {
    slug: 'program_type_template',
    labels: {
        singular: 'Program Type Template',
        plural: 'Program Type Templates',
    },
    admin: {
        useAsTitle: 'name',
    },
    access: {
        // Allow public read access
        read: () => true,

        // Restrict create, update, and delete to authenticated users
        create: ({ req: { user } }) => !!user, // Only allow if a user is logged in
        update: ({ req: { user } }) => !!user, // Only allow if a user is logged in
        delete: ({ req: { user } }) => !!user, // Only allow if a user is logged in
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Program Type Name',
            admin: {
                placeholder: 'Enter the name of the program type',
            },
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            label: 'Slug',
            admin: {
                placeholder: 'Unique identifier (e.g., program-type-name)',
                description: 'This will be used in URLs.',
            },
        },
        {
            name: 'description',
            type: 'textarea',
            required: false,
            label: 'Description',
            admin: {
                placeholder: 'Provide a brief description of the program type',
            },
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
            name: 'updated_at',
            type: 'date',
            admin: {
                readOnly: true,
            },
            hooks: {
                beforeChange: [({ data }) => (data.updated_at = new Date().toISOString())],
            },
            label: 'Updated At',
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

export default ProgramTypeTemplate;
