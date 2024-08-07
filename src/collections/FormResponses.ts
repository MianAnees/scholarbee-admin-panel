import { CollectionConfig } from 'payload/types';

const FormResponses: CollectionConfig = {
    slug: 'form_responses',
    labels: {
        singular: 'Form Response',
        plural: 'Form Responses',
    },
    fields: [
        {
            name: 'form',
            type: 'relationship',
            relationTo: 'forms',
            required: true,
            label: 'Form',
        },
        {
            name: 'applicant',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            label: 'Applicant',
        },
        {
            name: 'submitted_at',
            type: 'date',
            admin: {
                readOnly: true,
            },
            defaultValue: () => new Date().toISOString(),
            label: 'Submitted At',
        },
    ],
};

export default FormResponses;
