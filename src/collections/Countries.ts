import { CollectionConfig } from 'payload/types';

const Countries: CollectionConfig = {
    slug: 'countries',
    labels: {
        singular: 'Country',
        plural: 'Countries',
    },
    admin: {
        useAsTitle: 'name',
    },
    access: {
        // Allow public read access
        read: () => true,

        // Restrict create, update, and delete to authenticated users
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => !!user,
        delete: ({ req: { user } }) => !!user,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            label: 'Country Name',
        },
        {
            name: 'iso_code',
            type: 'text',
            label: 'ISO Code',
            admin: {
                placeholder: 'e.g., US, PK, IN',
                description: 'ISO 3166-1 alpha-2 or alpha-3 code for the country.',
            },
        },
        {
            name: 'dial_code',
            type: 'text',
            label: 'Dial Code',
            admin: {
                placeholder: 'e.g., +1 for the USA.',
            },
        },
        {
            name: 'region',
            type: 'text',
            label: 'Region',
            admin: {
                placeholder: 'e.g., Asia, Europe.',
            },
        },
        {
            name: 'subregion',
            type: 'text',
            label: 'Subregion',
            admin: {
                placeholder: 'e.g., South Asia, Western Europe.',
            },
        },
        {
            name: 'population',
            type: 'number',
            label: 'Population',
            admin: {
                description: 'Approximate population of the country.',
            },
        },
        {
            name: 'area',
            type: 'number',
            label: 'Area (sq km)',
            admin: {
                description: 'Total area of the country in square kilometers.',
            },
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

export default Countries;
