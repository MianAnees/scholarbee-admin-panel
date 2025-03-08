import { CollectionConfig } from 'payload/types';

const Addresses: CollectionConfig = {
    slug: 'addresses',
    labels: {
        singular: 'Address',
        plural: 'Addresses',
    },
    admin: {
        useAsTitle: 'address_line_1',
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
    fields: [
        {
            name: 'address_line_1',
            type: 'text',
            required: true,
            label: 'Address Line 1',
        },
        {
            name: 'address_line_2',
            type: 'text',
            label: 'Address Line 2',
        },
        {
            name: 'city',
            type: 'text',
            required: true,
            label: 'City',
        },
        {
            name: 'state',
            type: 'text',
            required: true,
            label: 'State',
        },
        {
            name: 'country',
            type: 'text',
            required: true,
            label: 'Country',
        },
        {
            name: 'postal_code',
            type: 'text',
            required: true,
            label: 'Postal Code',
        },
        {
            name: 'latitude',
            type: 'number',
            required: true,
            label: 'Latitude',
            admin: {
                description: 'Latitude of the address',
            },
        },
        {
            name: 'longitude',
            type: 'number',
            required: true,
            label: 'Longitude',
            admin: {
                description: 'Longitude of the address',
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

export default Addresses;
