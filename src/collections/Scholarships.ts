import { CollectionConfig } from 'payload/types';

const Scholarships: CollectionConfig = {
    slug: 'scholarships',
    labels: {
        singular: 'Scholarship',
        plural: 'Scholarships',
    },
    fields: [
        {
            name: 'university_id',
            type: 'relationship',
            relationTo: 'universities',
            required: true,
            label: 'University',
        },
        {
            name: 'scholarship_name',
            type: 'text',
            required: true,
            label: 'Scholarship Name',
        },
        {
            name: 'scholarship_description',
            type: 'textarea',
            label: 'Scholarship Description',
        },
        {
            name: 'eligibility_criteria',
            type: 'textarea',
            label: 'Eligibility Criteria',
        },
        {
            name: 'amount',
            type: 'number',
            required: true,
            label: 'Amount',
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

export default Scholarships;
