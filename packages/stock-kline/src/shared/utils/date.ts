export const daysToWorkingDays = (days: number) => {
  return Math.floor((days * 250) / 365);
};

export const workingDaysToDays = (workingDays: number) => {
  return (workingDays * 365) / 250;
};
