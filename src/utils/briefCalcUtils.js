import moment from 'moment'

export const calcWorkingHour = ({ timeOff = 0, holidays = 0, schedule = 0 }) => {
    return (schedule - holidays - timeOff)*8
}

export const calcScheduleDayHour = ({ humanResDefs = [] }) => {
    return humanResDefs.reduce((sum, def) => {
        const { startTime, endTime, humans = 0 } = def
        const duration = moment.duration(moment.utc(endTime, "HH:mm").diff(moment(moment.utc(startTime, "HH:mm"))));
        return sum + Math.abs(duration.asHours())*humans
    }, 0)
}

export const calcScheduleAllHour = ({ holidays = 0, schedules = 0, dayHours = 0 }) => {
    return (schedules - holidays)*dayHours
}