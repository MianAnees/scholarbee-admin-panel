import { CollectionConfig } from 'payload/types';

const Messages: CollectionConfig = {
    slug: 'messages',
    fields: [

        {
            name: 'chat_id',
            type: 'relationship',
            relationTo: 'chats',
            required: true,
        },
        {
            name: 'sender_id',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
        {
            name: 'receiver_id',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
        {
            name: 'message_text',
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

export default Messages;
