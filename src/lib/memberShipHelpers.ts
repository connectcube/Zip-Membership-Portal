import { Timestamp } from 'firebase/firestore';

export const membershipServices = {
  calculateRemainingDays(startDate: Timestamp, endDate: Timestamp): number {
    // Convert Firebase Timestamps to JS Date
    const start = startDate.toDate();
    const end = endDate.toDate();

    // Difference in milliseconds
    const diffMs = end.getTime() - start.getTime();

    // Convert ms → days
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return diffDays;
  },
};
