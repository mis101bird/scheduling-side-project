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
import PersonalModal from "./PersonalPreferModal";
import PartTimeModal from './PartTimeModal';
import HandyCalendar from './HandyCalendar'
import "./index.less";
import moment from "moment";
import ScheduleHandler from './scheduleHandler'
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
  timeOff = [],
  scheduleTimes = [],
  changeFullTimeRes,
  deleteFullTimeRes,
  showFullTimeModal
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
          if (
            scheduleTimes.length > 0 &&
            moment(value).isBetween(scheduleTimes[0], scheduleTimes[1], "[]")
          ) {
            changeFullTimeRes({ timeOff: [...timeOff, value] });
          }
        }}
      />
      <Row type="flex" style={{ marginLeft: "8px" }}>
        {timeOff.length > 0 &&
          timeOff.map((day, idx) => (
            <Tag key={idx} color="geekblue" size="big" style={{ marginBottom: "4px" }}>
              {day.format("YYYY/MM/DD")}
            </Tag>
          ))}
      </Row>
    </div>
    <div className="fullTimeButton">
      <Button type="primary" onClick={showFullTimeModal}>
        個人調整設定
      </Button>
    </div>
    <Icon
      type="delete"
      theme="filled"
      style={{ fontSize: "20px" }}
      onClick={deleteFullTimeRes}
    />
  </Row>
);

const PartTimeResItem = ({
  name,
  changePartTimeRes,
  deletePartTimeRes,
  showPartTimeModal
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
      style={{ flex: 1, marginRight: "10px" }}
      value={name}
      onChange={e => changePartTimeRes({ name: e.target.value })}
    />
    <div className="fullTimeButton">
      <Button type="primary" onClick={showPartTimeModal}>
        兼職時間設定
      </Button>
    </div>
    <Icon
      type="delete"
      theme="filled"
      style={{ fontSize: "20px" }}
      onClick={deletePartTimeRes}
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
    <Input.Group compact style={{ width: 360, marginRight: "5px" }}>
      <Input
        style={{
          width: 120,
          textAlign: "center",
          pointerEvents: "none",
          color: "black"
        }}
        value="時間(淺計算用)"
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

const ScheduleClassDefineItem = ({
  name,
  startTime,
  endTime,
  priority,
  hours,
  humanResDef,
  humanResDefs,
  changeScheduleClassDef,
  deleteScheduleClassDef
}) => (
  <Row
    type="flex"
    align="middle"
    justify="space-between"
    style={{ flexWrap: "nowrap", marginBottom: "5px" }}
  >
    <Input
      addonBefore="名稱"
      placeholder="e.g. A班"
      style={{ flex: 1, marginRight: "5px" }}
      value={name}
      onChange={e => changeScheduleClassDef({ name: e.target.value })}
    />
    <Input.Group compact className="rangeTimeFlex">
      <Input
        style={{
          width: 79,
          textAlign: "center",
          pointerEvents: "none",
          color: "black"
        }}
        value="時間"
        disabled
      />
      <Input
        style={{ width: 100, textAlign: "center" }}
        placeholder="8:00"
        value={startTime}
        onChange={e => changeScheduleClassDef({ startTime: e.target.value })}
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
        style={{
          width: 100,
          borderLeft: 0,
          textAlign: "center",
          marginRight: "5px"
        }}
        placeholder="18:00"
        value={endTime}
        onChange={e => changeScheduleClassDef({ endTime: e.target.value })}
      />
    </Input.Group>
    <Input
      addonBefore="時數"
      placeholder="不含休息時間"
      style={{ flex: 1, marginRight: "5px" }}
      value={hours}
      onChange={e => changeScheduleClassDef({ hours: e.target.value })}
      addonAfter="小時"
    />
    <div className="fullTimeFlex">
        日分配標籤
      <Select
        mode="multiple"
        placeholder="至少一個"
        onChange={value => changeScheduleClassDef({ humanResDef: value })}
        value={humanResDef}
        style={{ flex: 1, margin: "0 12px 0 5px" }}
      >
        {humanResDefs
          .filter(def => !!def.name)
          .map(res => (
            <Option key={res.name}>{res.name}</Option>
          ))}
      </Select>
    </div>
    <Input
      style={{ marginRight: "12px", width: "144px" }}
      addonBefore="優先序"
      placeholder="e.g. 1"
      value={priority}
      onChange={e => changeScheduleClassDef({ priority: e.target.value })}
    />
    <Icon
      type="delete"
      theme="filled"
      style={{ fontSize: "20px" }}
      onClick={deleteScheduleClassDef}
    />
  </Row>
);

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      briefCalc: undefined,
      startHandyCalc: false,
      openFulltimeModal: false,
      currentFullTimeIdx: undefined,
      openPartTimeModal: false,
      currentPartTimeIdx: undefined,
      scheduleHandler: undefined
    };

    this.deleteSundayHoliday = this.deleteSundayHoliday.bind(this);
    this.deleteSaturdayHoliday = this.deleteSaturdayHoliday.bind(this);
    this.showFullTimeModal = this.showFullTimeModal.bind(this);
    this.showPartTimeModal = this.showPartTimeModal.bind(this);
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

  calcScheduleDaysPriority(e) {
    // calc schedule days order queue!!
  }

  showFullTimeModal(idx) {
    return () => {
      this.setState({
        openFulltimeModal: true,
        currentFullTimeIdx: idx
      });
    };
  }

  showPartTimeModal(idx) {
    return () => {
      this.setState({
        openPartTimeModal: true,
        currentPartTimeIdx: idx
      });
    };
  }

  render() {
    const {
      holidays,
      humanResDefs,
      fullTimeRes,
      scheduleTimes,
      scheduleClassDefs,
      partTimeRes
    } = this.props.fields;
    return (
      <React.Fragment>
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
                      return (
                        <HumanResourceDefineItem key={idx} {...defProps} />
                      );
                    })}
                </Form.Item>
              </Card>
              <Card type="inner" title="排班類型">
                <Form.Item
                  label={
                    <div className="label">
                      類型
                      <Icon
                        type="plus-circle"
                        style={{ fontSize: "20px", marginLeft: "10px" }}
                        onClick={this.props.addScheduleClassDef}
                      />
                    </div>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  {scheduleClassDefs.length > 0 &&
                    scheduleClassDefs.map((classItem, idx) => {
                      const classProps = {
                        ...classItem,
                        humanResDefs,
                        changeScheduleClassDef: this.props.changeScheduleClassDef(
                          idx
                        ),
                        deleteScheduleClassDef: this.props.deleteScheduleClassDef(
                          idx
                        )
                      };
                      return (
                        <ScheduleClassDefineItem key={idx} {...classProps} />
                      );
                    })}
                </Form.Item>
              </Card>
              <Card type="inner" title="員工設定">
                <Form.Item
                  label={
                    <div className="label">
                      正職
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
                        deleteFullTimeRes: this.props.deleteFullTimeRes(idx),
                        showFullTimeModal: this.showFullTimeModal(idx)
                      };
                      return <FullTimeResItem key={idx} {...resProps} />;
                    })}
                </Form.Item>
                <Form.Item
                  label={
                    <div className="label">
                      兼職
                      <Icon
                        type="plus-circle"
                        style={{ fontSize: "20px", marginLeft: "10px" }}
                        onClick={this.props.addPartTimeRes}
                      />
                    </div>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 10 }}
                >
                  {partTimeRes.length > 0 &&
                    partTimeRes.map((res, idx) => {
                      const resProps = {
                        ...res,
                        changePartTimeRes: this.props.changePartTimeRes(idx),
                        deletePartTimeRes: this.props.deletePartTimeRes(idx),
                        showPartTimeModal: this.showPartTimeModal(idx)
                      };
                      return <PartTimeResItem key={idx} {...resProps} />;
                    })}
                </Form.Item>
              </Card>
              <Card
                type="inner"
                title={
                  <div>
                    互動計算
                    <Button
                      type="primary"
                      style={{ marginLeft: "10px" }}
                      onClick={() => new Promise((resolve) => {
                        const scheduleH = new ScheduleHandler(this.props.fields)
                        return resolve(scheduleH)
                      }).then((scheduleHandler) => this.setState({ startHandyCalc: true, scheduleHandler }))}
                    >
                      開始
                    </Button>
                  </div>
                }
              >
                {this.state.startHandyCalc ? (
                    <HandyCalendar scheduleHandler={this.state.scheduleHandler} />
                ) : (
                  "歡迎使用互動式排班！"
                )}
              </Card>
            </Card>
          </Content>
          <AppFooter />
        </Layout>
        <PersonalModal
          visible={this.state.openFulltimeModal}
          handleOk={() => this.setState({ openFulltimeModal: false })}
          handleCancel={() => this.setState({ openFulltimeModal: false })}
          itemIdx={this.state.currentFullTimeIdx}
          changeRes={this.props.changeFullTimeRes(this.state.currentFullTimeIdx)}
        />
        <PartTimeModal
          visible={this.state.openPartTimeModal}
          handleOk={() => this.setState({ openPartTimeModal: false })}
          handleCancel={() => this.setState({ openPartTimeModal: false })}
          itemIdx={this.state.currentPartTimeIdx}
          changeRes={this.props.changePartTimeRes(this.state.currentPartTimeIdx)}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { fields = {} } = state.home;
  console.log('homeState', state.home)
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
            { name: "", timeOff: [] }
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
    },
    changeScheduleClassDef: index => payload => {
      const newObj = {
        ...fields.scheduleClassDefs[index],
        ...payload
      };
      return dispatch(
        changeScheduleFields({
          scheduleClassDefs: [
            ...fields.scheduleClassDefs.slice(0, index),
            newObj,
            ...fields.scheduleClassDefs.slice(index + 1)
          ]
        })
      );
    },
    addScheduleClassDef: () => {
      return dispatch(
        changeScheduleFields({
          scheduleClassDefs: [
            ...fields.scheduleClassDefs,
            {
              name: "",
              startTime: "",
              endTime: "",
              priority: "",
              humanResDef: [],
              hours: ""
            }
          ]
        })
      );
    },
    deleteScheduleClassDef: index => () => {
      return dispatch(
        changeScheduleFields({
          scheduleClassDefs: [
            ...fields.scheduleClassDefs.slice(0, index),
            ...fields.scheduleClassDefs.slice(index + 1)
          ]
        })
      );
    },
    changePartTimeRes: index => payload => {
      const newObj = {
        ...fields.partTimeRes[index],
        ...payload
      };
      return dispatch(
        changeScheduleFields({
          partTimeRes: [
            ...fields.partTimeRes.slice(0, index),
            newObj,
            ...fields.partTimeRes.slice(index + 1)
          ]
        })
      );
    },
    addPartTimeRes: () => {
      return dispatch(
        changeScheduleFields({
          partTimeRes: [
            ...fields.partTimeRes,
            { name: "" }
          ]
        })
      );
    },
    deletePartTimeRes: index => () => {
      return dispatch(
        changeScheduleFields({
          partTimeRes: [
            ...fields.partTimeRes.slice(0, index),
            ...fields.partTimeRes.slice(index + 1)
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
