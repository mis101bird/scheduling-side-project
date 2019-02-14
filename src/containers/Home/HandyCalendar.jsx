import React from "react";
import {
  Modal,
  Button,
  Card,
  Calendar,
  Icon,
  Row,
  Col,
  Select,
  List,
  Badge,
  Spin
} from "antd";
import {
  formatFloat,
  calcScheduleAllHour,
  calcScheduleDayHour,
  calcWorkingHour,
  calcHourDiff
} from "../../utils/briefCalcUtils";
import { connect } from "react-redux";
import _get from "lodash/get";
import { List as _List, Map } from "immutable";
import _findIndex from "lodash/findIndex";
import moment from "moment";
import "./HandyCalendar.less";

// 一個date設定完 --> 更新 --> 將activeDateMap內的該dateObj放到finishMap (交換)
class HandyCalendar extends React.Component {
  constructor(props) {
    super(props);
    const { fields: { scheduleTimes = [] } = {}, scheduleHandler } = props;

    const activeDateList = scheduleHandler.schedulePQ.last();
    this.state = {
      briefCalc: undefined,
      activeDateMap: activeDateList.groupBy(obj => obj.get("date").format('YYYY/MM/DD')),
      currentDate: scheduleTimes.length === 0 ? moment() : scheduleTimes[0]
    };
    // remove the last array
    scheduleHandler.schedulePQ = scheduleHandler.schedulePQ.pop();

    this.calcHumanResource = this.calcHumanResource.bind(this);
    this.calcDateCellRender = this.calcDateCellRender.bind(this);
    this.calcNewActiveDateMap = this.calcNewActiveDateMap.bind(this);
  }

  calcNewActiveDateMap() {
    const { scheduleHandler } = this.props;
    const activeDateList = scheduleHandler.schedulePQ.last();

    if(!_List.isList(activeDateList)) return Map();
    scheduleHandler.schedulePQ = scheduleHandler.schedulePQ.pop();
    return activeDateList.groupBy(obj => obj.get("date").format('YYYY/MM/DD'));
  }

  calcHumanResource() {
    const {
      fullTimeRes,
      holidays,
      scheduleTimes,
      humanResDefs
    } = this.props.fields;

    if (
      fullTimeRes.length === 0 ||
      scheduleTimes.length !== 2 ||
      humanResDefs.length === 0
    )
      return;

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
        const sumHours = sum.totalFullTimeHours.hours + fullTimeHours;
        return {
          ...sum,
          [`fullTimeHours[${idx}]`]: {
            hours: fullTimeHours,
            title: `[正職員工] ${name}的時數`,
            description: `${fullTimeHours} 小時 ((排班日 - 特休日) X 8h)`
          },
          totalFullTimeHours: {
            ...sum.totalFullTimeHours,
            hours: sumHours,
            description: `${sumHours} 小時 (所有正職員工時數加總)`
          }
        };
      },
      {
        totalFullTimeHours: {
          title: "[正職員工] 總時數",
          description: "無設定正職員工",
          hours: 0
        }
      }
    );

    // 計算排班時數
    const scheduleOneDayHours = calcScheduleDayHour({ humanResDefs });
    const scheduleHours = calcScheduleAllHour({
      dayHours: scheduleOneDayHours,
      schedules: scheduleDayCount,
      holidays: holidaysCount
    });

    this.setState({
      briefCalc: {
        ...fullTimePeople,
        scheduleHours: {
          title: "[排班] 總時數",
          description: `${scheduleHours} 小時 (根據每日人力分配 X 需上班天數)`,
          hours: scheduleHours
        }
      }
    });
  }

  calcDateCellRender(date) {
    const { scheduleHandler } = this.props;
    const { activeDateMap } = this.state;
    const finishedScheduleMap = scheduleHandler.finishedScheduleMap;

    if (scheduleHandler) {
      const holidayList = scheduleHandler.holidayList;
      const schedulePQ = scheduleHandler.schedulePQ;

      // if is holiday
      const index = _findIndex(holidayList, holiday => {
        return date.isSame(holiday, "day");
      });
      if (index !== -1) {
        return (
          <div className="dateWrapper">
            <Icon type="car" style={{ fontSize: "30px" }} theme="twoTone" />
            <div>診所放假</div>
          </div>
        );
      }
      
      // check date是否在activeDateMap { [date]: {...} } --> 有：轉轉轉花
      // check outputs (Map) 是否有東西了 --> 有：Badge
      if (activeDateMap.has(date.format('YYYY/MM/DD'))) {
        console.log(date.format('YYYY/MM/DD'))
        const dateObj = activeDateMap.get(date.format('YYYY/MM/DD')).first();
        const outputs = dateObj.get("outputs");
        console.log(outputs)
        return (
          <div className="dateWrapper">
            <Spin size="large" style={{ margin: '3px 0 10px 3px' }} />
            {outputs.size > 0 && outputs.map((classArray, key, idx) => (
              <Badge
                key={idx}
                status="processing"
                text={`${key}: ${classArray.join(", ")}`}
              />
            )).toList()}
          </div>
        );
      }
      
      // date是否在finishedMap { [date]: {...} }
      // check outputs (Map) 是否有東西了 --> 有：Badge
      if (finishedScheduleMap.has(date.format('YYYY/MM/DD'))) {
        const dateObj = finishedScheduleMap.get(date.format('YYYY/MM/DD')).first();
        const outputs = dateObj.get("outputs");
        return (
          <div className="dateWrapper">
            {outputs.size > 0 && outputs.map((classArray, key, idx) => (
              <Badge key={idx} status="error" text={`${key}: ${classArray.join(", ")}`} />
            )).toList()}
          </div>
        );
      }
    }
  }

  componentWillMount() {
    this.calcHumanResource();
  }

  render() {
    const {
      fields: { scheduleTimes = [], humanResDefs = [], scheduleClassDefs = [] },
      scheduleHandler
    } = this.props;
    const currentDateString = this.state.currentDate.format("YYYY/MM/DD");
    return (
      <Row type="flex" className="handy-calendar">
        <Button onClick={() => {
          this.setState({ activeDateMap: this.calcNewActiveDateMap() })
        }}>下一檔</Button>
        <div
          style={{
            width: "100%",
            border: "1px solid #d9d9d9",
            borderRadius: 4,
            marginBottom: 24
          }}
        >
          <Calendar
            dateCellRender={this.calcDateCellRender}
            onPanelChange={value => this.setState({ currentDate: value })}
            onSelect={value => this.setState({ currentDate: value })}
            value={this.state.currentDate}
            disabledDate={currentDate => {
              if (scheduleTimes.length === 0) return true;

              if (
                scheduleHandler &&
                Array.isArray(scheduleHandler.holidayList)
              ) {
                const index = _findIndex(
                  scheduleHandler.holidayList,
                  holiday => {
                    return currentDate.isSame(holiday, "day");
                  }
                );

                if (index !== -1) {
                  return true;
                }
              }

              return (
                currentDate.isBefore(scheduleTimes[0]) ||
                currentDate.isAfter(scheduleTimes[1])
              );
            }}
          />
        </div>
        <Col span={20}>
          <Card
            type="inner"
            title="排班挑選"
            style={{ marginTop: 0, marginLeft: 0, height: "100%" }}
          >
            Hello
          </Card>
        </Col>
        <Col span={4}>
          <List
            span={4}
            bordered
            dataSource={Object.keys(this.state.briefCalc).map(key => ({
              key,
              ...this.state.briefCalc[key]
            }))}
            renderItem={(item, idx) => (
              <List.Item>
                <List.Item.Meta
                  title={`[${idx + 1}] ${item.title}`}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { fields = {} } = state.home;
  return {
    fields
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

const mergeProps = (propsFromState, propsFromDispatch, ownProps) => {
  return {
    ...propsFromState,
    ...propsFromDispatch,
    ...ownProps
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(HandyCalendar);
