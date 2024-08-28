import { CollectionConfig } from 'payload/types';

const AdmissionPrograms: CollectionConfig = {
    slug: 'admission-programs',
    access: {
        // Allow public read access
        read: () => true,

        // Restrict create, update, and delete to authenticated users
        create: ({ req: { user } }) => {
            return !!user; // Only allow if a user is logged in
        },
        update: ({ req: { user } }) => {
            return !!user; // Only allow if a user is logged in
        },
        delete: ({ req: { user } }) => {
            return !!user; // Only allow if a user is logged in
        },
    },
    labels: {
        singular: 'Admission Program',
        plural: 'Admission Programs',
    },
    fields: [
        {
            name: 'admission',
            type: 'relationship',
            relationTo: 'admissions',
            required: true,
            label: 'Admission',
        },
        {
            name: 'program',
            type: 'relationship',
            relationTo: 'programs',
            required: true,
            label: 'Program',
        },
        {
            name: 'admission_requirements',
            type: 'array',
            label: 'Admission Requirements',
            fields: [
                {
                    name: 'key',
                    type: 'text',
                    label: 'Requirement Key',
                    required: true,
                },
                {
                    name: 'value',
                    type: 'textarea',
                    label: 'Requirement Value',
                    required: true,
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
        },
    ],
};

export default AdmissionPrograms;
