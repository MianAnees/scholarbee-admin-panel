import { CollectionConfig } from 'payload/types';

const EmergencyContacts: CollectionConfig = {
    slug: 'emergency_contacts',
    admin: {
        useAsTitle: "contact_name"
    },
    fields: [
        {
            name: '_id',
            type: 'text',
            required: true,
        },
        {
            name: 'campus_id',
            type: 'relationship',
            relationTo: 'campuses',
            required: true,
        },
        {
            name: 'service',
            type: 'text',
            required: true,
        },
        {
            name: 'contact_name',
            type: 'text',
            required: false,
        },
        {
            name: 'contact_phone',
            type: 'text',
            required: true,
        },
        {
            name: 'contact_email',
            type: 'email',
            required: false,
        },
        {
            name: 'office_location',
            type: 'text',
            required: false,
        },
        {
            name: 'availability',
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

export default EmergencyContacts;
