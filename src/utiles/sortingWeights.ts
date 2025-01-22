// import payload from 'payload';

// interface AdmissionProgram {
//   available_seats?: number;  // Available seats, optional
//   program: string | { id: string };  // Program can be an ObjectId or an object with an 'id' property
//   application_deadline?: string; // Application deadline, optional
//   demand_priority?: number;  // Priority based on demand, optional
// }

// export const updateSortingWeights = async () => {
//   try {
//     // Fetch admission programs from the 'admission_programs' collection
//     const admissionPrograms: any = await payload.find({
//       collection: 'admission_programs',
//       depth: 1,
//     });
//     console.log(admissionPrograms, "-----in sort weight-----")
//     // Get the maximum available seats for calculating the seat weight
//     const maxSeats = Math.max(
//       ...admissionPrograms.docs.map((ap) => ap.available_seats ?? 0)
//     );

//     // Get the maximum days left for all programs for calculating the deadline weight
//     const maxDays = Math.max(
//       ...admissionPrograms.docs.map((ap) => {
//         const isValidDate = (date: unknown): date is string => {
//           return typeof date === 'string' && !isNaN(Date.parse(date));
//         };

//         // Calculate the days left until the application deadline
//         const daysLeft = isValidDate(ap.application_deadline)
//           ? (new Date(ap.application_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
//           : 0;

//         // Return daysLeft, ensuring it's never negative
//         return daysLeft > 0 ? daysLeft : 0;
//       })
//     );

//     // Map over each admission program to calculate sorting weight
//     const updates = admissionPrograms.docs.map(async (ap) => {
//       // Extract the program ID if it's an object
//       const programId = typeof ap.program === 'string' ? ap.program : ap.program.id;

//       // Calculate seat weight
//       const seatsWeight = (ap.available_seats || 0) / maxSeats;

//       // Calculate deadline weight
//       const daysLeft = ap.application_deadline
//         ? (new Date(ap.application_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
//         : 0;
//       const deadlineWeight = daysLeft > 0 ? 1 - daysLeft / maxDays : 1;

//       // Calculate sorting weight based on seat weight, deadline weight, and demand priority
//       const sortingWeight =
//         seatsWeight * 0.4 + deadlineWeight * 0.3 + ((ap.demand_priority || 0) * 0.3);
//       console.log(seatsWeight, "----", daysLeft, "----", sortingWeight)
//       // Update the program document with the new sorting weight
//       await payload.update({
//         collection: 'programs',
//         id: programId, // Pass the correct program ID here
//         data: { sorting_weight: sortingWeight },
//       });
//     });

//     // Wait for all updates to finish
//     console.log("Sorting weights update started...", maxSeats, maxDays);
//     // await Promise.all(updates);
//     console.log("Sorting weights updated successfully!");

//   } catch (error) {
//     console.error("Error updating sorting weights:", error);
//   }
// };




// *************************************** ************************** ***************************
// *************************************** script for number fo seats ***************************
// *************************************** *************************** **************************
// import payload from 'payload';

// export const assignRandomSeatsToPrograms = async () => {
//   try {
//     // Fetch admission programs from the 'admission_programs' collection
//     const admissionPrograms: any = await payload.find({
//       collection: 'admission_programs',
//       depth: 1,
//       limit: 1000,
//     });

//     console.log("Fetched admission programs:", admissionPrograms);

//     // Generate random seats for each program and update the collection
//     const updates = admissionPrograms.docs.map(async (ap) => {
//       const randomSeats = Math.floor(Math.random() * (200 - 80 + 1)) + 80; // Random number between 80 and 200

//       console.log(`Updating program ID: ${ap.id} with seats: ${randomSeats}`);

//       await payload.update({
//         collection: 'admission_programs',
//         id: ap.id, // Use the correct program ID
//         data: { available_seats: randomSeats },
//       });
//     });

//     // Wait for all updates to complete
//     await Promise.all(updates);

//     console.log("Successfully assigned random seats to all programs!");
//   } catch (error) {
//     console.error("Error assigning random seats:", error);
//   }
// };


import payload from 'payload';

export const assignSortingWeightsToPrograms = async () => {
  try {
    // Fetch all programs from the 'programs' collection
    // const programs: any = await payload.find({
    //   collection: 'admissions',
    //   depth: 1,
    //   limit: 10000,
    //   // where: {
    //   //   sorting_weight: {
    //   //     exists: false, // Filters documents where sortingWeight does not exist or is null
    //   //   },
    //   //   // campus_id: {
    //   //   //   in: ["66a3b5905d8ab0b21ad1c643", "66a7a8405d8ab0b21ad1f580"]
    //   //   // }
    //   // },
    // });

    // console.log("Fetched programs:", programs);


    const admissions = await payload.find({
      collection: 'admissions',
      depth: 1,
      limit: 10000,
      where: {
        or: [
          {
            and: [
              {
                admission_deadline: {
                  less_than: '2025-01-21T12:00:00.000Z',
                },
              },
            ],
          },
        ],
      },
    });
    console.log(admissions)
    // Generate random sorting weights and update each program
    // const updates = programs.docs.map(async (program) => {
    // for (let program of programs.docs) {
    for (let program of admissions.docs) {
      // const randomWeight = Math.floor(Math.random() * (90 - 10 + 1)) + 10;
      // console.log(program, "--- hellow orl")
      // console.log(`Updating program ID: ${program.id} with sorting weight: ${randomWeight}`);

      // Update the program with the calculated sorting weight
      await payload.update({
        collection: 'admissions',
        id: program.id, // Use the program ID
        data: { admission_deadline: "2025-02-15T12:00:00.000Z" },
      });
      // });

    }
    // Generate a random number between 10 and 90

    // Wait for all updates to complete
    // await Promise.all(updates);

    console.log("Successfully updated sorting weights for all programs!");
  } catch (error) {
    console.error("Error assigning sorting weights:", error);
  }
};
