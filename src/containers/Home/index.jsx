import React from "react";
import { connect } from "react-redux";
import {
  Card,
  Layout,
  Button,
  DatePicker,
  Form,
  List,
  Icon,
  Row,
  Input,
  Tag,
  Select,
  Alert
} from "antd";
import iconReact from "../../assets/react.svg";
import iconRedux from "../../assets/redux.png";
import iconAntd from "../../assets/antd.png";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./index.less";
import moment from "moment";
import {
  calcScheduleAllHour,
  calcScheduleDayHour,
  calcWorkingHour
} from "../../utils/briefCalcUtils";
import {
  changeScheduleFields,
  changeSchedulePeriodAndHolidaySelect
} from "../../actions/home";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Content } = Layout;

const scheduleItems = [{ name: "A" }, { name: "B" }];

const HolidayList = ({
  holidays,
  deleteSaturdayHoliday,
  deleteSundayHoliday,
  deleteHoliday
}) => (
  <div>
    <Row type="flex">
      <Button style={{ marginRight: "10px" }} onClick={deleteSaturdayHoliday}>
        星期六要上班
      </Button>
      <Button onClick={deleteSundayHoliday}>星期天要上班</Button>
    </Row>
    <List
      itemLayout="horizontal"
      dataSource={holidays}
      renderItem={(holiday, index) => {
        const { date, name, holidayCategory, description } = holiday;
        let categoryIcon = "";
        if (holidayCategory === "星期六、星期日") {
          categoryIcon = (
            <Icon
              type="check-square"
              style={{ fontSize: "20px" }}
              theme="twoTone"
            />
          );
        } else if (holidayCategory === "調整放假日") {
          categoryIcon = (
            <Icon
              type="notification"
              style={{ fontSize: "20px" }}
              theme="twoTone"
              twoToneColor="#eb2f96"
            />
          );
        } else {
          categoryIcon = (
            <Icon
              type="smile"
              style={{ fontSize: "20px" }}
              theme="twoTone"
              twoToneColor="#52c41a"
            />
          );
        }

        return (
          <List.Item
            key={index}
            actions={[<a onClick={deleteHoliday(index)}>刪除</a>]}
          >
            <List.Item.Meta
              avatar={categoryIcon}
              title={`[${date.format(
                "dddd, YYYY/MM/DD"
              )}]${name} (${holidayCategory})`}
              description={description}
            />
          </List.Item>
        );
      }}
    />
  </div>
);

const FullTimeResItem = ({
  name,
  schedulePrefers,
  timeOff = [],
  scheduleTimes = [],
  changeFullTimeRes,
  deleteFullTimeRes
}) => (
  <Row
    type="flex"
    align="middle"
    justify="space-between"
    style={{ flexWrap: "nowrap", marginBottom: "5px" }}
  >
    <Input
      addonBefore="姓名"
      placeholder="e.g. 林小明"
      style={{ width: "220px", marginRight: "10px" }}
      value={name}
      onChange={e => changeFullTimeRes({ name: e.target.value })}
    />
    <div className="fullTimeFlex">
      <div style={{ minWidth: "60px" }}>特休時間</div>
      <DatePicker
        style={{ marginLeft: "5px", minWidth: "165px", flex: 1 }}
        format="YYYY/MM/DD"
        value={null}
        onChange={value => {
          if(scheduleTimes.length > 0 && moment(value).isBetween(scheduleTimes[0], scheduleTimes[1], '[]')){
            changeFullTimeRes({ timeOff: [...timeOff, value] })
          }
        }}
      />
      <Row type="flex" style={{ marginLeft: "8px" }}>
        {timeOff.length > 0 &&
          timeOff.map(day => (
            <Tag color="geekblue" size="big" style={{ marginBottom: "4px" }}>
              {day.format("YYYY/MM/DD")}
            </Tag>
          ))}
      </Row>
    </div>
    <div className="fullTimeFlex">
      排班偏好排序
      <Select
        mode="multiple"
        placeholder="左(高) --> 右(低)"
        onChange={value => changeFullTimeRes({ schedulePrefers: value })}
        value={schedulePrefers}
        style={{ flex: 1, margin: "0 12px 0 5px" }}
      >
        {scheduleItems.map(schedule => (
          <Option key={schedule.name}>{schedule.name}</Option>
        ))}
      </Select>
    </div>
    <Icon
      type="delete"
      theme="filled"
      style={{ fontSize: "20px" }}
      onClick={deleteFullTimeRes}
    />
  </Row>
);

const HumanResourceDefineItem = ({
  name,
  humans,
  startTime,
  endTime,
  changeHumanResDef,
  deleteHumanResDef
}) => (
  <Row
    type="flex"
    align="middle"
    justify="space-between"
    style={{ flexWrap: "nowrap", marginBottom: "5px" }}
  >
    <Input
      addonBefore="名稱"
      placeholder="e.g. 早"
      style={{ flex: 1, marginRight: "5px" }}
      value={name}
      onChange={e => changeHumanResDef({ name: e.target.value })}
    />
    <Input.Group compact style={{ width: 319, marginRight: "5px" }}>
      <Input
        style={{
          width: 79,
          textAlign: "center",
          pointerEvents: "none",
          color: "black"
        }}
        value="定義時間"
        disabled
      />
      <Input
        style={{ width: 100, textAlign: "center" }}
        placeholder="8:00"
        value={startTime}
        onChange={e => changeHumanResDef({ startTime: e.target.value })}
      />
      <Input
        style={{
          width: 40,
          borderLeft: 0,
          textAlign: "center",
          pointerEvents: "none",
          backgroundColor: "#fff"
        }}
        placeholder="~"
        disabled
      />
      <Input
        style={{ width: 100, borderLeft: 0, textAlign: "center" }}
        placeholder="18:00"
        value={endTime}
        onChange={e => changeHumanResDef({ endTime: e.target.value })}
      />
    </Input.Group>
    <Input
      style={{ flex: 1, marginRight: "12px" }}
      addonBefore="需求人力數"
      placeholder="e.g. 2"
      addonAfter="人"
      value={humans}
      onChange={e => changeHumanResDef({ humans: e.target.value })}
    />
    <Icon
      type="delete"
      theme="filled"
      style={{ fontSize: "20px" }}
      onClick={deleteHumanResDef}
    />
  </Row>
);

const BriefCalcAlert  = ({ scheduleHours = {}, totalFullTimeHours = {}, ...singleFullTimes }) => {
  const { hours: schedules = 0 } = scheduleHours
  const { hours: fulltimes = 0 } = totalFullTimeHours
  const diffDays = (schedules - fulltimes) / 8  // 1天工作8h

  // calc working average hours
  const sumHours = Object.keys(singleFullTimes).reduce((sum, key) => {
    const { hours = 0 } = singleFullTimes[key]
    return sum + hours
  }, 0);
  const averageWorkingHours = sumHours / Object.keys(singleFullTimes).length

  if(diffDays < -2){
    return (
      <Alert
      style={{ marginTop: '12px' }}
      message="哇！粗估後，人力可能過剩！預期精確計算後，部分正職員工會無法做滿時數"
      description={`排班時數(${schedules}) - 正職總時數(${fulltimes}) = ${schedules - fulltimes}h`}
      type="warning"
      showIcon
    />)
  } else if(diffDays < 1.5){
    return (
      <Alert
      style={{ marginTop: '12px' }}
      message="排班時數和正職總時數接近！可能喬一喬，不需要找兼職就能應付排班了！"
      description={`排班時數(${schedules}) - 正職總時數(${fulltimes}) = ${schedules - fulltimes}h (大約${diffDays}日)`}
      type="success"
      showIcon
    />)
  } else if((schedules - fulltimes) - averageWorkingHours > 0){
    return (
      <Alert
      style={{ marginTop: '12px' }}
      message="排班時數多出正職總時數太多！多到甚至能多請一個正職了！"
      description={`排班時數(${schedules}) - 正職總時數(${fulltimes}) = ${schedules - fulltimes}h`}
      type="error"
      showIcon
    />)
} else {
    const diffRoundDays = diffDays > 1 ? Math.round(diffDays) : diffDays;
    return (
      <Alert
      style={{ marginTop: '12px' }}
      message="可能需要找兼職，才能符合排班時數需求唷！"
      description={`排班時數(${schedules}) - 正職總時數(${fulltimes}) = ${schedules - fulltimes}h (大約${diffRoundDays}日)`}
      type="info"
      showIcon
    />
    )
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      briefCalc: undefined
    };

    this.deleteSundayHoliday = this.deleteSundayHoliday.bind(this);
    this.deleteSaturdayHoliday = this.deleteSaturdayHoliday.bind(this);
    this.calcBriefResource = this.calcBriefResource.bind(this);
  }

  deleteSundayHoliday() {
    const filteredHoliday = this.props.fields.holidays.filter(day => {
      const { date, name, holidayCategory, description } = day;
      return !(date.weekday() === 0 && holidayCategory === "星期六、星期日");
    });
    this.props.changeFields({
      holidays: filteredHoliday
    });
  }

  deleteSaturdayHoliday() {
    const filteredHoliday = this.props.fields.holidays.filter(day => {
      const { date, name, holidayCategory, description } = day;
      return !(date.weekday() === 6 && holidayCategory === "星期六、星期日");
    });
    this.props.changeFields({
      holidays: filteredHoliday
    });
  }

  calcBriefResource(e) {
    e.preventDefault();
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

    const scheduleDayCount = moment
      .duration(scheduleTimes[1].diff(scheduleTimes[0]))
      .asDays() + 1; // include the start day
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

  render() {
    const {
      holidays,
      humanResDefs,
      fullTimeRes,
      scheduleTimes
    } = this.props.fields;
    return (
      <Layout className="home-page">
        <AppHeader />
        <Content>
          <Card title="歡迎使用排班系統！(若要保存排班設定，請登入)">
            <Card type="inner" title="排班設定">
              <Form.Item
                label="時間範圍"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <RangePicker
                  format="YYYY/MM/DD"
                  value={scheduleTimes}
                  onChange={momentTimes =>
                    this.props.changePeriodAndHoliday(momentTimes)
                  }
                />
              </Form.Item>
              <Form.Item
                label="診所休假"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 18 }}
              >
                {holidays.length > 0 && (
                  <HolidayList
                    holidays={holidays}
                    deleteSaturdayHoliday={this.deleteSaturdayHoliday}
                    deleteSundayHoliday={this.deleteSundayHoliday}
                    deleteHoliday={this.props.deleteHoliday}
                  />
                )}
              </Form.Item>
              <Form.Item
                label={
                  <div className="label">
                    日人力分配
                    <Icon
                      type="plus-circle"
                      style={{ fontSize: "20px", marginLeft: "10px" }}
                      onClick={this.props.addHumanResDef}
                    />
                  </div>
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 16 }}
              >
                {humanResDefs.length > 0 &&
                  humanResDefs.map((def, idx) => {
                    const defProps = {
                      ...def,
                      changeHumanResDef: this.props.changeHumanResDef(idx),
                      deleteHumanResDef: this.props.deleteHumanResDef(idx)
                    };
                    return <HumanResourceDefineItem key={idx} {...defProps} />;
                  })}
              </Form.Item>
            </Card>
            <Card type="inner" title="正職設定">
              <Form.Item
                label={
                  <div className="label">
                    員工
                    <Icon
                      type="plus-circle"
                      style={{ fontSize: "20px", marginLeft: "10px" }}
                      onClick={this.props.addFullTimeRes}
                    />
                  </div>
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                {fullTimeRes.length > 0 &&
                  fullTimeRes.map((res, idx) => {
                    const resProps = {
                      ...res,
                      scheduleTimes,
                      changeFullTimeRes: this.props.changeFullTimeRes(idx),
                      deleteFullTimeRes: this.props.deleteFullTimeRes(idx)
                    };
                    return <FullTimeResItem key={idx} {...resProps} />;
                  })}
              </Form.Item>
            </Card>
            <Card
              type="inner"
              title={
                <div>
                  淺計算
                  <Button
                    type="primary"
                    style={{ marginLeft: "10px" }}
                    onClick={this.calcBriefResource}
                  >
                    開始
                  </Button>
                </div>
              }
            >
              {this.state.briefCalc ? (
                <div>
                <List
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
                <BriefCalcAlert {...this.state.briefCalc} />
                </div>
              ) : (
                "粗略計算...1. 班表總時數, 2. 各正職員工時數, 3. 正職員工總時數"
              )}
            </Card>
          </Card>
        </Content>
        <AppFooter />
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  const { fields = {} } = state.home;
  return {
    fields
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
  changeFields: formFieldsChange =>
    dispatch(changeScheduleFields(formFieldsChange)),
  changePeriodAndHoliday: periods =>
    dispatch(changeSchedulePeriodAndHolidaySelect(periods))
});

const mergeProps = (propsFromState, propsFromDispatch, ownProps) => {
  const { fields } = propsFromState;
  const { dispatch } = propsFromDispatch;
  return {
    ...propsFromState,
    ...propsFromDispatch,
    ...ownProps,
    deleteHoliday: index => () =>
      dispatch(
        changeScheduleFields({
          holidays: [
            ...fields.holidays.slice(0, index),
            ...fields.holidays.slice(index + 1)
          ]
        })
      ),
    changeHumanResDef: index => payload => {
      const newObj = {
        ...fields.humanResDefs[index],
        ...payload
      };
      return dispatch(
        changeScheduleFields({
          humanResDefs: [
            ...fields.humanResDefs.slice(0, index),
            newObj,
            ...fields.humanResDefs.slice(index + 1)
          ]
        })
      );
    },
    addHumanResDef: () => {
      return dispatch(
        changeScheduleFields({
          humanResDefs: [
            ...fields.humanResDefs,
            { name: "", startTime: "", endTime: "", humans: "" }
          ]
        })
      );
    },
    deleteHumanResDef: index => () => {
      return dispatch(
        changeScheduleFields({
          humanResDefs: [
            ...fields.humanResDefs.slice(0, index),
            ...fields.humanResDefs.slice(index + 1)
          ]
        })
      );
    },
    changeFullTimeRes: index => payload => {
      const newObj = {
        ...fields.fullTimeRes[index],
        ...payload
      };
      return dispatch(
        changeScheduleFields({
          fullTimeRes: [
            ...fields.fullTimeRes.slice(0, index),
            newObj,
            ...fields.fullTimeRes.slice(index + 1)
          ]
        })
      );
    },
    addFullTimeRes: () => {
      return dispatch(
        changeScheduleFields({
          fullTimeRes: [
            ...fields.fullTimeRes,
            { name: "", schedulePrefers: [], timeOff: [] }
          ]
        })
      );
    },
    deleteFullTimeRes: index => () => {
      return dispatch(
        changeScheduleFields({
          fullTimeRes: [
            ...fields.fullTimeRes.slice(0, index),
            ...fields.fullTimeRes.slice(index + 1)
          ]
        })
      );
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Home);
