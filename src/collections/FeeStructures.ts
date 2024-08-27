import { CollectionConfig } from 'payload/types';

const FeeStructures: CollectionConfig = {
    slug: 'fee_structures',
    labels: {
        singular: 'Fee Structure',
        plural: 'Fee Structures',

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
    admin: {
        useAsTitle: 'programs.name',
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
            name: 'tuition_fee',
            type: 'number',
            required: true,
            label: 'Tuition Fee',
        },
        {
            name: 'application_fee',
            type: 'number',
            required: false,
            label: 'Application Fee',
        },
        {
            name: 'other_fees',
            type: 'textarea',
            required: false,
            label: 'Other Fees',
        },
        {
            name: 'currency',
            type: 'text',
            required: false,
            label: 'Currency',
        },
        {
            name: 'payment_schedule',
            type: 'textarea',
            required: false,
            label: 'Payment Schedule',
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

export default FeeStructures;
