import { CollectionConfig } from 'payload/types';

const ScholarshipOrganizations: CollectionConfig = {
    slug: 'organizations',
    labels: {
        singular: 'Organization',
        plural: 'Organizations',
    },
    fields: [
        {
            name: 'organization_name',
            type: 'text',
            required: true,
            label: 'Organization Name',
        },
        {
            name: 'organization_type',
            type: 'select',
            options: [
                { label: 'Government', value: 'government' },
                { label: 'Private Organization', value: 'private' },
                { label: 'Company', value: 'company' },
                { label: 'University', value: 'university' },
            ],
            required: true,
            label: 'Organization Type',
        },
        {
            name: 'website_url',
            type: 'text',
            label: 'Website Url',
        },
        {
            name: 'profile_image_url',
            type: 'text',
            label: 'Profile Image Url',
        },
        {
            name: 'contact_email',
            type: 'text',
            label: 'Contact Email',
        },
        {
            name: 'contact_phone',
            type: 'text',
            label: 'Contact Phone',
        },
        {
            name: 'address',
            type: 'textarea',
            label: 'Address',
        },
        {
            name: 'country',
            type: 'relationship',
            relationTo: 'countries',
            label: 'Country',
        },
        {
            name: 'region',
            type: 'relationship',
            relationTo: 'regions',
            label: 'Region',
        },
    ],
};

export { ScholarshipOrganizations };

