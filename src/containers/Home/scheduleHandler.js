import { List, Map } from "immutable";

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
    const { holidays = [] } = fields
    this._holidayList = holidays.map(holiday => holiday.date);
    this._schedulePQ = this._calcSchedulePriorityQueue(fields);
  }

  get holidayList() {
    return this._holidayList;
  }

  get schedulePQ() {
    return this._schedulePQ;
  }

  _buildLabelObjByDate({ date, fullTimeRes, partTimeRes }) {
    const obj = {
      date,
      labels: List(),
      labelScore: 0,
      includes: List(),
      excludes: List(),
      prioritys: List(),
      availables: List(),
      timeOffs: List()
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
    const { holidays, scheduleTimes, fullTimeRes, partTimeRes } = fields;

    // 2. loop迴圈: dateStart --> dateEnd: 每個date檢查是否確定行程 + 做labels
    const currentDay = scheduleTimes[0].clone();
    const endDay = scheduleTimes[1];
    let pqList = List();
    while (currentDay.isBefore(endDay, "day")) {
      pqList = pqList.push(
        this._buildLabelObjByDate({
          date: currentDay,
          fullTimeRes,
          partTimeRes,
          holidays
        })
      );
      currentDay.add(1, "days");
    }

    // 3. 同labelScore的分在一組, ex. [{ date1 }, { date2 }]~
    // 4. sort --> labelScore越高 --> 越要先被考慮
    const groupsPQList = pqList.groupBy(dateObj => dateObj.get("labelScore"));

    // output: [[label score 第一名高{ date: '', holiday: {}, labels: [], labelScore: X, rawMessage: {...} }, {}, {}], [...]]
    return groupsPQList.toList();
  }
}

export default ScheduleHandler;
