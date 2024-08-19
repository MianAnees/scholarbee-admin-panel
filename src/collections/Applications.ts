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
            name: 'admission',
            type: 'relationship',
            relationTo: 'admissions',
            required: true,
            label: 'Admission',
        },
        {
            name: 'program',
            type: 'relationship',
            relationTo: 'programs',
            required: true,
            label: 'Program',
        },
        {
            name: 'form_response',
            type: 'relationship',
            relationTo: 'form_responses',
            required: true,
            label: 'Form Response',
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
            options: [
                'Pending',
                'Approved',
                'Rejected',
            ],
            required: true,
            label: 'Status',
        },
    ],
};

export default Applications;
