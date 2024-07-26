import { CollectionConfig } from 'payload/types';

const Campuses: CollectionConfig = {
    slug: 'campuses',
    admin: {
        useAsTitle: "campus_name"
    },
    fields: [
        {
            name: 'university_id',
            type: 'relationship',
            relationTo: 'universities',
            required: false,
        },
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'address_id',
            type: 'relationship',
            relationTo: 'addresses',
            required: false,
        },
        {
            name: 'contact_phone',
            type: 'text',
            required: false,
        },
        {
            name: 'contact_email',
            type: 'email',
            required: false,
        },
        {
            name: 'website',
            type: 'text',
            required: false,
        },
        {
            name: 'facilities',
            type: 'textarea',
            required: false,
        },
        {
            name: 'latitude',
            type: 'number',
            required: false,
        },
        {
            name: 'longitude',
            type: 'number',
            required: false,
        },
        {
            name: 'campus_type',
            type: 'text',
            required: false,
        },
        {
            name: 'established_date',
            type: 'date',
            required: false,
        },
        {
            name: 'accreditations',
            type: 'textarea',
            required: false,
        },
        {
            name: 'student_population',
            type: 'number',
            required: false,
        },
        {
            name: 'campus_area',
            type: 'number',
            required: false,
        },
        {
            name: 'residential_facilities',
            type: 'checkbox',
            required: false,
        },
        {
            name: 'transportation_options',
            type: 'checkbox',
            required: false,
        },
        {
            name: 'healthcare_facilities',
            type: 'checkbox',
            required: false,
        },
        {
            name: 'sports_facilities',
            type: 'checkbox',
            required: false,
        },
        {
            name: 'library_facilities',
            type: 'checkbox',
            required: false,
        },
        {
            name: 'dining_options',
            type: 'checkbox',
            required: false,
        },
        {
            name: 'parking_facilities',
            type: 'checkbox',
            required: false,
        },
        {
            name: 'security_features',
            type: 'checkbox',
            required: false,
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

export default Campuses;
