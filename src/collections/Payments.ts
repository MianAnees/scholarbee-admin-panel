import { CollectionConfig } from 'payload/types';

const Payments: CollectionConfig = {
    slug: 'payments',
    labels: {
        singular: 'Payment',
        plural: 'Payments',
    },
    fields: [
        {
            name: 'applicationId',  // Relationship to the application
            type: 'relationship',
            relationTo: 'applications', // Assuming there is an applications collection
            required: true,
            label: 'Application',
        },
        {
            name: 'bankName',
            type: 'text',
            required: true,
            label: 'Bank Name',
        },
        {
            name: 'depositDate',
            type: 'date',
            required: true,
            label: 'Date of Deposit',
        },
        {
            name: 'depositAmount',
            type: 'text',
            required: true,
            label: 'Deposited Amount',
        },
        {
            name: 'branchAddress',
            type: 'text',
            required: true,
            label: 'Branch Address',
        },
        {
            name: 'feeInvoiceUrl',
            type: 'text',
            required: true,
            label: 'Invoice url',
        },
        {
            name: 'paymentVerified',
            type: 'checkbox',
            label: 'Payment Verified',
            defaultValue: false,
            admin: {
                position: 'sidebar',
                readOnly: true, // Mark this field as read-only for normal users; can be updated by admin
            },
        },
        {
            name: 'createdAt',
            type: 'date',
            admin: {
                readOnly: true,
            },
            defaultValue: () => new Date().toISOString(),
            label: 'Created At',
        },
    ],
};

export default Payments;
