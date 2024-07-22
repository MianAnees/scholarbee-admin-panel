import { CollectionConfig } from 'payload/types';

const StudentScholarships: CollectionConfig = {
    slug: 'student_scholarships',

    fields: [

        {
            name: 'student_id',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
        {
            name: 'scholarship_id',
            type: 'relationship',
            relationTo: 'scholarships',
            required: true,
        },
        {
            name: 'application_date',
            type: 'date',
            required: true,
        },
        {
            name: 'approval_status',
            type: 'select',
            options: [
                'Applied',
                'Approved',
                'Rejected',
            ],
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

export default StudentScholarships;
