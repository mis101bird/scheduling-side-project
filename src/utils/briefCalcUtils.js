import moment from 'moment'

export const formatFloat = (num, pos) => {
  const size = Math.pow(10, pos);
  return Math.round(num * size) / size;
}

export const calcWorkingHour = ({ timeOff = 0, holidays = 0, schedule = 0 }) => {
    return (schedule - holidays - timeOff)*8
}

export const calcHourDiff = ({ startTime, endTime }) => {
    if(!moment.utc(startTime, "HH:mm").isValid() || !moment.utc(endTime, "HH:mm").isValid()) return

    const duration = moment.duration(moment.utc(endTime, "HH:mm").diff(moment(moment.utc(startTime, "HH:mm"))));
    return Math.abs(duration.asHours())
}

export const calcScheduleDayHour = ({ humanResDefs = [] }) => {
    return humanResDefs.reduce((sum, def) => {
        const { startTime, endTime, humans = 0 } = def
        const hourDiff = calcHourDiff({ startTime, endTime }) || 0
        return sum + hourDiff*humans
    }, 0)
}

export const calcScheduleAllHour = ({ holidays = 0, schedules = 0, dayHours = 0 }) => {
    return (schedules - holidays)*dayHours
}