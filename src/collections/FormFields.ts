import { CollectionConfig } from 'payload/types';

const FormFields: CollectionConfig = {
    slug: 'form_fields',
    admin: { useAsTitle: 'label' },
    fields: [
        {
            name: 'form',
            type: 'relationship',
            relationTo: 'forms',
            required: true,
        },
        {
            name: 'label',
            type: 'text',
            required: true,
        },
        {
            name: 'type',
            type: 'select',
            options: [
                'text',
                'textarea',
                'select',
                'radio',
                'checkbox',
                'date',
                'number',
                'email',
            ],
            required: true,
        },
        {
            name: 'required',
            type: 'checkbox',
        },
        {
            name: 'options',
            type: 'array',
            fields: [
                {
                    name: 'optionLabel',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'optionValue',
                    type: 'text',
                    required: true,
                },
            ],
            admin: {
                condition: (data, siblingData) =>
                    siblingData.type === 'select' ||
                    siblingData.type === 'radio' ||
                    siblingData.type === 'checkbox',
            },
        },
    ],
};

export default FormFields;
