import { CollectionConfig } from 'payload/types';
const Regions: CollectionConfig = {
    slug: 'regions',
    labels: {
        singular: 'Region',
        plural: 'Regions',
    },
    fields: [
        {
            name: 'region_name',
            type: 'text',
            required: true,
            label: 'Region Name',
        },
        {
            name: 'country',
            type: 'relationship',
            relationTo: 'countries',
            label: 'Associated Country',
        },
        {
            name: 'cities',
            type: 'array',
            label: 'Associated Cities',
            fields: [
                {
                    name: 'city_id',
                    type: 'relationship',
                    relationTo: 'cities',
                    label: 'City',
                },
            ],
        },
    ],
};

export { Regions };
