import { CollectionConfig } from 'payload/types';

const Cities: CollectionConfig = {
    slug: 'cities',
    labels: {
        singular: 'City',
        plural: 'Cities',
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
            label: 'City Name',
        },
        {
            name: 'state',
            type: 'relationship',
            relationTo: 'states',
            label: 'State/Province',
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'latitude',
            type: 'number',
            label: 'Latitude',
            admin: {
                description: 'Geographical latitude of the city.',
            },
        },
        {
            name: 'longitude',
            type: 'number',
            label: 'Longitude',
            admin: {
                description: 'Geographical longitude of the city.',
            },
        },
        {
            name: 'population',
            type: 'number',
            label: 'Population',
            admin: {
                description: 'Approximate population of the city.',
            },
        },
        {
            name: 'area',
            type: 'number',
            label: 'Area (sq km)',
            admin: {
                description: 'Total area of the city in square kilometers.',
            },
        },
        {
            name: 'is_capital',
            type: 'checkbox',
            label: 'Is Capital City',
            admin: {
                description: 'Indicate if this city is the capital of the state/province.',
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

export default Cities;
