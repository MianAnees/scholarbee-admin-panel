import { CollectionConfig } from 'payload/types';

const HealthcareFacilities: CollectionConfig = {
    slug: 'healthcare_facilities',
    admin: {
        useAsTitle: "facility_name"
    },
    fields: [
        {
            name: 'campus_id',
            type: 'relationship',
            relationTo: 'campuses',
            required: true,
        },
        {
            name: 'facility_name',
            type: 'text',
            required: true,
        },
        {
            name: 'services_offered',
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
            name: 'location',
            type: 'text',
            required: false,
        },
        {
            name: 'emergency_services',
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

export default HealthcareFacilities;
