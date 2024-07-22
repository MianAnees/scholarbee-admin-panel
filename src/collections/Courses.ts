import { CollectionConfig } from 'payload/types';

const Courses: CollectionConfig = {
    slug: 'courses',
    admin: {
        useAsTitle: "course_name"
    },
    fields: [
        {
            name: 'program_id',
            type: 'relationship',
            relationTo: 'programs',
            required: false,
        },
        {
            name: 'course_name',
            type: 'text',
            required: true,
        },
        {
            name: 'course_description',
            type: 'textarea',
            required: false,
        },
        {
            name: 'course_duration',
            type: 'text',
            required: false,
            admin: {
                description: 'Duration in months',
            },
        },
        {
            name: 'course_fee',
            type: 'number',
            required: false,
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

export default Courses;
