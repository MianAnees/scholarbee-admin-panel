import { CollectionConfig } from 'payload/types';

const AcademicDepartments: CollectionConfig = {
    slug: 'academic_departments',
    labels: {
        singular: 'Academic Department',
        plural: 'Academic Departments',
    },
    admin: {
        useAsTitle: 'name',
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
            name: 'campus_id',
            type: 'relationship',
            relationTo: 'campuses',
            required: false,
            label: 'Campus',
        },
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Department Name',
        },
        {
            name: 'contact_phone',
            type: 'text',
            required: false,
            label: 'Contact Phone',
        },
        {
            name: 'contact_email',
            type: 'email',
            required: false,
            label: 'Contact Email',
        },
        {
            name: 'head_of_department',
            type: 'text',
            required: false,
            label: 'Head of Department',
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

export default AcademicDepartments;
