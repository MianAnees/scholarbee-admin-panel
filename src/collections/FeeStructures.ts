import { CollectionConfig } from 'payload/types';

const FeeStructures: CollectionConfig = {
    slug: 'fee_structures',
    admin: {
        useAsTitle: "programs.name"
    },
    fields: [
        {
            name: 'program_id',
            type: 'relationship',
            relationTo: 'programs',
            required: false,
        },
        {
            name: 'tuition_fee',
            type: 'number',
            required: true,
        },
        {
            name: 'application_fee',
            type: 'number',
            required: false,
        },
        {
            name: 'other_fees',
            type: 'textarea',
            required: false,
        },
        {
            name: 'currency',
            type: 'text',
            required: false,
        },
        {
            name: 'payment_schedule',
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

export default FeeStructures;
