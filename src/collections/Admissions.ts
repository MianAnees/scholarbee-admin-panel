import { CollectionConfig } from 'payload/types';

const Admissions: CollectionConfig = {
    slug: 'admissions',
    admin: {
        useAsTitle: "admission_title"
    },
    fields: [
        {
            name: 'university_id',
            type: 'relationship',
            relationTo: 'universities',
            required: true,
        },
        {
            name: 'program_id',
            type: 'relationship',
            relationTo: 'programs',
            required: true,
        },
        {
            name: 'course_id',
            type: 'relationship',
            relationTo: 'courses',
            required: true,
        },
        {
            name: 'admin_id',
            type: 'relationship',
            relationTo: 'users',
            admin: {
                description: 'Admin who posted the admission',
            },
            required: true,
        },
        {
            name: 'admission_title',
            type: 'text',
            required: true,
        },
        {
            name: 'admission_description',
            type: 'textarea',
        },
        {
            name: 'admission_deadline',
            type: 'date',
            required: true,
        },
        {
            name: 'created_at',
            type: 'date',
            admin: {
                readOnly: true,
            },
            defaultValue: () => new Date().toISOString(),
        },
    ],
};

export default Admissions;
