import { CollectionConfig } from 'payload/types';

const ProgramsTemplate: CollectionConfig = {
    slug: 'programs-template',
    labels: {
        singular: 'Program Template',
        plural: 'Programs Templates',
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
            label: 'Program Name',
            admin: {
                placeholder: 'Enter the name of the program template',
            },
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            label: 'Slug',
            admin: {
                placeholder: 'Unique identifier (e.g., program-template-name)',
                description: 'This will be used in URLs.',
            },
        },
        {
            name: 'tags',
            type: 'array',
            label: 'Tags',
            minRows: 0,
            maxRows: 10,
            fields: [
                {
                    name: 'tag',
                    type: 'text',
                    required: true,
                    label: 'Tag',
                },
            ],
            admin: {
                description: 'Add tags to help categorize or search programs.',
            },
        },
        {
            name: 'group',
            type: 'text',
            required: false,
            label: 'Group',
            admin: {
                placeholder: 'Enter the group or category of the program template',
            },
        },
        {
            name: 'description',
            type: 'textarea',
            required: false,
            label: 'Description',
            admin: {
                placeholder: 'Provide a brief description of the program template',
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

export default ProgramsTemplate;
