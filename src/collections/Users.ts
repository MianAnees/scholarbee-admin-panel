import { CollectionConfig } from 'payload/types';

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    // {
    //   name: '_id',
    //   type: 'text',
    //   required: true,
    // },
    {
      name: 'first_name',
      type: 'text',
      required: true,
    },
    {
      name: 'last_name',
      type: 'text',
      required: true,
    },
    {
      name: 'date_of_birth',
      type: 'date',
      required: true,
      admin: {
        description: 'Required for students',
      },
    },
    {
      name: 'gender',
      type: 'select',
      options: [
        'Male',
        'Female',
        'Other',
      ],
      required: true,
      admin: {
        description: 'Required for students',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone_number',
      type: 'text',
      required: true,
    },
    {
      name: 'address_id',
      type: 'relationship',
      relationTo: 'addresses',
      required: true,
    },
    {
      name: 'user_type',
      type: 'select',
      options: [
        'Student',
        'Admin',
      ],
      required: true,
    },
    {
      name: 'registration_no',
      type: 'text',
      admin: {
        condition: (data) => data.user_type === 'Student',
        description: 'Required for students',
      },
      required: false,
    },
    {
      name: 'university_id',
      type: 'relationship',
      relationTo: 'universities',
      admin: {
        condition: (data) => data.user_type === 'Admin',
        description: 'Required for admins',
      },
    },
    {
      name: 'campus_id',
      type: 'relationship',
      relationTo: 'campuses',
      admin: {
        condition: (data) => data.user_type === 'Admin',
        description: 'Required for campus admins',
      },
    },
    {
      name: 'user_profile_id',
      type: 'relationship',
      relationTo: 'user_profiles',
      admin: {
        condition: (data) => data.user_type === 'Student',
        description: 'Required for Students',
      },
    },
    {
      name: 'profile_image_url',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Profile Image',
      },
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

export default Users;
