import { CollectionConfig } from 'payload/types';

const Courses: CollectionConfig = {
    slug: 'courses',
    labels: {
        singular: 'Course',
        plural: 'Courses',
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
    admin: {
        useAsTitle: 'course_name',
    },
    fields: [
        {
            name: 'program_id',
            type: 'relationship',
            relationTo: 'programs',
            required: false,
            label: 'Program',
        },
        {
            name: 'course_name',
            type: 'text',
            required: true,
            label: 'Course Name',
        },
        {
            name: 'course_description',
            type: 'textarea',
            required: false,
            label: 'Course Description',
        },
        {
            name: 'course_duration',
            type: 'text',
            required: false,
            label: 'Course Duration',
            admin: {
                description: 'Duration in months',
            },
        },
        {
            name: 'course_fee',
            type: 'number',
            required: false,
            label: 'Course Fee',
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

export default Courses;
