import { CollectionConfig } from 'payload/types';

const TransportationOptions: CollectionConfig = {
    slug: 'transportation_options',
    admin: {
        useAsTitle: "routes"
    },
    fields: [

        {
            name: 'campus_id',
            type: 'relationship',
            relationTo: 'campuses',
            required: true,
        },
        {
            name: 'type',
            type: 'text',
            required: true,
        },
        {
            name: 'schedule',
            type: 'textarea',
            required: false,
        },
        {
            name: 'routes',
            type: 'textarea',
            required: false,
        },
        {
            name: 'cost',
            type: 'number',
            required: false,
        },
        {
            name: 'contact_phone',
            type: 'text',
            required: false,
        },
        {
            name: 'contact_email',
            type: 'email',
            required: false,
        },
        {
            name: 'website',
            type: 'text',
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

export default TransportationOptions;
