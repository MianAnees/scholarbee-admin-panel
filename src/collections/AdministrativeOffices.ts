import { CollectionConfig } from 'payload/types';

const AdministrativeOffices: CollectionConfig = {
    slug: 'administrative_offices',
    labels: {
        singular: 'Administrative Office',
        plural: 'Administrative Offices',
    },
    admin: {
        useAsTitle: 'name',
    },
    fields: [
        {
            name: 'campus_id',
            type: 'relationship',
            relationTo: 'campuses',
            required: false,
            label: 'Campus',
        },
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Office Name',
        },
        {
            name: 'address_id',
            type: 'relationship',
            relationTo: 'addresses',
            required: false,
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
            name: 'office_hours',
            type: 'text',
            required: false,
            label: 'Office Hours',
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

export default AdministrativeOffices;
