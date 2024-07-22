import { CollectionConfig } from 'payload/types';

const FormResponses: CollectionConfig = {
    slug: 'form_responses',
    fields: [
        {
            name: 'form',
            type: 'relationship',
            relationTo: 'forms',
            required: true,
        },
        {
            name: 'applicant',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
        {
            name: 'submitted_at',
            type: 'date',
            admin: {
                readOnly: true,
            },
            defaultValue: () => new Date().toISOString(),
        },
    ],
};

export default FormResponses;
