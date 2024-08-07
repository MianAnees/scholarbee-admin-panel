import { CollectionConfig } from 'payload/types';

const FormFields: CollectionConfig = {
    slug: 'form_fields',
    labels: {
        singular: 'Form Field',
        plural: 'Form Fields',
    },
    admin: { useAsTitle: 'label' },
    fields: [
        {
            name: 'form',
            type: 'relationship',
            relationTo: 'forms',
            required: true,
            label: 'Form',
        },
        {
            name: 'label',
            type: 'text',
            required: true,
            label: 'Field Label',
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
            label: 'Field Type',
        },
        {
            name: 'required',
            type: 'checkbox',
            label: 'Required',
        },
        {
            name: 'options',
            type: 'array',
            label: 'Options',
            fields: [
                {
                    name: 'optionLabel',
                    type: 'text',
                    required: true,
                    label: 'Option Label',
                },
                {
                    name: 'optionValue',
                    type: 'text',
                    required: true,
                    label: 'Option Value',
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
