export const diffInDays = (startDate, endDate) => {
    let timeDiff = endDate.getTime() - startDate.getTime();
    return timeDiff / (1000 * 3600 * 24);
}

const addYears = ((currentDate, interval) => new Date(currentDate.setFullYear(currentDate.getFullYear() + interval)));
const addMonths = ((currentDate, interval) => new Date(currentDate.setMonth(currentDate.getMonth() + interval)));
const addDays = ((currentDate, interval) => new Date(currentDate.setDate(currentDate.getDate() + interval)));
const addHours = ((currentDate, interval) => new Date(currentDate.setHours(currentDate.getHours() + interval)));
const addMinutes = ((currentDate, interval) => new Date(currentDate.setMinutes(currentDate.getMinutes() + interval)));

const addFns = [
    { fn: addYears, interval: 1 }, //year
    { fn: addMonths, interval: 1 }, //month
    { fn: addDays, interval: 1 }, //day
    { fn: addHours, interval: 12 }, //12 hours
    { fn: addHours, interval: 1 }, //hour
    { fn: addMinutes, interval: 30 }, //half hour
    { fn: addMinutes, interval: 10 }, //10 minutes
];

export const getDateRange = ({ startDate, endDate, addFn, resolution, interval }) => {
    if (resolution) {
        let savedConfig = addFns[resolution];

        addFn = savedConfig.fn;
        interval = savedConfig.interval;
    }
    else {
        addFn = addFn || ((currentDate, interval) => new Date(currentDate.setDate(currentDate.getDate() + interval)));
        interval = interval || 1;
    }

    let retVal = [];
    let current = new Date(startDate);

    while (current <= endDate) {
        retVal.push(new Date(current));
        current = addFn(current, interval);
    }

    return retVal;
};