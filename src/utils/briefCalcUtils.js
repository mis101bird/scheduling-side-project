import moment from "moment";
import { List, Map, is } from "immutable";

export const formatFloat = (num, pos) => {
  const size = Math.pow(10, pos);
  return Math.round(num * size) / size;
};

export const calcWorkingHour = ({
  timeOff = 0,
  holidays = 0,
  schedule = 0
}) => {
  return (schedule - holidays - timeOff) * 8;
};

export const calcHourDiff = ({ startTime, endTime }) => {
  if (
    !moment.utc(startTime, "HH:mm").isValid() ||
    !moment.utc(endTime, "HH:mm").isValid()
  )
    return;

  const duration = moment.duration(
    moment.utc(endTime, "HH:mm").diff(moment(moment.utc(startTime, "HH:mm")))
  );
  return Math.abs(duration.asHours());
};

export const calcScheduleDayHour = ({ humanResDefs = [] }) => {
  return humanResDefs.reduce((sum, def) => {
    const { startTime, endTime, humans = 0 } = def;
    const hourDiff = calcHourDiff({ startTime, endTime }) || 0;
    return sum + hourDiff * humans;
  }, 0);
};

export const calcScheduleAllHour = ({
  holidays = 0,
  schedules = 0,
  dayHours = 0
}) => {
  return (schedules - holidays) * dayHours;
};

// 輸出所有無序組合！
const getCombination = ({
  lessLabels,
  tempArray = List([]),
  resultArray,
  scheduleClassDefs
}) => {
  if (lessLabels.size === 0) {
    // repeated array
    let alreadyRepeat = false;
    _.forEach(resultArray, array => {
      if (is(tempArray.toSet(), array.toSet())) {
        alreadyRepeat = true;
        return false;
      }
    });

    if (!alreadyRepeat) {
      resultArray.push(tempArray);
    }
  } else {
    scheduleClassDefs.map(def => {
      if (lessLabels.isSuperset(def.humanResDef)) {
        const defLabel = [...def.humanResDef];
        // remove def labels
        const newLessLabels = lessLabels.filter(label => {
          const index = defLabel.indexOf(label);
          if (index !== -1) {
            defLabel.splice(index, 1);
            return false;
          } else {
            return true; // return value
          }
        });
        const newTempArray = tempArray.push(def.name);
        return getCombination({
          tempArray: newTempArray,
          lessLabels: newLessLabels,
          resultArray,
          scheduleClassDefs
        });
      }
    });
  }
};

const getResultSet = ({ resultList }) => {
    return (resultList.map((item) => List(item.result).toSet())).toSet()
}

/**
 * @param {List} combination the schedule combination we will calc to group
 * @param {array} resultArray the resultArray
 * @param {Map} scheduleClassMap Map({ 'A班': { hours, ... }, 'B班': { ... } })
 * @param {List} humanResArray 正職人力List，放label隨過程會扣掉, 內有Result List([{ name: '', result: [], labels: ['早', '中', '晚'] }, {...}])
 * @param {TEMP integer} tempHumanIdx 目前輪那哪個 humanRes array 選班表
 */
const getFullTimeGroup = ({ tempHumanIdx = 0, resultArray, humanResArray, scheduleClassMap, combination, humanResArray }) => {
    // 停止條件
    // ================================ old tempHumanIdx = last time human idx
    if(combination.size === 0){
        // check repeated array
        let alreadyRepeat = false;
        _.forEach(resultArray, resultList => {
        const resultSet = getResultSet({ resultList })
        const humanSet = getResultSet({ resultList: humanResArray })
        if (is(resultSet, humanSet) {
            console.log('repeated')
            alreadyRepeat = true;
            return false;
        }
        });

        if (!alreadyRepeat) {
        resultArray.push(humanResArray);
        }
    } else {
        let hasPeople = false
        humanResArray.forEach((obj) => {
            if(obj.labels.length > 0){
                hasPeople = true;
                return false;
            }
        })

        if(!hasPeople){
            return // discard this branch
        }
    }

    // get active new tempHumanIdx
    // ================================ new tempHumanIdx = currentHumanIdx
    let currentHumanIdx = tempHumanIdx + 1;
    while(true){
        const currentHuman = humanResArray.get(tempHumanIdx%humanResArray.size)
        if(currentHuman.length === 0){
            currentHumanIdx++;
        }else{
            break
        }
    }

    const humanResIndex = currentHumanIdx%humanResArray.size
    combination.map((scheduleClassName) => {
        const scheduleClass = scheduleClassMap.get(scheduleClassName);
        // 該human可以上的班
        if (combination.isSuperset(scheduleClass.humanResDef)) {
            // 1. currentHuman.labels - class.label
            // 2. currenthuman.result.push(class)
            const classLabel = [...scheduleClass.humanResDef];
            const { labels: humanLabel, result: humanResult } = humanResArray.get(humanResIndex)
            // remove classLabel's labels
            const newHumanLabel = humanLabel.filter(label => {
              const index = classLabel.indexOf(label);
              if (index !== -1) {
                classLabel.splice(index, 1);
                return false;
              } else {
                return true; // return value
              }
            });
            const newHumanResilt = [...humanResult, scheduleClassName]
            const newHumanResArray = [
                humanResArray.slice(0, humanResIndex),
                { name: '', labels: newHumanLabel, result: newHumanResilt },
                humanResArray.slice(humanResIndex + 1)
            ];

            // 3. newCombination = remove class.name
            const classIndex = combination.findIndex(name => name === scheduleClassName);
            const newCombination = combination.delete(classIndex);

            const newTempArray = tempArray.push(def.name);
            return getFullTimeGroup({
                tempHumanIdx = 0, 
                resultArray,
                scheduleClassMap, 
                combination: newCombination, 
                humanResArray: newHumanResArray
            });
        }
    })    
}

export const getCombinationByHumanRes = (scheduleClassDefs, humanResDefs) => {
  const lessLabels = humanResDefs.reduce((sum, def) => {
    let newArray = sum;
    let i = 0;
    for (i; i < def.humans; i++) {
      newArray.push(def.name);
    }
    return newArray;
  }, []); // ["早", "午", "午", "晚", ...]
  const resultArray = [];
  getCombination({
    tempHumanIdx: currentHumanIdx,
    lessLabels: List(lessLabels),
    scheduleClassDefs: List(scheduleClassDefs),
    resultArray
  });
  return List(resultArray);
};

/**
 * 
 * @param {*} scheduleClassDefsMap Map({ 'A班': { hours, ... }, 'B班': { ... } })
 * @param {*} fullTimeCount 要計算的正職人數
 * @param {*} humanResDefs 日分配人力定義，來自fields
 * @param {*} combinationList List([['A', 'B, ...'], ['A', 'B, ...'], ['A', 'B, ...']])
 * @param {array} partTimeList (要先整理過，重複 日標籤 不能放一起) 有兼職時需要 "已確定能上的班" ex. [{ name, '小明', result: ['A'], labels: [] }]
 * Output: { '組合1': [[[A, B], [C, A]], [[D, B], [B, A]], ...] }
 */
export const getGroupByHumanCount = (scheduleClassDefsMap, humanResDefs, fullTimeCount, combinationList, partTimeList = List([])) => {
      // humanResArray: [{ name: '', result: [], labels: ['早', '中', '晚'] }, {...}]
      const humanResItem = humanResDefs.reduce((sum, def) => {
        return {
            ...sum,
            labels: [...sum.labels, def.name]
        }
      }, { name: '' result: [], labels: [] });
      const humanResArray = new Array(fullTimeCount);
      humanResArray.fill(humanResItem);
    
    // 扣掉partTime選的class
    const newCombinationList = combinationList.reduce((newList, combination) => {
        let skipThis = false
        let newCombination = combination
        if(partTimeList.size !== 0){
            partTimeList.forEach((partTime) => {
                // if 有 班 --> 扣掉該班
                if(newCombination.isSuperset(partTime.result)){
                    const partTimeLabel = partTime.result
                    newCombination = newCombination.filter(label => {
                        const index = partTimeLabel.indexOf(label);
                        if (index !== -1) {
                            partTimeLabel.splice(index, 1);
                          return false;
                        } else {
                          return true; // return value
                        }
                      });
                }else{
                    // 沒 班 --> remove no partTime班的組合
                    skipThis = true;
                    return false;
                }
            })
        }

        if(skipThis){
            return newList
        }else{
            return newList.push(newCombination)
        }
    }, List([]))

    const finalCominationGroupList = combinationList.map((combination) => {
        const resultArray = [];
        getFullTimeGroup({
        combination: List(combination),
        scheduleClassMap: scheduleClassDefsMap,
        resultArray,
        humanResArray: List(humanResArray)
        });
        return List(resultArray);
    })

    return finalCominationGroupList;
  };
