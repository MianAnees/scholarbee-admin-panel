import { CollectionConfig } from 'payload/types';

const Admissions: CollectionConfig = {
    slug: 'admissions',
    labels: {
        singular: 'Admission',
        plural: 'Admissions',
    },
    admin: {
        useAsTitle: 'admission_title',
    },
    access: {
        // Allow public read access
        read: () => true,

        // Restrict create, update, and delete to authenticated users
        create: ({ req: { user } }) => {
            return !!user; // Only allow if a user is logged in
        },
        update: ({ req: { user } }) => {
            return !!user; // Only allow if a user is logged in
        },
        delete: ({ req: { user } }) => {
            return !!user; // Only allow if a user is logged in
        },
    },
    fields: [
        {
            name: 'university_id',
            type: 'relationship',
            relationTo: 'universities',
            required: true,
            label: 'University',
        },
        {
            name: 'campus_id',
            type: 'relationship',
            relationTo: 'campuses',
            required: true,
            label: 'Campus',
        },
        {
            name: 'admission_title',
            type: 'text',
            required: true,
            label: 'Admission Title',
        },
        {
            name: 'available_seats',
            type: 'number',
            required: true,
            label: 'Available Seats',
        },
        {
            name: 'admission_description',
            type: 'textarea',
            label: 'Admission Description',
        },
        {
            name: 'admission_deadline',
            type: 'date',
            required: true,
            label: 'Admission Deadline',
        },
        {
            name: 'admission_startdate',
            type: 'date',
            required: false,
            label: 'Admission Start Date',
        },
        {
            name: 'admission_announcements',
            type: 'array',
            label: 'Admission Announcements',
            fields: [
                {
                    name: 'key',
                    type: 'text',
                    label: 'Announcement Key',
                    required: true,
                },
                {
                    name: 'value',
                    type: 'textarea',
                    label: 'Announcement Value',
                    required: true,
                },
            ],
        },
        {
            name: 'admission_requirements',
            type: 'array',
            label: 'Admission Requirements',
            fields: [
                {
                    name: 'key',
                    type: 'text',
                    label: 'Requirement Key',
                    required: true,
                },
                {
                    name: 'value',
                    type: 'textarea',
                    label: 'Requirement Value',
                    required: true,
                },
            ],
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

export default Admissions;
