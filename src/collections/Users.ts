import payload from 'payload';
import { CollectionConfig } from 'payload/types';
import { transporter } from '../utiles/mailConfig';

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  labels: {
    singular: 'User',
    plural: 'Users',

  },
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'first_name',
      type: 'text',
      required: true,
      label: 'First Name',
    },
    {
      name: 'last_name',
      type: 'text',
      required: true,
      label: 'Last Name',
    },
    {
      name: 'date_of_birth',
      type: 'date',
      required: false,
      label: 'Date of Birth',
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
      required: false,
      label: 'Gender',
      admin: {
        description: 'Required for students',
      },
    },
    //nationality
    //
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email',
    },
    {
      name: 'phone_number',
      type: 'text',
      required: false,
      label: 'Phone Number',
    },
    {
      name: 'address_id',
      type: 'relationship',
      relationTo: 'addresses',
      required: false,
      label: 'Address',
    },
    {
      name: 'user_type',
      type: 'select',
      options: [
        'Student',
        'Admin',
      ],
      required: true,
      label: 'User Type',
    },
    {
      name: 'registration_no',
      type: 'text',
      admin: {
        condition: (data) => data.user_type === 'Student',
        description: 'Required for students',
      },
      required: false,
      label: 'Registration Number',
    },
    {
      name: 'university_id',
      type: 'relationship',
      relationTo: 'universities',
      admin: {
        condition: (data) => data.user_type === 'Admin',
        description: 'Required for admins',
      },
      label: 'University',
    },
    {
      name: 'campus_id',
      type: 'relationship',
      relationTo: 'campuses',
      admin: {
        condition: (data) => data.user_type === 'Admin',
        description: 'Required for campus admins',
      },
      label: 'Campus',
    },
    {
      name: 'user_profile_id',
      type: 'relationship',
      relationTo: 'user_profiles',
      admin: {
        condition: (data) => data.user_type === 'Student',
        description: 'Required for Students',
      },
      label: 'User Profile',
    },
    {
      name: 'profile_image_url',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Profile Image URL',
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
      label: 'Created At',
    },
    {
      name: 'verifyToken',
      type: 'text',
      hidden: true,
      defaultValue: "",
    },
    {
      name: '_verified',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true
      }
    },
  ],
  // hooks: {
  //   afterChange: [async ({ operation, doc, req }) => {
  //     console.log(operation, "------")
  //     try {
  //       if (operation === 'create' && !doc._verified) {
  //         const verifyToken = crypto.randomBytes(20).toString('hex');
  //         console.log("Attempting to update user with ID:", doc.id); // Debug ID

  //         const existingUser = await payload.findByID({
  //           collection: 'users',
  //           id: doc.id,
  //         });
  //         console.log("Fetched User:", existingUser);

  //         const updatedUser = await payload.update({
  //           collection: 'users',
  //           id: doc.id,
  //           data: { verifyToken },
  //           overrideAccess: true,
  //         });
  //         console.log("User updated with new token:", updatedUser);
  //         console.log("-----after verification-----")
  //         const verificationUrl = `https://admin.scholarbee.pk/api/verify-email/${verifyToken}`;
  //         const mailOptions = {
  //           from: 'basitafraz8@gmail.com',
  //           to: doc.email,
  //           subject: 'Verify Your Email Address',
  //           html: `<p>Please verify your email by clicking the following link: <a href="${verificationUrl}">${verificationUrl}</a></p>`
  //         };

  //         // transporter.sendMail(mailOptions, (error, info) => {
  //         //   if (error) {
  //         //     console.error('Error sending mail:', error);
  //         //   } else {
  //         //     console.log('Email sent: %s', info.response);
  //         //   }
  //         // });
  //       }

  //     } catch (error) {
  //       console.log(error)
  //     }
  //     return
  //   }
  //   ]
  // }
};

export default Users;
