import { CollectionConfig } from 'payload/types';

const Courses: CollectionConfig = {
    slug: 'courses',
    labels: {
        singular: 'Course',
        plural: 'Courses',
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
    ],
};

export default Courses;
