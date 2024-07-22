import { CollectionConfig } from 'payload/types';

const AdministrativeOffices: CollectionConfig = {
    slug: 'administrative_offices',
    admin: {
        useAsTitle: "name"
    },
    fields: [
        {
            name: 'campus_id',
            type: 'relationship',
            relationTo: 'campuses',
            required: false,
        },
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'address_id',
            type: 'relationship',
            relationTo: 'addresses',
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
            name: 'office_hours',
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

export default AdministrativeOffices;
