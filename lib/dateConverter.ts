export function convertDate(timestamp: number): string {
    const date = new Date(timestamp);
    const options = { day: '2-digit', month: 'short', year: 'numeric' } as const;
    const formattedDate = date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
    return formattedDate;
}
