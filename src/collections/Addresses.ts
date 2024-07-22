import { CollectionConfig } from 'payload/types';

const Addresses: CollectionConfig = {
    slug: 'addresses',
    admin: {
        useAsTitle: "address_line_1"
    },
    fields: [

        {
            name: 'address_line_1',
            type: 'text',
            required: true,
        },
        {
            name: 'address_line_2',
            type: 'text',
        },
        {
            name: 'city',
            type: 'text',
            required: true,
        },
        {
            name: 'state',
            type: 'text',
            required: true,
        },
        {
            name: 'country',
            type: 'text',
            required: true,
        },
        {
            name: 'postal_code',
            type: 'text',
            required: true,
        },
        {
            name: 'latitude',
            type: 'number',
            required: true,
            admin: {
                description: 'Latitude of the address',
            },
        },
        {
            name: 'longitude',
            type: 'number',
            required: true,
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
        },
    ],
};

export default Addresses;
