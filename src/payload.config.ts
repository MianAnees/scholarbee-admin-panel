import path from 'path'

import { payloadCloud } from '@payloadcms/plugin-cloud'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { slateEditor } from '@payloadcms/richtext-slate'
import { buildConfig } from 'payload/config'

import Users from './collections/Users'
import UserProfiles from './collections/UserProfiles'
import Universities from './collections/Universities'
import StudentScholarships from './collections/StudentScholarships'
import Scholarships from './collections/Scholarships'
import Programs from './collections/Programs'
import Messages from './collections/Messages'
import Courses from './collections/Courses'
import Chats from './collections/Chats'
import Certificates from './collections/Certificates'
import Campuses from './collections/Campuses'
import Admissions from './collections/Admissions'
import Addresses from './collections/Addresses'
import Forms from './collections/Forms'
import FormResponses from './collections/FormResponses'
import Media from './collections/Media'
import FeeStructures from './collections/FeeStructures'
import TransportationOptions from './collections/TransportationOptions'
import AcademicDepartments from './collections/AcademicDepartments'
import AdministrativeOffices from './collections/AdministrativeOffices'
import EmergencyContacts from './collections/EmergencyContacts'
import HealthcareFacilities from './collections/HealthcareFacilities'
import LibraryFacilities from './collections/LibraryFacilities'
import ResidentialFacilities from './collections/ResidentialFacilities'
import FormFields from './collections/FormFields'
import FormFieldValues from './collections/FormFieldValues'
import { cloudStorage } from '@payloadcms/plugin-cloud-storage'
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
import AdmissionPrograms from './collections/AdmissionPrograms'
import Applications from './collections/Applications'
// import Applications from './collections/Applications'




export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    components: {
      // views: {
      //   DynamicForm: DynamicForm,
      // },
    },
  },
  editor: slateEditor({}),
  collections: [Users,
    UserProfiles,
    Universities,
    StudentScholarships,
    Scholarships,
    Programs,
    Messages,
    Courses,
    Chats,
    Certificates,
    Campuses,
    Admissions,
    Addresses,
    Forms,
    FormResponses,
    FeeStructures,
    TransportationOptions,
    AcademicDepartments,
    AdministrativeOffices,
    EmergencyContacts,
    HealthcareFacilities,
    LibraryFacilities,
    ResidentialFacilities,
    Media,
    FormFields,
    FormFieldValues,
    Applications,
    AdmissionPrograms
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [payloadCloud(),
  // Pass the plugin to Payload
  cloudStorage({
    collections: {
      // Enable cloud storage for Media collection
      media: {
        adapter: s3Adapter({
          config: {
            endpoint: `${process.env.S3_ENDPOINT}`,
            region: process.env.S3_REGION,
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            },
          },
          bucket: process.env.S3_BUCKET,
        }),
      },

    },
  })
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
})
