import { CollectionConfig } from 'payload/types';

const Campuses: CollectionConfig = {
    slug: 'campuses',
    labels: {
        singular: 'Campus',
        plural: 'Campuses',
    },
    admin: {
        useAsTitle: 'name',
    },
    fields: [
        {
            name: 'university_id',
            type: 'relationship',
            relationTo: 'universities',
            required: false,
            label: 'University',
        },
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Campus Name',
        },
        {
            name: 'address_id',
            type: 'relationship',
            relationTo: 'addresses',
            required: false,
            label: 'Address',
        },
        {
            name: 'contact_phone',
            type: 'text',
            required: false,
            label: 'Contact Phone',
        },
        {
            name: 'contact_email',
            type: 'email',
            required: false,
            label: 'Contact Email',
        },
        {
            name: 'website',
            type: 'text',
            required: false,
            label: 'Website',
        },
        {
            name: 'facilities',
            type: 'textarea',
            required: false,
            label: 'Facilities',
        },
        {
            name: 'latitude',
            type: 'number',
            required: false,
            label: 'Latitude',
        },
        {
            name: 'longitude',
            type: 'number',
            required: false,
            label: 'Longitude',
        },
        {
            name: 'campus_type',
            type: 'text',
            required: false,
            label: 'Campus Type',
        },
        {
            name: 'established_date',
            type: 'date',
            required: false,
            label: 'Established Date',
        },
        {
            name: 'accreditations',
            type: 'textarea',
            required: false,
            label: 'Accreditations',
        },
        {
            name: 'student_population',
            type: 'number',
            required: false,
            label: 'Student Population',
        },
        {
            name: 'campus_area',
            type: 'number',
            required: false,
            label: 'Campus Area (in acres)',
        },
        {
            name: 'residential_facilities',
            type: 'checkbox',
            required: false,
            label: 'Residential Facilities',
        },
        {
            name: 'transportation_options',
            type: 'checkbox',
            required: false,
            label: 'Transportation Options',
        },
        {
            name: 'healthcare_facilities',
            type: 'checkbox',
            required: false,
            label: 'Healthcare Facilities',
        },
        {
            name: 'sports_facilities',
            type: 'checkbox',
            required: false,
            label: 'Sports Facilities',
        },
        {
            name: 'library_facilities',
            type: 'checkbox',
            required: false,
            label: 'Library Facilities',
        },
        {
            name: 'dining_options',
            type: 'checkbox',
            required: false,
            label: 'Dining Options',
        },
        {
            name: 'parking_facilities',
            type: 'checkbox',
            required: false,
            label: 'Parking Facilities',
        },
        {
            name: 'security_features',
            type: 'checkbox',
            required: false,
            label: 'Security Features',
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

export default Campuses;
