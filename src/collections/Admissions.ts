import { CollectionConfig } from 'payload/types';

const Admissions: CollectionConfig = {
    slug: 'admissions',
    labels: {
        singular: 'Admission',
        plural: 'Admissions',

    },
    admin: {
        useAsTitle: 'admission_title',
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
            name: 'university_id',
            type: 'relationship',
            relationTo: 'universities',
            required: true,
            label: 'University',
        },
        {
            name: 'program_id',
            type: 'relationship',
            relationTo: 'programs',
            required: true,
            label: 'Program',
        },
        {
            name: 'course_id',
            type: 'relationship',
            relationTo: 'courses',
            required: true,
            label: 'Course',
        },
        {
            name: 'admin_id',
            type: 'relationship',
            relationTo: 'users',
            admin: {
                description: 'Admin who posted the admission',
            },
            required: true,
            label: 'Admin',
        },
        {
            name: 'admission_title',
            type: 'text',
            required: true,
            label: 'Admission Title',
        },
        {
            name: 'admission_description',
            type: 'textarea',
            label: 'Admission Description',
        },
        {
            name: 'admission_deadline',
            type: 'date',
            required: true,
            label: 'Admission Deadline',
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

export default Admissions;
