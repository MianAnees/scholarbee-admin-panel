import { CollectionConfig } from 'payload/types';

const LibraryFacilities: CollectionConfig = {
    slug: 'library_facilities',
    labels: {
        singular: 'Library Facility',
        plural: 'Library Facilities',
    },
    admin: {
        useAsTitle: 'name',
    },
    fields: [
        {
            name: 'campus_id',
            type: 'relationship',
            relationTo: 'campuses',
            required: true,
            label: 'Campus',
        },
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Library Name',
        },
        {
            name: 'total_books',
            type: 'number',
            required: false,
            label: 'Total Books',
        },
        {
            name: 'total_journals',
            type: 'number',
            required: false,
            label: 'Total Journals',
        },
        {
            name: 'digital_resources',
            type: 'textarea',
            required: false,
            label: 'Digital Resources',
        },
        {
            name: 'address_id',
            type: 'relationship',
            relationTo: 'addresses',
            required: true,
            label: 'Address',
        },
        {
            name: 'contact_phone',
            type: 'text',
            required: false,
            label: 'Contact Phone',
        },
        {
            name: 'contact_email',
            type: 'email',
            required: false,
            label: 'Contact Email',
        },
        {
            name: 'website',
            type: 'text',
            required: false,
            label: 'Website',
        },
        {
            name: 'hours_of_operation',
            type: 'text',
            required: false,
            label: 'Hours of Operation',
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
    ],
};

export default LibraryFacilities;
