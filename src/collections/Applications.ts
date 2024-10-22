import { CollectionConfig } from 'payload/types';



const Applications: CollectionConfig = {
    slug: 'applications',
    labels: {
        singular: 'Application',
        plural: 'Applications',
    },
    fields: [
        {
            name: 'applicant',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            label: 'Applicant',
        },
        {
            name: 'departments',
            type: 'array', // An array to store multiple department applications
            label: 'Departments',
            fields: [
                {
                    name: 'department',
                    type: 'relationship',
                    relationTo: 'academic_departments', // Assuming you have a departments collection
                    required: true,
                    label: 'Department',
                },
                {
                    name: 'preferences',
                    type: 'array',
                    label: 'Program Preferences',
                    minRows: 1,
                    maxRows: 3, // Limit to 3 preferences
                    fields: [
                        {
                            name: 'program',
                            type: 'relationship',
                            relationTo: 'programs', // Assuming a programs collection
                            required: true,
                            label: 'Program',
                        },
                        {
                            name: 'preference_order',
                            type: 'select',
                            options: ['1st', '2nd', '3rd'],
                            required: true,
                            label: 'Preference Order',
                        },
                    ],
                },
                {
                    name: 'processing_fee',
                    type: 'number',
                    required: true,
                    label: 'Processing Fee',
                },
            ],
        },
        {
            name: 'total_processing_fee',
            type: 'number',
            required: true,
            label: 'Total Processing Fee',
        },
        {
            name: 'submission_date',
            type: 'date',
            admin: {
                readOnly: true,
            },
            defaultValue: () => new Date().toISOString(),
            label: 'Submission Date',
        },
        {
            name: 'status',
            type: 'select',
            options: ['Pending', 'Approved', 'Rejected'],
            required: true,
            label: 'Status',
        },
    ],
};

export default Applications;
