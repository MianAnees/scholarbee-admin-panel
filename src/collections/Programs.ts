import { CollectionConfig } from 'payload/types';

const Programs: CollectionConfig = {
    slug: 'programs',
    admin: {
        useAsTitle: "name"
    },
    fields: [
        {
            name: 'campus_id',
            type: 'relationship',
            relationTo: 'campuses',
            required: false,
        },
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'major',
            type: 'text',
            required: false,
        },
        // {
        //     name: 'fee_structure_id',
        //     type: 'relationship',
        //     relationTo: 'fee_structures',
        //     required: false,
        // },
        {
            name: 'duration',
            type: 'text',
            required: false,
        },
        {
            name: 'degree_level',
            type: 'text',
            required: false,
        },
        {
            name: 'accreditations',
            type: 'textarea',
            required: false,
        },
        {
            name: 'mode_of_study',
            type: 'select',
            options: [
                'Online',
                'Onsite',
                'Hybrid'
            ],
            required: false,
        },
        {
            name: 'language_of_instruction',
            type: 'text',
            required: false,
        },
        {
            name: 'intake_periods',
            type: 'array',
            required: false,
            fields: [
                {
                    name: 'intake_period',
                    type: 'select',
                    options: [
                        'Fall',
                        'Spring'
                    ],
                }
            ]
        },
        {
            name: 'scholarship_options',
            type: 'textarea',
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

export default Programs;
