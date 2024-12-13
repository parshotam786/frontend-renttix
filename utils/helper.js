export function countDaysBetweenDates(startDate, endDate) {
  // Convert the start and end dates to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the difference in time between the two dates
  const diffTime = Math.abs(end - start);

  // Convert the difference in time to days
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}
