export const diffInDays = (startDate, endDate) => {
    let timeDiff = endDate.getTime() - startDate.getTime();
    return timeDiff / (1000 * 3600 * 24);
}

export const getDateRange = ({ startDate, endDate, addFn, interval }) => {
    addFn = addFn || ((currentDate, interval) => new Date(currentDate.setDate(currentDate.getDate() + interval)));
    interval = interval || 1;

    let retVal = [];
    let current = new Date(startDate);

    while (current <= endDate) {
        retVal.push(new Date(current));
        current = addFn(current, interval);
    }

    return retVal;
};