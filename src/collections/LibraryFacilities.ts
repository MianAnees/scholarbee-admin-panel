import { CollectionConfig } from 'payload/types';

const LibraryFacilities: CollectionConfig = {
    slug: 'library_facilities',
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
            name: 'total_books',
            type: 'number',
            required: false,
        },
        {
            name: 'total_journals',
            type: 'number',
            required: false,
        },
        {
            name: 'digital_resources',
            type: 'textarea',
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
            name: 'website',
            type: 'text',
            required: false,
        },
        {
            name: 'hours_of_operation',
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

export default LibraryFacilities;
