export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateTrip(data: {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  estimatedBudget: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = 'Trip name is required';
  }

  if (!data.destination.trim()) {
    errors.destination = 'Destination is required';
  }

  if (!data.startDate) {
    errors.startDate = 'Start date is required';
  }

  if (!data.endDate) {
    errors.endDate = 'End date is required';
  }

  if (data.startDate && data.endDate && data.endDate < data.startDate) {
    errors.endDate = 'End date must be on or after start date';
  }

  const budget = parseFloat(data.estimatedBudget);
  if (data.estimatedBudget === '' || isNaN(budget) || budget < 0) {
    errors.estimatedBudget = 'Enter a valid budget amount';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateItinerary(data: {
  date: string;
  activityName: string;
  time: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.date) {
    errors.date = 'Date is required';
  }

  if (!data.activityName.trim()) {
    errors.activityName = 'Activity name is required';
  }

  if (!data.time) {
    errors.time = 'Time is required';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validatePackingItem(name: string): ValidationResult {
  const errors: Record<string, string> = {};

  if (!name.trim()) {
    errors.name = 'Item name is required';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateExpense(data: {
  description: string;
  amount: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.description.trim()) {
    errors.description = 'Description is required';
  }

  const amount = parseFloat(data.amount);
  if (data.amount === '' || isNaN(amount) || amount <= 0) {
    errors.amount = 'Enter a valid amount greater than 0';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
