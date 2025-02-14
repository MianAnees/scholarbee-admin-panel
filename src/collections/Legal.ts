// collections/Legal.ts
import { CollectionConfig } from 'payload/types';

const Legal: CollectionConfig = {
    slug: 'legal',
    labels: {
        singular: 'Legal Document',
        plural: 'Legal Documents',
    },
    admin: {
        useAsTitle: 'title',
    },
    access: {
        // Allow public read access so that your front-end can display the legal text.
        read: () => true,
        // Restrict create, update, and delete to admins or authenticated users as needed.
        create: ({ req: { user } }) => !!user,
        update: ({ req: { user } }) => !!user,
        delete: ({ req: { user } }) => !!user,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            label: 'Title',
        },
        {
            name: 'content',
            type: 'richText',
            label: 'Content',
        },
        {
            name: 'version',
            type: 'text',
            label: 'Version',
        },
        {
            name: 'type',
            type: 'select',
            options: [
                { label: 'Terms and Conditions', value: 'terms' },
                { label: 'Privacy Policy', value: 'privacy' },
            ],
            label: 'Document Type',
        },
        {
            name: 'assignedTo',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            label: 'Assigned To',
        },
        {
            name: 'publishedAt',
            type: 'date',
            label: 'Published Date',
        },
    ],
};

export default Legal;
