import { CollectionConfig } from 'payload/types';

const UserProfiles: CollectionConfig = {
    slug: 'user_profiles',
    fields: [
        {
            name: 'last_degree',
            type: 'select',
            options: [
                'High School Diploma',
                'Bachelor\'s Degree',
                'Master\'s Degree',
                'Ph.D.',
                'Other',
            ],
        },
        {
            name: 'supporting_documents',
            type: 'array',
            fields: [
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                },
            ],
            admin: {
                description: 'Other supporting documents',
            },
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

export default UserProfiles;

