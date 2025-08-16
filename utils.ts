export function getMonthStringFromDate(date: Date) {
    return date.toISOString().slice(0, 7)
}

export function getDateFromMonthString(dateStr: string) {
    return new Date(dateStr + "-01")
}