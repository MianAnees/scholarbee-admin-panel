import { CollectionConfig } from 'payload/types';

const PostalCodes: CollectionConfig = {
    slug: 'postal-codes',
    labels: {
        singular: 'Postal Code',
        plural: 'Postal Codes',
    },
    admin: {
        useAsTitle: 'code',
    },
    access: {
        // Allow public read access
        read: () => true,

        // Restrict create, update, and delete to authenticated users
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => !!user,
        delete: ({ req: { user } }) => !!user,
    },
    fields: [
        {
            name: 'code',
            type: 'text',
            label: 'Postal Code',
        },
        {
            name: 'city',
            type: 'relationship',
            relationTo: 'cities',
            label: 'City',
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'area_name',
            type: 'text',
            label: 'Area Name',
            admin: {
                placeholder: 'Enter the name of the area corresponding to the postal code.',
            },
        },
        {
            name: 'createdBy',
            type: 'relationship',
            relationTo: 'users',
            admin: {
                position: 'sidebar',
                readOnly: true,
            },
        },
    ],
};

export default PostalCodes;
