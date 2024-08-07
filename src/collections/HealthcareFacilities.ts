import { CollectionConfig } from 'payload/types';

const HealthcareFacilities: CollectionConfig = {
    slug: 'healthcare_facilities',
    labels: {
        singular: 'Healthcare Facility',
        plural: 'Healthcare Facilities',
    },
    admin: {
        useAsTitle: 'facility_name',
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
            name: 'facility_name',
            type: 'text',
            required: true,
            label: 'Facility Name',
        },
        {
            name: 'services_offered',
            type: 'textarea',
            required: false,
            label: 'Services Offered',
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
            name: 'location',
            type: 'text',
            required: false,
            label: 'Location',
        },
        {
            name: 'emergency_services',
            type: 'textarea',
            required: false,
            label: 'Emergency Services',
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

export default HealthcareFacilities;
