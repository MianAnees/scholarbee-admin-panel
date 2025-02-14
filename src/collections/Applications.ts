import { CollectionConfig } from 'payload/types';

const Applications: CollectionConfig = {
    slug: 'applications',
    labels: {
        singular: 'Application',
        plural: 'Applications',
    },
    fields: [
        {
            name: 'applicant',
            type: 'relationship',
            relationTo: 'users',
            required: false,
            label: 'Applicant',
        },
        {
            name: 'campus_id',
            type: 'relationship',
            relationTo: 'campuses',
            required: false,
            label: 'Campus',
        },
        {
            name: 'applicant_snapshot',
            type: 'group',
            label: 'Applicant Snapshot',
            fields: [
                { name: 'first_name', type: 'text', label: 'First Name' },
                { name: 'last_name', type: 'text', label: 'Last Name' },
                { name: 'email', type: 'email', label: 'Email' },
                { name: 'phone_number', type: 'text', label: 'Phone Number' },
                { name: 'date_of_birth', type: 'date', label: 'Date of Birth' },
                { name: 'father_name', type: 'text', label: "Father's Name" },
                { name: 'father_profession', type: 'text', label: "Father's Profession" },
                { name: 'father_status', type: 'text', label: "Father's Status" },
                { name: 'father_income', type: 'text', label: "Father's Income" },
                { name: 'mother_name', type: 'text', label: "Mother's Name" },
                { name: 'mother_profession', type: 'text', label: "Mother's Profession" },
                { name: 'mother_status', type: 'text', label: "Mother's Status" },
                { name: 'mother_income', type: 'text', label: "Mother's Income" },
                { name: 'religion', type: 'text', label: 'Religion' },
                { name: 'special_person', type: 'text', label: 'Are You a Special Person?' },
                { name: 'gender', type: 'text', label: 'Gender' },
                { name: 'nationality', type: 'text', label: 'Nationality/Country of Residence' },
                { name: 'provinceOfDomicile', type: 'text', label: 'Province of Domicile' },
                { name: 'districtOfDomicile', type: 'text', label: 'District of Domicile' },
                { name: 'stateOrProvince', type: 'text', label: 'State/Province' },
                { name: 'city', type: 'text', label: 'City' },
                { name: 'postalCode', type: 'text', label: 'Postal/Zip Code' },
                { name: 'streetAddress', type: 'text', label: 'Street Address' },
                { name: 'profile_image_url', type: 'text', label: 'Profile Image URL' },
                { name: 'user_type', type: 'text', label: 'User Type' },
                {
                    name: 'educational_backgrounds',
                    type: 'array',
                    label: 'Educational Backgrounds',
                    fields: [
                        { name: 'education_level', type: 'text', label: 'Education Level' },
                        { name: 'field_of_study', type: 'text', label: 'Field of Study' },
                        { name: 'school_college_university', type: 'text', label: 'School/College/University' },
                        {
                            name: 'marks_gpa',
                            type: 'group',
                            fields: [
                                { name: 'total_marks_gpa', type: 'text', label: 'Total Marks/GPA' },
                                { name: 'obtained_marks_gpa', type: 'text', label: 'Obtained Marks/GPA' }
                            ],
                            label: 'Marks/GPA',
                        },
                        { name: 'year_of_passing', type: 'text', label: 'Year of Passing' },
                        { name: 'board', type: 'text', label: 'Board' },
                        { name: 'transcript', type: 'text', label: 'Transcript URL' }
                    ],
                },
                {
                    name: 'national_id_card',
                    type: 'group',
                    fields: [
                        { name: 'front_side', type: 'text', label: 'Front Side URL' },
                        { name: 'back_side', type: 'text', label: 'Back Side URL' }
                    ],
                    label: 'National ID Card',
                }
            ],
        },
        {
            name: 'departments',
            type: 'array',
            label: 'Departments',
            fields: [
                {
                    name: 'department',
                    type: 'relationship',
                    relationTo: 'academic_departments',
                    required: false,
                    label: 'Department',
                },
                {
                    name: 'preferences',
                    type: 'array',
                    label: 'Program Preferences',
                    minRows: 1,
                    maxRows: 3,
                    fields: [
                        {
                            name: 'program',
                            type: 'relationship',
                            relationTo: 'programs',
                            required: false,
                            label: 'Program',
                        },
                        {
                            name: 'preference_order',
                            type: 'select',
                            options: ['1st', '2nd', '3rd'],
                            required: false,
                            label: 'Preference Order',
                        },
                    ],
                },
                {
                    name: 'processing_fee',
                    type: 'number',
                    required: false,
                    label: 'Processing Fee',
                },
            ],
        },
        {
            name: 'admission_program_id',
            type: 'relationship',
            relationTo: 'admission_programs',
            required: true,
            label: 'Admission Program',
        },
        {
            name: 'program',
            type: 'relationship',
            relationTo: 'programs',
            required: false,
            label: 'Program',
        },
        {
            name: 'total_processing_fee',
            type: 'number',
            required: false,
            label: 'Total Processing Fee',
        },
        {
            name: 'submission_date',
            type: 'date',
            admin: {
                readOnly: false,
            },
            defaultValue: () => new Date().toISOString(),
            label: 'Submission Date',
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'Pending',
            options: ['Pending', 'Approved', 'Rejected'],
            required: false,
            label: 'Status',
        },
    ],
    endpoints: [
        {
            path: '/update-application-status',
            method: 'post',
            handler: async (req, res, next) => {
                const { applicationId, status } = req.body;
                // Validation for incoming data
                if (!applicationId || !status) {
                    return res.status(400).json({ error: 'Missing applicationId or status in request body' });
                }

                try {
                    console.log(applicationId, status, "----- before api call ----");
                    // Update the status of the application
                    const updatedApplication = await req.payload.update({
                        collection: 'applications',
                        id: applicationId,
                        data: { status },
                    });

                    console.log(updatedApplication, "------ hellow world -----");

                    return res.status(200).json({
                        message: 'Application status updated successfully',
                        application: updatedApplication,
                    });
                } catch (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Error updating application status' });
                }
            },
        },
    ],
    hooks: {
        beforeChange: [
            async ({ data, originalDoc, req }) => {
                try {
                    // Only perform this check when creating a new application.
                    if (!originalDoc) {
                        // Check if both applicant and admission_program_id are provided.
                        if (data.applicant && data.admission_program_id) {
                            const existingApplication = await req.payload.find({
                                collection: 'applications',
                                where: {
                                    applicant: { equals: data.applicant },
                                    admission_program_id: { equals: data.admission_program_id },
                                },
                                limit: 1,
                            });

                            if (existingApplication.docs.length > 0) {
                                throw new Error('Already applied for this admission program.');
                            }
                        }

                        // Populate applicant_snapshot using the applicant's current information.
                        const user: any = await req.payload.findByID({
                            collection: 'users',
                            id: data.applicant,
                        });

                        data.applicant_snapshot = {
                            first_name: user.first_name || null,
                            last_name: user.last_name || null,
                            email: user.email || null,
                            phone_number: user.phone_number || null,
                            date_of_birth: user.date_of_birth || null,
                            father_name: user.father_name || null,
                            father_profession: user.father_profession || null,
                            father_status: user.father_status || null,
                            father_income: user.father_income || null,
                            mother_name: user.mother_name || null,
                            mother_profession: user.mother_profession || null,
                            mother_status: user.mother_status || null,
                            mother_income: user.mother_income || null,
                            religion: user.religion || null,
                            special_person: user.special_person || null,
                            gender: user.gender || null,
                            nationality: user.nationality || null,
                            provinceOfDomicile: user.provinceOfDomicile || null,
                            districtOfDomicile: user.districtOfDomicile || null,
                            stateOrProvince: user.stateOrProvince || null,
                            city: user.city || null,
                            postalCode: user.postalCode || null,
                            streetAddress: user.streetAddress || null,
                            profile_image_url: user.profile_image_url || null,
                            user_type: user.user_type || null,
                            educational_backgrounds:
                                user.educational_backgrounds?.map((edu: any) => ({
                                    education_level: edu.education_level || null,
                                    field_of_study: edu.field_of_study || null,
                                    school_college_university: edu.school_college_university || null,
                                    marks_gpa: {
                                        total_marks_gpa: edu.marks_gpa?.total_marks_gpa || null,
                                        obtained_marks_gpa: edu.marks_gpa?.obtained_marks_gpa || null,
                                    },
                                    year_of_passing: edu.year_of_passing || null,
                                    board: edu.board || null,
                                    transcript: edu.transcript || null,
                                })) || [],
                            national_id_card: {
                                front_side: user.national_id_card?.front_side || null,
                                back_side: user.national_id_card?.back_side || null,
                            },
                        };
                    }
                    return data;
                } catch (error: any) {
                    console.error('Error in beforeChange hook for Applications:', error);
                    // Rethrow the error so Payload can return it to the frontend
                    throw new Error(error.message || 'Error processing application');
                }
            },
        ],
    },
};

export default Applications;
