export const validateSearchCriteria = (criteria: any) => {
  const errors: Record<string, string> = {};

  if (!criteria.origin) {
    errors.origin = 'Origin is required';
  }
  if (!criteria.destination) {
    errors.destination = 'Destination is required';
  }
  if (!criteria.departureDate) {
    errors.departureDate = 'Departure date is required';
  }
  if (criteria.passengers < 1) {
    errors.passengers = 'At least one passenger is required';
  }

  return errors;
};

export const validatePassengerDetails = (passengers: any[]) => {
  const errors: Record<string, string> = {};

  passengers.forEach((passenger, index) => {
    if (!passenger.firstName) {
      errors[`${index}-firstName`] = 'First name is required';
    }
    if (!passenger.lastName) {
      errors[`${index}-lastName`] = 'Last name is required';
    }
    if (!passenger.dateOfBirth) {
      errors[`${index}-dateOfBirth`] = 'Date of birth is required';
    }
    // Add more validations as needed
  });

  return errors;
};

// Add more validation functions for other steps
