import moment from "moment";

export function daysToArray(year, month) {
    const days = [];
    const lastDayOfMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();

    for (let i = 1; i <= lastDayOfMonth; i++) {
        days.push(i);
    }

    return days;
}
