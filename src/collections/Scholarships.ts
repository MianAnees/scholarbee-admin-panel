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
    ],
};

export default Scholarships;
