import payload from 'payload';

export const insertDataToCollections = async (data) => {
    try {
        const { universities } = data;

        if (!universities || !Array.isArray(universities)) {
            console.error('Invalid data format: "universities" must be an array');
            return;
        }

        console.log('Starting data insertion for universities and related collections.');

        for (const university of universities) {
            // Check for NaN values and replace them with null for numeric fields
            university.total_students = isNaN(university.total_students) ? null : university.total_students;
            university.total_faculty = isNaN(university.total_faculty) ? null : university.total_faculty;
            university.total_alumni = isNaN(university.total_alumni) ? null : university.total_alumni;
            university.annual_budget = isNaN(university.annual_budget) ? null : university.annual_budget;
            university.research_output = isNaN(university.research_output) ? null : university.research_output;
            university.international_students = isNaN(university.international_students) ? null : university.international_students;

            // Insert University
            console.log(`Inserting university: ${university.name}`);
            const universityDoc = await payload.create({
                collection: 'universities',
                data: {
                    ...university,
                    campuses: undefined, // Exclude nested data
                },
            });

            if (university.campuses && Array.isArray(university.campuses)) {
                for (const campus of university.campuses) {
                    // Insert Campus
                    console.log(`  Inserting campus: ${campus.name}`);
                    const campusDoc = await payload.create({
                        collection: 'campuses',
                        data: {
                            ...campus,
                            university_id: universityDoc.id, // Link campus to university
                            departments: undefined, // Exclude nested data
                        },
                    });

                    if (campus.departments && Array.isArray(campus.departments)) {
                        for (const department of campus.departments) {
                            // Insert Department
                            console.log(`    Inserting department: ${department.name}`);
                            const departmentDoc = await payload.create({
                                collection: 'academic_departments',
                                data: {
                                    ...department,
                                    campus_id: campusDoc.id, // Link department to campus
                                    programs: undefined, // Exclude nested data
                                },
                            });
                        }
                    }
                }
            }
        }

        console.log('Data insertion completed successfully!');
    } catch (error) {
        console.error('Error inserting data into collections:', error);
    }
};

