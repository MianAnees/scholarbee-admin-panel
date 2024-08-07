import { CollectionConfig } from 'payload/types';

const FormFieldValues: CollectionConfig = {
    slug: 'form_field_values',
    labels: {
        singular: 'Form Field Value',
        plural: 'Form Field Values',
    },
    admin: { useAsTitle: 'field' },
    fields: [
        {
            name: 'form_response',
            type: 'relationship',
            relationTo: 'form_responses',
            required: true,
            label: 'Form Response',
        },
        {
            name: 'field',
            type: 'relationship',
            relationTo: 'form_fields',
            required: true,
            label: 'Field',
        },
        {
            name: 'value',
            type: 'text',
            label: 'Value',
        },
    ],
};

export default FormFieldValues;
