import { CollectionConfig } from 'payload/types';

const Messages: CollectionConfig = {
    slug: 'messages',
    labels: {
        singular: 'Message',
        plural: 'Messages',

    },
    fields: [
        {
            name: 'chat_id',
            type: 'relationship',
            relationTo: 'chats',
            required: true,
            label: 'Chat',
        },
        {
            name: 'sender_id',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            label: 'Sender',
        },
        {
            name: 'receiver_id',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            label: 'Receiver',
        },
        {
            name: 'message_text',
            type: 'textarea',
            required: true,
            label: 'Message Text',
        },
        {
            name: 'timestamp',
            type: 'date',
            required: true,
            label: 'Timestamp',
        },
    ],
};

export default Messages;
