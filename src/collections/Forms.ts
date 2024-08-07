import { CollectionConfig } from 'payload/types';

const Forms: CollectionConfig = {
    slug: 'forms',
    labels: {
        singular: 'Form',
        plural: 'Forms',
    },
    admin: { useAsTitle: 'title' },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            label: 'Title',
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Description',
        },
        {
            name: 'fields',
            type: 'relationship',
            relationTo: 'form_fields',
            hasMany: true,
            label: 'Fields',
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

export default Forms;
