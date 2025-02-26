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
            required: false,
            label: 'Student',
        },

        {
            name: 'student_snapshot',
            type: 'group',
            label: 'Student Snapshot',
            fields: [
                { name: 'name', type: 'text', label: 'Full Name', required: false },
                { name: 'father_name', type: 'text', label: "Father's Name", required: false },
                { name: 'father_status', type: 'text', label: "Father's Status", required: false },
                { name: 'domicile', type: 'text', label: 'Domicile', required: false },
            ],
        },
        {
            name: 'scholarship_id',
            type: 'relationship',
            relationTo: 'scholarships',
            required: false,
            label: 'Scholarship',
        },
        {
            name: 'application_date',
            type: 'date',
            required: false,
            label: 'Application Date',
        },
        {
            name: 'approval_status',
            type: 'select',
            options: ['Applied', 'Approved', 'Rejected'],
            required: false,
            label: 'Approval Status',
        },
        {
            name: 'monthly_household_income',
            type: 'number',
            label: 'Monthly Household Income',
            required: false,
        },
        {
            name: 'last_degree',
            type: 'select',
            label: 'Last Degree',
            options: [
                'Matriculation',
                'Intermediate/FSc/FA',
                'Bachelors',
                'Masters',
                'PhD',
            ],
            required: false,
        },
        {
            name: 'last_degree_percentage',
            type: 'number',
            label: 'Last Degree Percentage',
            required: false,
        },
        {
            name: 'personal_statement',
            type: 'textarea',
            label: 'Personal Statement',
            required: false,
        },
        {
            name: 'reference_1',
            type: 'text',
            label: 'Reference 1',
            required: false,
        },
        {
            name: 'reference_2',
            type: 'text',
            label: 'Reference 2',
            required: false,
        },
        {
            name: 'required_documents',
            type: 'array',
            label: 'Required Documents',
            fields: [
                {
                    name: 'document_name',
                    type: 'select',
                    label: 'Document Name',
                    options: [
                        { label: 'Passport', value: 'passport' },
                        { label: 'National ID', value: 'national_id' },
                        { label: 'Birth Certificate', value: 'birth_certificate' },
                        { label: 'Academic Transcripts', value: 'academic_transcripts' },
                        { label: 'Recommendation Letter', value: 'recommendation_letter' },
                        { label: 'Personal Statement', value: 'personal_statement' },
                        { label: 'Financial Statements', value: 'financial_statements' },
                        { label: 'English Proficiency Certificate', value: 'english_proficiency_certificate' },
                        { label: 'Resume/CV', value: 'resume_cv' },
                    ],
                    required: false,
                },
                {
                    name: 'document_link',
                    type: 'text',
                    required: false,
                    label: 'Document URL',
                    admin: {
                        description: 'Provide the URL of the uploaded document (stored in S3 or another storage service).',
                    },
                },
            ],
        },
        {
            name: 'created_at',
            type: 'date',
            admin: {
                readOnly: true,
            },
            defaultValue: () => new Date().toISOString(),
            label: 'Created At',
            required: false,
        },
        {
            name: 'createdBy',
            type: 'relationship',
            relationTo: 'users',
            required: false,
            admin: {
                position: 'sidebar',
                readOnly: true,
            },
        },
    ],
    hooks: {
        beforeChange: [
            async ({ data, req, operation }) => {
                if (operation === 'create' && req.user) {
                    data.createdBy = req.user.id;

                    // Fetch user details to store in student_snapshot
                    if (data.student_id) {
                        const user: any = await req.payload.findByID({
                            collection: 'users',
                            id: data.student_id,
                        });

                        if (user) {
                            data.student_snapshot = {
                                name: user.first_name + ' ' + (user.last_name || ''),
                                father_name: user.father_name || null,
                                father_status: user.father_status || null,
                                domicile: user.provinceOfDomicile || user.districtOfDomicile || null,
                            };
                        }
                    }
                }
                return data;
            },
        ],
    },
};

export default StudentScholarships;
