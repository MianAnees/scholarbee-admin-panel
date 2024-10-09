import { CollectionConfig } from 'payload/types';

const AcademicDepartments: CollectionConfig = {
    slug: 'academic_departments',
    labels: {
        singular: 'Academic Department',
        plural: 'Academic Departments',
    },
    admin: {
        useAsTitle: 'name',
    },
    fields: [
        {
            name: 'campus_id',
            type: 'relationship',
            relationTo: 'campuses',
            required: false,
            label: 'Campus',
        },
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Department Name',
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
            name: 'head_of_department',
            type: 'text',
            required: false,
            label: 'Head of Department',
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

export default AcademicDepartments;
