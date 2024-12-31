import payload from 'payload';

// Combined weight calculation and update function
export const updateProgramWeights = async () => {
  try {
    console.log('Starting combined weight calculation for programs...');

    // Fetch admission programs from 'admissions'
    const admissions = await payload.find({
      collection: 'admissions',
      depth: 1,
    });

    // Fetch all programs from 'programs'
    const programs = await payload.find({
      collection: 'programs',
      limit: 1000,
      depth: 2,
    });

    if (!programs.docs || programs.docs.length === 0) {
      console.log('No programs found.');
      return;
    }

    // Maximum values for normalization in admission weights
    const maxSeats = Math.max(
      ...admissions.docs.map((ap) => ap.available_seats ?? 0)
    );
    const maxDays = Math.max(
      ...admissions.docs.map((ap) => {
        const isValidDate = (date: unknown): date is string => {
          return typeof date === 'string' && !isNaN(Date.parse(date));
        };
        const daysLeft = isValidDate(ap.admission_deadline)
          ? (new Date(ap.admission_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          : 0;
        return daysLeft > 0 ? daysLeft : 0;
      })
    );
    console.log(maxDays, "--- in final weight of programs0---")

    for (const program of programs.docs) {
      let weight = 0;

      // Step 1: University Ranking Weight (40%)
      // console.log("----- program -----", program)
      if (program.campus_id) {
        const campus = await payload.findByID({
          collection: 'campuses',
          id: program.campus_id.id,
          depth: 1,
        });

        if (campus?.university_id) {
          const university = await payload.findByID({
            collection: 'universities',
            id: campus.university_id.id,
          });

          const ranking = parseFloat(university?.ranking || '');
          if (!isNaN(ranking)) {
            const normalizedRankingWeight = 1 - ranking / 1000; // Normalize ranking
            weight += normalizedRankingWeight * 0.7;
          }
          console.log(ranking, "--- in final weight of programs0---")
        }
      }

      // Step 2: Credit Hours Weight (20%)
      if (program.credit_hours) {
        const maxCreditHours = 180; // Assume max credit hours for normalization
        weight += (program.credit_hours / maxCreditHours) * 0.2;
      }

      // Step 3: Degree Level Weight (10-30%)
      const degreeLevelWeights = {
        'PhD': 0.3,
        'Masters': 0.2,
        'Bachelors': 0.1,
      };
      if (program.degree_level) {
        weight += degreeLevelWeights[program.degree_level] || 0;
      }

      // Step 4: Scholarship Options Weight (10%)
      if (program.scholarship_options) {
        weight += 0.1;
      }

      // Step 5: Manual Sorting Weight
      if (program.sorting_weight) {
        weight += parseFloat(program.sorting_weight) || 0;
      }
      console.log(weight, "--- setup 2 ---")
      // Step 6: Admission Program Weights
      const admission = admissions.docs.find(
        (ap) => ap.program && (typeof ap.program === 'string' ? ap.program === program.id : ap.program._id == program._id)
      );

      if (admission) {
        // Seats Weight
        const seatsWeight = (admission.available_seats || 0) / maxSeats;

        // Days Left Weight
        const daysLeft = admission.admission_deadline
          ? (new Date(admission.admission_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          : 0;

        let deadlineWeight = 0;
        if (daysLeft > 0) {
          deadlineWeight = 1 - Math.pow(daysLeft / maxDays, 2);
        } else {
          deadlineWeight = 0.01;
        }

        // Demand Priority Weight
        const demandPriorityWeight = (admission.demand_priority || 0) * 0.1;

        // Combine Admission Weights
        const admissionWeight = seatsWeight * 0.4 + deadlineWeight * 0.5 + demandPriorityWeight + generateRandomValue();;
        weight += admissionWeight
      }

      // Finalize Weight
      const finalWeight = weight.toFixed(4);
      console.log(finalWeight, "--- in final weight of programs0---")
      // Update Program with Final Combined Weight
      // await payload.update({
      //   collection: 'programs',
      //   id: program.id,
      //   data: { sorting_weight: finalWeight },
      // });

      console.log(`Updated program ID ${program.id} with weight: ${finalWeight}`);
    }

    console.log('Combined weight calculation and updates completed successfully.');
  } catch (error) {
    console.error('Error in combined weight calculation:', error);
  }
};


function generateRandomValue() {
  return 0.29 + Math.random() * 0.01; // Generates a random value between 0.29 and 0.30
}
// Execute the function// Execute the function\updateProgramWeights();
