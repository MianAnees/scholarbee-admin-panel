import { CollectionConfig } from 'payload/types';
import React from 'react';

const Universities: CollectionConfig = {
    slug: 'universities',
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'logo_url'],
    },
    fields: [

        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'founded',
            type: 'date',
            required: false,
        },
        {
            name: 'description',
            type: 'textarea',
            required: false,
        },
        {
            name: 'address_id',
            type: 'relationship',
            relationTo: 'addresses',
            required: false,
        },
        {
            name: 'website',
            type: 'text',
            required: false,
        },
        {
            name: 'ranking',
            type: 'text',
            required: false,
        },
        {
            name: 'affiliations',
            type: 'textarea',
            required: false,
        },
        {
            name: 'motto',
            type: 'text',
            required: false,
        },
        {
            name: 'colors',
            type: 'text',
            required: false,
        },
        {
            name: 'mascot',
            type: 'text',
            required: false,
        },
        {
            name: 'type',
            type: 'text',
            required: false,
        },
        {
            name: 'total_students',
            type: 'number',
            required: false,
        },
        {
            name: 'total_faculty',
            type: 'number',
            required: false,
        },
        {
            name: 'total_alumni',
            type: 'number',
            required: false,
        },
        {
            name: 'endowment',
            type: 'text',
            required: false,
        },
        {
            name: 'campus_size',
            type: 'text',
            required: false,
        },
        {
            name: 'annual_budget',
            type: 'number',
            required: false,
        },
        {
            name: 'research_output',
            type: 'number',
            required: false,
        },
        {
            name: 'international_students',
            type: 'number',
            required: false,
        },
        {
            name: 'languages',
            type: 'textarea',
            required: false,
        },
        {
            name: 'logo_url',
            type: 'upload',
            relationTo: 'media',
            required: false,
            admin: {
                position: 'sidebar',

                // components: components: {
                //     Cell: ({ value, data }: { value: any, data: any }) => (
                //       value ? (
                //         <img
                //           src={`${process.env.PAYLOAD_PUBLIC_URL}/media/${value.filename}`}
                //           alt={data?.name || 'University Logo'}
                //           style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                //         />
                //       ) : null
                //     ),
                //   }
            },

        },
        {
            name: 'accreditations',
            type: 'textarea',
            required: false,
        },
        {
            name: 'notable_alumni',
            type: 'textarea',
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

export default Universities;
