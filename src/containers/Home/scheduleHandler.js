import { List, Map } from "immutable";
import moment from 'moment'
import {
  formatFloat,
  calcScheduleAllHour,
  calcScheduleDayHour,
  calcWorkingHour,
  calcHourDiff,
  getCombinationByHumanRes
} from "../../utils/briefCalcUtils";

// 數字越大越優先
const LABEL_WEIGHT_MAP = {
  partTime: -1, // 兼職能上班
  timeOff: 3, // 正職特休
  includes: 2, // 正職有指定確定班表
  excludes: 2 // 正職有指定確定不要的班表
  // holiday: disable掉
};

class ScheduleHandler {
  constructor(fields) {
    // get holidays
    const { holidays = [], scheduleClassDefs = [], humanResDefs } = fields
    this._scheduleClassDefs = List(scheduleClassDefs).groupBy(x => x.name)
    this._holidayList = holidays.map(holiday => holiday.date);
    this._hourStore = this._calcDefaultTotalHours(fields);
    this._schedulePQ = this._calcSchedulePriorityQueue(fields);
    this._finishedScheduleMap = Map(); // Map({ [YYYY/MM/DD]: {...} })
    this._classesCombination = getCombinationByHumanRes(scheduleClassDefs, humanResDefs)
  }

  get classesCombination(){
    return this._classesCombination;
  }

  get hourStore(){
    return this._hourStore;
  }

  get holidayList() {
    return this._holidayList;
  }

  get finishedScheduleMap() {
    return this._finishedScheduleMap;
  }

  set finishedScheduleMap(map) {
    if(Map.isMap(map)){
      this._finishedScheduleMap = map
    }
  }

  get schedulePQ() {
    return this._schedulePQ;
  }

  set schedulePQ(list) {
    if(List.isList(list)){
      this._schedulePQ = list
    }
  }

  _calcDefaultTotalHours({ scheduleTimes = [], holidays = [], fullTimeRes = [], humanResDefs = [], partTimeRes = [] }){
    const scheduleDayCount =
      moment.duration(scheduleTimes[1].diff(scheduleTimes[0])).asDays() + 1; // include the start day
    const holidaysCount = holidays.length;

    // 計算正職員工時數
    const fullTimePeople = fullTimeRes.reduce(
      (sum, res, idx) => {
        const { name, timeOff = [] } = res;
        const timeOffCount = timeOff.length;
        const fullTimeHours = calcWorkingHour({
          timeOff: timeOffCount,
          holidays: holidaysCount,
          schedule: scheduleDayCount
        });
        const sumHours = sum.totalFullTime.defaultHours + fullTimeHours;
        return {
          ...sum,
          [name]: {
            title: `正職 ${name}`,
            defaultHours: fullTimeHours,
            currentHours: 0
          },
          totalFullTime: {
            ...sum.totalFullTime,
            defaultHours: sumHours,
            currentHours: 0
          }
        };
      },
      {
        totalFullTime: {
          title: '正職總時數',
          defaultHours: 0,
          currentHours: 0
        }
      }
    );
    // 兼職
    const partTimePeople = partTimeRes.reduce(
      (sum, res) => {
        const { name } = res
        return {
          ...sum,
          [`partTime/${name}`]: {
            title: `兼職 ${name}`,
            currentHours: 0
          }
        };
      },
      {}
    );

    // 計算排班時數
    const scheduleOneDayHours = calcScheduleDayHour({ humanResDefs });
    const scheduleHours = calcScheduleAllHour({
      dayHours: scheduleOneDayHours,
      schedules: scheduleDayCount,
      holidays: holidaysCount
    });

    return Map({
      ...fullTimePeople,
      ...partTimePeople,
      schedule: {
        title: "排班所需總時數",
        defaultHours: scheduleHours,
        currentHours: 0
      }
    })
  }

  _buildLabelObjByDate({ date, fullTimeRes, partTimeRes, scheduleClassDefs }) {
    const obj = {
      date,
      labels: List(),
      labelScore: 0,
      includes: List(),
      excludes: List(),
      prioritys: List(),
      availables: List(),
      timeOffs: List(),
      outputs: Map() // { peopleName: [A班] }
    };

    // 正職特休/確定要班表/確定不要班表
    fullTimeRes.map(fullTime => {
      const { name, timeOff = [], ...otherDate } = fullTime;
      timeOff.every(timeOffDay => {
        if (date.isSame(timeOffDay, "day")) {
          obj.timeOffs = obj.timeOffs.push(name)
          obj.labels = obj.labels.push("timeOff");
          obj.labelScore = obj.labelScore + 1 * LABEL_WEIGHT_MAP.timeOff;
          return false; // break
        }
      });

      if (otherDate[date.format("YYYY/MM/DD")] !== undefined) {
        const { includes = [], excludes = [], ...others } = otherDate[
          date.format("YYYY/MM/DD")
        ];
        // includes:
        if (includes.length !== 0) {
          obj.labelScore =
            obj.labelScore + includes.length * LABEL_WEIGHT_MAP.includes;
          obj.includes = obj.includes.push({ name, includes });
          obj.outputs = obj.outputs.set(name, List(includes.map(c => c.name)));
          // calc total include hours to update _hourStore
          const incHours = includes.reduce((sum, c) => {
            return sum + parseFloat(this._scheduleClassDefs.get(c.name).first({ hours: 0 }).hours);
          }, 0)
          this._hourStore = this._hourStore.setIn([name, 'currentHours'], incHours)
          obj.labels = obj.labels.push("includes");
        }
        // excludes:
        if (excludes.length !== 0) {
          obj.labelScore =
            obj.labelScore + excludes.length * LABEL_WEIGHT_MAP.excludes;
          obj.excludes = obj.excludes.push({ name, excludes });
          obj.labels = obj.labels.push("excludes");
        }
        // otherPriority:
        obj.prioritys = obj.prioritys.push({ name, ...others });
      }
    });

    // 兼職
    partTimeRes.map(partTime => {
      const { name, ...otherDate } = partTime;
      if (otherDate[date.format("YYYY/MM/DD")] !== undefined) {
        const { availables = [], ...others } = otherDate[
          date.format("YYYY/MM/DD")
        ];
        // availables:
        if (availables.length !== 0) {
          obj.labelScore = obj.labelScore + 1 * LABEL_WEIGHT_MAP.partTime;
          obj.availables = obj.availables.push({ name, availables });
        }
      }
    });

    return Map(obj);
  }

  _calcSchedulePriorityQueue(fields) {
    // 1. get all date obj and its special situation from fields
    const { holidays, scheduleTimes, fullTimeRes, partTimeRes, scheduleClassDefs } = fields;

    // 2. loop迴圈: dateStart --> dateEnd: 每個date檢查是否確定行程 + 做labels
    const currentDay = scheduleTimes[0].clone();
    const endDay = scheduleTimes[1];
    let pqList = List();
    while (currentDay.isBefore(endDay, "day")) {
      pqList = pqList.push(
        this._buildLabelObjByDate({
          date: currentDay.clone(),
          fullTimeRes,
          partTimeRes,
          holidays,
          scheduleClassDefs
        })
      );
      currentDay.add(1, "days");
    }

    // 3. 同labelScore的分在一組, ex. [{ date1 }, { date2 }]~
    // 4. sort --> labelScore越高 --> 越要先被考慮
    const groupsPQList = pqList.groupBy(dateObj => dateObj.get("labelScore"));

    // output: [[label score 第一名高{ date: '', holiday: {}, labels: [], labelScore: X, rawMessage: {...} }, {}, {}], [...]]
    return groupsPQList.toList().sortBy((f) => f.first().get('labelScore'));
  }
}

export default ScheduleHandler;
