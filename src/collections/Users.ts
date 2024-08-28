import payload from 'payload';
import { CollectionConfig } from 'payload/types';
import { transporter } from '../utiles/mailConfig';

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    forgotPassword: {
      generateEmailHTML: ({ req, token, user }: any) => {
        const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        return `
        <!doctype html>
        <html>
          <body>
            <h1>Here is my custom email template!</h1>
            <p>Hello, ${user.email}!</p>
            <p>Click below to reset your password.</p>
            <p>
              <a href="${resetPasswordURL}">${resetPasswordURL}</a>
            </p>
          </body>
        </html>
      `;
      },
    },
  },
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
    {
      name: 'nationality',
      type: 'text',
      required: false,
      label: 'Nationality/Country of Residence',
    },
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
      name: 'fatherEmailAddress',
      type: 'email',
      required: false,
      label: "Father's Email Address",
    },
    {
      name: 'fatherPhoneNumber',
      type: 'text',
      required: false,
      label: "Father's Phone Number",
    },
    {
      name: 'provinceOfDomicile',
      type: 'select',
      required: false,
      options: [
        {
          label: 'Khyber Pakhtunkhwa',
          value: 'khyber_pakhtunkhwa',
        },
        {
          label: 'Punjab',
          value: 'punjab',
        },
        {
          label: 'Sindh',
          value: 'sindh',
        },
        {
          label: 'Balochistan',
          value: 'balochistan',
        },
        // Add more provinces as needed
      ],
      label: 'Province of Domicile',
    },
    {
      name: 'districtOfDomicile',
      type: 'text',
      required: false,
      label: 'District of Domicile',
    },
    {
      name: 'stateOrProvince',
      type: 'text',
      required: false,
      label: 'State/Province',
    },
    {
      name: 'city',
      type: 'text',
      required: false,
      label: 'City',
    },
    {
      name: 'postalCode',
      type: 'text',
      required: false,
      label: 'Postal/Zip Code',
    },
    {
      name: 'streetAddress',
      type: 'text',
      required: false,
      label: 'Street Address',
    },
    {
      name: 'address_id',
      type: 'relationship',
      relationTo: 'addresses',
      required: false,
      label: 'Current Address',
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
      type: 'text',
      required: false,
      label: 'Profile Image URL',
      admin: {
        description: 'Provide the URL of the profile image stored in S3 or another storage service.',
      },
    },
    {
      name: 'educational_backgrounds',
      type: 'array',
      label: 'Educational Backgrounds',
      fields: [
        {
          name: 'education_level',
          type: 'select',
          options: [
            'Matriculation',
            'Intermediate/FSc/FA',
            'Bachelors',
            'Masters',
            'PhD',
          ],
          required: false,
          label: 'Education Level',
        },
        {
          name: 'field_of_study',
          type: 'text',
          required: false,
          label: 'Field of Study',
        },
        {
          name: 'school_college_university',
          type: 'text',
          required: false,
          label: 'School/College/University',
        },
        {
          name: 'marks_gpa',
          type: 'group',
          fields: [
            {
              name: 'total_marks_gpa',
              type: 'text',
              required: false,
              label: 'Total Marks/GPA',
            },
            {
              name: 'obtained_marks_gpa',
              type: 'text',
              required: false,
              label: 'Obtained Marks/GPA',
            }
          ],
          label: 'Marks/GPA',
        },
        {
          name: 'year_of_passing',
          type: 'text',
          required: false,
          label: 'Year of Passing',
        },
        {
          name: 'board',
          type: 'text',
          required: false,
          label: 'Board',
        },
        {
          name: 'transcript',
          type: 'text',
          required: false,
          label: 'Transcript URL',
          admin: {
            description: 'Provide the URL of the transcript file stored in S3 or another storage service.',
          },
        },
      ],
    },
    {
      name: 'national_id_card',
      type: 'group',
      fields: [
        {
          name: 'front_side',
          type: 'text',
          required: false,
          label: 'Front Side URL',
          admin: {
            description: 'Provide the URL of the front side of the National ID card stored in S3 or another storage service.',
          },
        },
        {
          name: 'back_side',
          type: 'text',
          required: false,
          label: 'Back Side URL',
          admin: {
            description: 'Provide the URL of the back side of the National ID card stored in S3 or another storage service.',
          },
        },
      ],
      label: 'National ID Card',
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
        readOnly: true,
      },
    },
  ],
};

export default Users;
