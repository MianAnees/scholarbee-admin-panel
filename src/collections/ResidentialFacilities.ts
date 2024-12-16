import { CollectionConfig } from 'payload/types';

const ResidentialFacilities: CollectionConfig = {
    slug: 'residential_facilities',
    labels: {
        singular: 'Residential Facility',
        plural: 'Residential Facilities',
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
            label: 'Facility Name',
        },
        {
            name: 'type',
            type: 'text',
            required: false,
            label: 'Facility Type',
        },
        {
            name: 'capacity',
            type: 'number',
            required: false,
            label: 'Capacity',
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
            name: 'amenities',
            type: 'textarea',
            required: false,
            label: 'Amenities',
        },
        {
            name: 'room_types',
            type: 'textarea',
            required: false,
            label: 'Room Types',
        },
        {
            name: 'cost_per_term',
            type: 'number',
            required: false,
            label: 'Cost per Term',
        },
        {
            name: 'rules_and_regulations',
            type: 'textarea',
            required: false,
            label: 'Rules and Regulations',
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

export default ResidentialFacilities;
