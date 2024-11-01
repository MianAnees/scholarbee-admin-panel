import { CollectionConfig } from 'payload/types';

const Programs: CollectionConfig = {
    slug: 'programs',
    labels: {
        singular: 'Program',
        plural: 'Programs',
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
            name: 'academic_departments',
            type: 'relationship',
            relationTo: 'academic_departments',
            required: false,
            label: 'Academic Departments',
        }
        ,
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Program Name',
        },
        {
            name: 'major',
            type: 'text',
            required: false,
            label: 'Major',
        },
        {
            name: 'duration',
            type: 'text',
            required: false,
            label: 'Duration',
        },
        {
            name: 'credit_hours',
            type: 'number',
            required: false,
            label: 'Credit hours',
        },
        {
            name: 'degree_level',
            type: 'text',
            required: false,
            label: 'Degree Level',
        },
        {
            name: 'accreditations',
            type: 'textarea',
            required: false,
            label: 'Accreditations',
        },
        {
            name: 'mode_of_study',
            type: 'select',
            options: [
                'Online',
                'Onsite',
                'Hybrid',
            ],
            required: false,
            label: 'Mode of Study',
        },
        {
            name: 'language_of_instruction',
            type: 'text',
            required: false,
            label: 'Language of Instruction',
        },
        {
            name: 'intake_periods',
            type: 'array',
            required: false,
            label: 'Intake Periods',
            fields: [
                {
                    name: 'intake_period',
                    type: 'select',
                    options: [
                        'Fall',
                        'Spring',
                    ],
                    label: 'Intake Period',
                },
            ],
        },
        {
            name: 'scholarship_options',
            type: 'textarea',
            required: false,
            label: 'Scholarship Options',
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

export default Programs;
