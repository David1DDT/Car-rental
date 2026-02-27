export const daysBetween = (date1: Date, date2: Date): number => {

    const diffMs = date2.getTime() - date1.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    return diffDays
}