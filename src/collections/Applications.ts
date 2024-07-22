import { CollectionConfig } from 'payload/types';

const Applications: CollectionConfig = {
    slug: 'applications',
    fields: [
        {
            name: 'applicant',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
        {
            name: 'program',
            type: 'relationship',
            relationTo: 'programs',
            required: true,
        },
        {
            name: 'form_response',
            type: 'relationship',
            relationTo: 'form_responses',
            required: true,
        },
        {
            name: 'submission_date',
            type: 'date',
            admin: {
                readOnly: true,
            },
            defaultValue: () => new Date().toISOString(),
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
        },
    ],
};

export default Applications;
