import { CollectionConfig } from 'payload/types';

const EmergencyContacts: CollectionConfig = {
    slug: 'emergency_contacts',
    labels: {
        singular: 'Emergency Contact',
        plural: 'Emergency Contacts',
    },
    admin: {
        useAsTitle: 'contact_name',
    },
    fields: [
        {
            name: '_id',
            type: 'text',
            required: true,
            label: 'ID',
        },
        {
            name: 'campus_id',
            type: 'relationship',
            relationTo: 'campuses',
            required: true,
            label: 'Campus',
        },
        {
            name: 'service',
            type: 'text',
            required: true,
            label: 'Service',
        },
        {
            name: 'contact_name',
            type: 'text',
            required: false,
            label: 'Contact Name',
        },
        {
            name: 'contact_phone',
            type: 'text',
            required: true,
            label: 'Contact Phone',
        },
        {
            name: 'contact_email',
            type: 'email',
            required: false,
            label: 'Contact Email',
        },
        {
            name: 'office_location',
            type: 'text',
            required: false,
            label: 'Office Location',
        },
        {
            name: 'availability',
            type: 'text',
            required: false,
            label: 'Availability',
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
        {
            name: 'createdBy',
            type: 'relationship',
            relationTo: 'users', // Assuming 'users' is the slug for your users collection
            admin: {
                position: 'sidebar',
                readOnly: true,
            },
        },
    ],
    hooks: {
        beforeChange: [
            ({ data, req, operation }) => {
                if (operation === 'create' && req.user) {
                    data.createdBy = req.user.id; // Assign the user ID to the createdBy field
                }
                return data;
            },
        ],
    },
};

export default EmergencyContacts;
