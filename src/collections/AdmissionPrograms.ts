import { CollectionConfig } from 'payload/types';

const AdmissionPrograms: CollectionConfig = {
    slug: 'admission-programs',
    labels: {
        singular: 'Admission Program',
        plural: 'Admission Programs',
    },
    fields: [
        {
            name: 'admission',
            type: 'relationship',
            relationTo: 'admissions',
            required: true,
            label: 'Admission',
        },
        {
            name: 'program',
            type: 'relationship',
            relationTo: 'programs',
            required: true,
            label: 'Program',
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

export default AdmissionPrograms;
