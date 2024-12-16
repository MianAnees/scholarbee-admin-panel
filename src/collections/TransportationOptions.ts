import { CollectionConfig } from 'payload/types';

const TransportationOptions: CollectionConfig = {
    slug: 'transportation_options',
    labels: {
        singular: 'Transportation Option',
        plural: 'Transportation Options',
    },
    admin: {
        useAsTitle: 'routes',
    },
    fields: [
        {
            name: 'campus_id',
            type: 'relationship',
            relationTo: 'campuses',
            required: true,
            label: 'Campus',
        },
        {
            name: 'type',
            type: 'text',
            required: true,
            label: 'Type',
        },
        {
            name: 'schedule',
            type: 'textarea',
            required: false,
            label: 'Schedule',
        },
        {
            name: 'routes',
            type: 'textarea',
            required: false,
            label: 'Routes',
        },
        {
            name: 'cost',
            type: 'number',
            required: false,
            label: 'Cost',
        },
        {
            name: 'contact_phone',
            type: 'text',
            required: false,
            label: 'Contact Phone',
        },
        {
            name: 'contact_email',
            type: 'email',
            required: false,
            label: 'Contact Email',
        },
        {
            name: 'website',
            type: 'text',
            required: false,
            label: 'Website',
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
        {
            name: 'createdBy',
            type: 'relationship',
            relationTo: 'users', // Assuming 'users' is the slug for your users collection
            admin: {
                position: 'sidebar',
                readOnly: true,
            },
        },
    ],
    hooks: {
        beforeChange: [
            ({ data, req, operation }) => {
                if (operation === 'create' && req.user) {
                    data.createdBy = req.user.id; // Assign the user ID to the createdBy field
                }
                return data;
            },
        ],
    },
};

export default TransportationOptions;
