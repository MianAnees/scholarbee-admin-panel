import { CollectionConfig } from 'payload/types';

const SportsFacilities: CollectionConfig = {
    slug: 'sports_facilities',
    labels: {
        singular: 'Sports Facility',
        plural: 'Sports Facilities',
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
            name: 'type',
            type: 'text',
            required: false,
            label: 'Facility Type',
        },
        {
            name: 'available_sports',
            type: 'textarea',
            required: false,
            label: 'Available Sports',
        },
        {
            name: 'membership_cost',
            type: 'number',
            required: false,
            label: 'Membership Cost',
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

export default SportsFacilities;
