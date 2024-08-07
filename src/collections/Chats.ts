import { CollectionConfig } from 'payload/types';

const Chats: CollectionConfig = {
    slug: 'chats',
    labels: {
        singular: 'Chat',
        plural: 'Chats',
    },
    fields: [
        {
            name: 'student_id',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            label: 'Student',
        },
        {
            name: 'admin_id',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            label: 'Admin',
        },
        {
            name: 'message',
            type: 'textarea',
            required: true,
            label: 'Message',
        },
        {
            name: 'timestamp',
            type: 'date',
            required: true,
            label: 'Timestamp',
        },
    ],
};

export default Chats;
