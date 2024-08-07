import { CollectionConfig } from 'payload/types';

const StudentScholarships: CollectionConfig = {
    slug: 'student_scholarships',
    labels: {
        singular: 'Student Scholarship',
        plural: 'Student Scholarships',

    },
    fields: [
        {
            name: 'student_id',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            label: 'Student',
        },
        {
            name: 'scholarship_id',
            type: 'relationship',
            relationTo: 'scholarships',
            required: true,
            label: 'Scholarship',
        },
        {
            name: 'application_date',
            type: 'date',
            required: true,
            label: 'Application Date',
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
            label: 'Approval Status',
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

export default StudentScholarships;
