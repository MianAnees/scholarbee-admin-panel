import { CollectionConfig } from 'payload/types';



const Scholarships: CollectionConfig = {
    slug: 'scholarships',
    labels: {
        singular: 'Scholarship',
        plural: 'Scholarships',
    },
    fields: [
        {
            name: 'scholarship_name',
            type: 'text',
            required: true,
            label: 'Scholarship Name',
        },
        {
            name: 'scholarship_description',
            type: 'textarea',
            required: true,
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
            name: 'application_deadline',
            type: 'date',
            required: true,
            label: 'Application Deadline',
        },
        {
            name: 'scholarship_type',
            type: 'select',
            options: [
                { label: 'Merit-Based', value: 'merit' },
                { label: 'Need-Based', value: 'need' },
                { label: 'Athletic', value: 'athletic' },
                { label: 'International', value: 'international' },
                { label: 'Local', value: 'local' },
            ],
            label: 'Scholarship Type',
        },
        // Organization Information
        {
            name: 'organization_id',
            type: 'relationship',
            relationTo: 'organizations',
            required: true,
            label: 'Providing Organization',
        },
        {
            name: 'university_id',
            type: 'relationship',
            relationTo: 'universities',
            required: false,
            label: 'Associated University',
        },
        {
            name: 'country',
            type: 'relationship',
            relationTo: 'countries',
            label: 'Eligible Countries',
        },
        {
            name: 'region',
            type: 'relationship',
            relationTo: 'regions',
            label: 'Eligible Regions',
        },
        // Application Process
        {
            name: 'application_link',
            type: 'text',
            label: 'Application Link',
        },
        {
            name: 'application_process',
            type: 'textarea',
            label: 'Application Process',
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
                },
            ],
        },
        // Application Status Tracking
        {
            name: 'status',
            type: 'select',
            options: [
                { label: 'Open', value: 'open' },
                { label: 'Closed', value: 'closed' },
                { label: 'Ongoing', value: 'ongoing' },
            ],
            defaultValue: 'open',
            label: 'Application Status',
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
            relationTo: 'users',
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
                    data.createdBy = req.user.id;
                }
                return data;
            },
        ],
    },
};

export { Scholarships };
