import { CollectionConfig } from 'payload/types';

const Scholarships: CollectionConfig = {
    slug: 'scholarships',
    fields: [

        {
            name: 'university_id',
            type: 'relationship',
            relationTo: 'universities',
            required: true,
        },
        {
            name: 'scholarship_name',
            type: 'text',
            required: true,
        },
        {
            name: 'scholarship_description',
            type: 'textarea',
        },
        {
            name: 'eligibility_criteria',
            type: 'textarea',
        },
        {
            name: 'amount',
            type: 'number',
            required: true,
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

export default Scholarships;
