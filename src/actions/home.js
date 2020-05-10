import * as ActionTypes from '../constants/actionTypes'
import moment from 'moment'

function fetchHolidayAPI() {
   return fetch('http://140.121.102.153:1880/holidays').then(result => result.json());
}


export const changeScheduleFields = (payload) => (dispatch) => {
  dispatch({ type: ActionTypes.CHANGE_SCHEDULE_FIELDS, payload })
}

export const changeSchedulePeriodAndHolidaySelect = (periods) => {
    return (dispatch) => {
      return fetchHolidayAPI().then(({ result }) => {
        const holidays = result.records
        const filteredHolidays = holidays.filter(day => {
            return moment(day.date).isBetween(periods[0], periods[1], '[]') && day.isHoliday === '是'
        }).map(day => {
            return { ...day, date: moment(day.date) }
        })

        return dispatch(changeScheduleFields({
            holidays: filteredHolidays,
            scheduleTimes: periods
        }))
      });
    };
}

