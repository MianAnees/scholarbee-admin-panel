import { CollectionConfig } from 'payload/types';

const Chats: CollectionConfig = {
    slug: 'chats',
    fields: [

        {
            name: 'student_id',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
        {
            name: 'admin_id',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
        {
            name: 'message',
            type: 'textarea',
            required: true,
        },
        {
            name: 'timestamp',
            type: 'date',
            required: true,
        },
    ],
};

export default Chats;
