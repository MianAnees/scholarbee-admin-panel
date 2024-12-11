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
            name: 'other_fees',
            type: 'array',
            required: false, // Set to true if this is mandatory
            label: 'Other Fee Structure',
            fields: [
                {
                    name: 'fee_name',
                    type: 'text',
                    required: true,
                    label: 'Fee Name',
                },
                {
                    name: 'fee_amount',
                    type: 'number',
                    required: true,
                    label: 'Fee Amount',
                },
                {
                    name: 'include_in_first_semester',
                    type: 'checkbox',
                    required: false,
                    label: 'Include in First Semester Fee',
                    defaultValue: false,
                },
            ],
            admin: {
                description: 'Add multiple fee items, specifying their amount and whether they should be included in the first semester fee.',
            },
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
