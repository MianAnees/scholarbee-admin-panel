import { CollectionConfig } from 'payload/types';

const ResidentialFacilities: CollectionConfig = {
    slug: 'residential_facilities',
    admin: {
        useAsTitle: "name"
    },
    fields: [
        {
            name: 'campus_id',
            type: 'relationship',
            relationTo: 'campuses',
            required: true,
        },
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'type',
            type: 'text',
            required: false,
        },
        {
            name: 'capacity',
            type: 'number',
            required: false,
        },
        {
            name: 'address_id',
            type: 'relationship',
            relationTo: 'addresses',
            required: true,
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
            name: 'amenities',
            type: 'textarea',
            required: false,
        },
        {
            name: 'room_types',
            type: 'textarea',
            required: false,
        },
        {
            name: 'cost_per_term',
            type: 'number',
            required: false,
        },
        {
            name: 'rules_and_regulations',
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

export default ResidentialFacilities;
