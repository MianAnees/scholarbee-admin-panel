import { CollectionConfig } from 'payload/types';

const Forms: CollectionConfig = {
    slug: 'forms',
    admin: { useAsTitle: 'title' },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'description',
            type: 'textarea',
        },
        {
            name: 'fields',
            type: 'relationship',
            relationTo: 'form_fields',
            hasMany: true,
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

export default Forms;
