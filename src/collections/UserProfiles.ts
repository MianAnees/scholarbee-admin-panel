import { CollectionConfig } from 'payload/types';

const UserProfiles: CollectionConfig = {
    slug: 'user_profiles',
    labels: {
        singular: 'User Profile',
        plural: 'User Profiles',
    },
    fields: [
        {
            name: 'last_degree',
            type: 'select',
            options: [
                'High School Diploma',
                "Bachelor's Degree",
                "Master's Degree",
                'Ph.D.',
                'Other',
            ],
            label: 'Last Degree',
        },
        {
            name: 'supporting_documents',
            type: 'array',
            label: 'Supporting Documents',
            fields: [
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                    label: 'Image',
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
            label: 'Created At',
        },
    ],
};

export default UserProfiles;
