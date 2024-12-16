import { CollectionConfig } from 'payload/types';

const States: CollectionConfig = {
    slug: 'states',
    labels: {
        singular: 'State/Province',
        plural: 'States/Provinces',
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
            label: 'State/Province Name',
        },
        {
            name: 'country',
            type: 'relationship',
            relationTo: 'countries',
            label: 'Country',
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'code',
            type: 'text',
            label: 'State/Province Code',
            admin: {
                placeholder: 'e.g., CA for California.',
            },
        },
        {
            name: 'population',
            type: 'number',
            label: 'Population',
            admin: {
                description: 'Approximate population of the state/province.',
            },
        },
        {
            name: 'area',
            type: 'number',
            label: 'Area (sq km)',
            admin: {
                description: 'Total area of the state/province in square kilometers.',
            },
        },
        {
            name: 'capital_city',
            type: 'relationship',
            relationTo: 'cities',
            label: 'Capital City',
            admin: {
                description: 'Set the capital city of this state/province.',
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

export default States;
