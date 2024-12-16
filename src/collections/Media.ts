import { CollectionConfig } from 'payload/types';

const Media: CollectionConfig = {
    slug: 'media',
    labels: {
        singular: 'Media Item',
        plural: 'Media Items',
    },
    upload: {
        staticURL: '/media',
        staticDir: 'media',
        imageSizes: [
            {
                name: 'thumbnail',
                width: 200,
                height: 200,
                crop: 'center',
            },
            {
                name: 'large',
                width: 1200,
                height: 800,
                crop: 'center',
            },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    },
    fields: [
        {
            name: 'alt',
            type: 'text',
            required: false,
            label: 'Alternative Text',
        },
        {
            name: 'createdBy',
            type: 'relationship',
            relationTo: 'users', // Assuming 'users' is the slug for your users collection
            admin: {
                position: 'sidebar',
                readOnly: true,
            },
        },
    ],
    hooks: {
        beforeChange: [
            ({ data, req, operation }) => {
                if (operation === 'create' && req.user) {
                    data.createdBy = req.user.id; // Assign the user ID to the createdBy field
                }
                return data;
            },
        ],
    },
};

export default Media;
