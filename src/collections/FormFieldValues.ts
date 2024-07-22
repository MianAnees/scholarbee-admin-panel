import { CollectionConfig } from 'payload/types';

const FormFieldValues: CollectionConfig = {
    slug: 'form_field_values',
    admin: { useAsTitle: 'field' },
    fields: [
        {
            name: 'form_response',
            type: 'relationship',
            relationTo: 'form_responses',
            required: true,
        },
        {
            name: 'field',
            type: 'relationship',
            relationTo: 'form_fields',
            required: true,
        },
        {
            name: 'value',
            type: 'text',
        },
    ],
};

export default FormFieldValues;
