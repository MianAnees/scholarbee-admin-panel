import payload from 'payload';

interface AdmissionProgram {
  available_seats?: number;  // Available seats, optional
  program: string | { id: string };  // Program can be an ObjectId or an object with an 'id' property
  application_deadline?: string; // Application deadline, optional
  demand_priority?: number;  // Priority based on demand, optional
}

export const updateSortingWeights = async () => {
  try {
    // Fetch admission programs from the 'admission_programs' collection
    const admissionPrograms:any = await payload.find({
      collection: 'admission_programs',
      depth: 1,
    });

    // Get the maximum available seats for calculating the seat weight
    const maxSeats = Math.max(
      ...admissionPrograms.docs.map((ap) => ap.available_seats ?? 0)
    );

    // Get the maximum days left for all programs for calculating the deadline weight
    const maxDays = Math.max(
      ...admissionPrograms.docs.map((ap) => {
        const isValidDate = (date: unknown): date is string => {
          return typeof date === 'string' && !isNaN(Date.parse(date));
        };

        // Calculate the days left until the application deadline
        const daysLeft = isValidDate(ap.application_deadline)
          ? (new Date(ap.application_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          : 0;

        // Return daysLeft, ensuring it's never negative
        return daysLeft > 0 ? daysLeft : 0;
      })
    );

    // Map over each admission program to calculate sorting weight
    const updates = admissionPrograms.docs.map(async (ap) => {
      // Extract the program ID if it's an object
      const programId = typeof ap.program === 'string' ? ap.program : ap.program.id;

      // Calculate seat weight
      const seatsWeight = (ap.available_seats || 0) / maxSeats;

      // Calculate deadline weight
      const daysLeft = ap.application_deadline
        ? (new Date(ap.application_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        : 0;
      const deadlineWeight = daysLeft > 0 ? 1 - daysLeft / maxDays : 1;

      // Calculate sorting weight based on seat weight, deadline weight, and demand priority
      const sortingWeight =
        seatsWeight * 0.4 + deadlineWeight * 0.3 + ((ap.demand_priority || 0) * 0.3);
console.log(seatsWeight,"----",daysLeft,"----",sortingWeight)
      // Update the program document with the new sorting weight
      await payload.update({
        collection: 'programs',
        id: programId, // Pass the correct program ID here
        data: { sorting_weight: sortingWeight },
      });
    });

    // Wait for all updates to finish
    console.log("Sorting weights update started...",maxSeats,maxDays);
    await Promise.all(updates);
    console.log("Sorting weights updated successfully!");

  } catch (error) {
    console.error("Error updating sorting weights:", error);
  }
};
