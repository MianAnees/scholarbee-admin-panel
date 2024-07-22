import { CollectionConfig } from 'payload/types';

const AcademicDepartments: CollectionConfig = {
    slug: 'academic_departments',
    admin: {
        useAsTitle: "name"
    },
    fields: [
        {
            name: 'campus_id',
            type: 'relationship',
            relationTo: 'campuses',
            required: false,
        },
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'contact_phone',
            type: 'text',
            required: false,
        },
        {
            name: 'contact_email',
            type: 'email',
            required: false,
        },
        {
            name: 'head_of_department',
            type: 'text',
            required: false,
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

export default AcademicDepartments
