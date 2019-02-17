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
  Spin,
  Form,
  Checkbox,
  Tree
} from "antd";
import { connect } from "react-redux";
import _get from "lodash/get";
import { List as _List, Map } from "immutable";
import _findIndex from "lodash/findIndex";
import moment from "moment";
import "./HandyCalendar.less";

const CheckboxGroup = Checkbox.Group;
const { TreeNode } = Tree;

const treeData = [{
  title: '0-0',
  key: '0-0',
  disabled: true,
  children: [{
    title: '0-0-0',
    key: '0-0-0'
  }, {
    title: '0-0-1',
    key: '0-0-1'
  }, {
    title: '0-0-2',
    key: '0-0-2'
  }],
}, {
  title: '0-1',
  key: '0-1',
  children: [
    { title: '0-1-0-0', key: '0-1-0-0' },
    { title: '0-1-0-1', key: '0-1-0-1' },
    { title: '0-1-0-2', key: '0-1-0-2' }
  ],
}];

// 1. 算出班表排列組合
// 2. 照人力 Grouping
// 3. 分配人力
class ScheduleDetailSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentFullTime: props.fullTimeRes.map(item => item.name),
      currentPartTime: [],
      currentSchedule: []
    };
  }

  renderTreeNodes(data){
    return data.map((item) => {
    const { disabled, ...others } = item
    if (item.children) {
      return (
        <TreeNode disableCheckbox={!!disabled} title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode disableCheckbox={!!disabled} {...others} />;
    })
  }

  // 指定負責人要SelectBox都填了才能button active
  // currentFullTime和currentPartTime一變化 --> Group變
  // currentSchedule變化 --> 更新！指定負責人清空
  render() {
    const {
      dateData,
      fullTimeRes,
      fields
    } = this.props;
    return (
      <React.Fragment>
        <Form.Item label="正職">
          <CheckboxGroup
            options={fullTimeRes.map(item => item.name)}
            value={this.state.currentFullTime}
            onChange={checkedList => {
              this.setState({ currentFullTime: checkedList /*Group變*/ });
            }}
          />
        </Form.Item>
        {dateData.get("availables", Map({})).size !== 0 && (
          <Form.Item label="兼職">
            <CheckboxGroup
              options={dateData.get("availables").map(item => item.name)}
              value={this.state.currentPartTime}
              onChange={checkedList => {
                this.setState({ currentPartTime: checkedList /*Group變*/ });
              }}
            />
          </Form.Item>
        )}
        <Form.Item label='符合需求的班表組合'>
        <Tree
        checkable
        defaultExpandAll

        onSelect={this.onSelect}
        onCheck={this.onCheck}
      >
        {this.renderTreeNodes(treeData)}
      </Tree>
        </Form.Item>
        <Form.Item label='指定負責人'>
            Hello
        </Form.Item>
      </React.Fragment>
    );
  }
}

class HandyCalendar extends React.Component {
  constructor(props) {
    super(props);
    const { fields: { scheduleTimes = [] } = {}, scheduleHandler } = props;

    const activeDateList = scheduleHandler.schedulePQ.last();
    this.state = {
      activeDateMap: activeDateList.groupBy(obj =>
        obj.get("date").format("YYYY/MM/DD")
      ),
      currentDate:
        scheduleTimes.length === 0
          ? Map({ date: moment() })
          : activeDateList.first(),
      availableNext: false
    };
    // remove the last array
    scheduleHandler.schedulePQ = scheduleHandler.schedulePQ.pop();

    this.calcDateCellRender = this.calcDateCellRender.bind(this);
    this.calcNewActiveDateMap = this.calcNewActiveDateMap.bind(this);
    this.nextSchedule = this.nextSchedule.bind(this);
  }

  calcNewActiveDateMap() {
    const { scheduleHandler } = this.props;
    const activeDateList = scheduleHandler.schedulePQ.last();

    if (!_List.isList(activeDateList)) return Map();
    scheduleHandler.schedulePQ = scheduleHandler.schedulePQ.pop();
    return {
      activeDateMap: activeDateList.groupBy(obj =>
        obj.get("date").format("YYYY/MM/DD")
      )
    };
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
      if (activeDateMap.has(date.format("YYYY/MM/DD"))) {
        console.log(date.format("YYYY/MM/DD"));
        const dateObj = activeDateMap.get(date.format("YYYY/MM/DD")).first();
        const outputs = dateObj.get("outputs");
        console.log(outputs);
        return (
          <div className="dateWrapper">
            <Spin size="large" style={{ margin: "3px 0 10px 3px" }} />
            {outputs.size > 0 &&
              outputs
                .map((classArray, key, idx) => (
                  <Badge
                    key={idx}
                    status="processing"
                    text={`${key}: ${classArray.join(", ")}`}
                  />
                ))
                .toList()}
          </div>
        );
      }

      // date是否在finishedMap { [date]: {...} }
      // check outputs (Map) 是否有東西了 --> 有：Badge
      if (finishedScheduleMap.has(date.format("YYYY/MM/DD"))) {
        const dateObj = finishedScheduleMap
          .get(date.format("YYYY/MM/DD"))
          .first();
        const outputs = dateObj.get("outputs");
        return (
          <div className="dateWrapper">
            {outputs.size > 0 &&
              outputs
                .map((classArray, key, idx) => (
                  <Badge
                    key={idx}
                    status="error"
                    text={`${key}: ${classArray.join(", ")}`}
                  />
                ))
                .toList()}
          </div>
        );
      }
    }
  }

  nextSchedule() {
    const { scheduleHandler } = this.props;
    const { currentDate, activeDateMap } = this.state;
    scheduleHandler.finishedScheduleMap = scheduleHandler.finishedScheduleMap.push(
      currentDate
    );
    // no next currentDate in activeDateMap
    if (activeDateMap.size === 0) {
      const { activeDateMap: newActiveDateMap } = this.calcNewActiveDateMap();
      this.setState({
        availableNext: false,
        activeDateMap: newActiveDateMap,
        currentDate: newActiveDateMap.first()
      });
    } else {
      const newActiveDateMap = activeDateMap.delete(
        currentDate.get("date").format("YYYY/MM/DD")
      );
      this.setState({
        availableNext: false,
        activeDateMap: newActiveDateMap,
        currentDate: newActiveDateMap.first()
      });
    }
  }

  render() {
    const {
      fields: { scheduleTimes = [], humanResDefs = [], scheduleClassDefs = [], fullTimeRes = [] },
      scheduleHandler
    } = this.props;
    const currentDateString = this.state.currentDate
      .get("date")
      .format("YYYY/MM/DD");
    const hourStore = scheduleHandler.hourStore;
    return (
      <Row type="flex" className="handy-calendar">
        <Button
          onClick={() => {
            this.setState({ activeDateMap: this.calcNewActiveDateMap() });
          }}
        >
          下一檔
        </Button>
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
            onPanelChange={value =>
              this.setState({
                currentDate:
                  this.state.activeDateMap.get(value.format("YYYY/MM/DD")) ||
                  Map({ date: value })
              })
            }
            onSelect={value =>
              this.setState({
                currentDate:
                  this.state.activeDateMap.get(value.format("YYYY/MM/DD")) ||
                  Map({ date: value })
              })
            }
            value={this.state.currentDate.get("date")}
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
            title={`排班挑選 ${this.state.currentDate
              .get("date")
              .format("YYYY/MM/DD")}`}
            extra={
              <Button
                disabled={!this.state.availableNext}
                onClick={() => console.log("HI")}
              >
                下一個排班
              </Button>
            }
            style={{ marginTop: 0, marginLeft: 0 }}
          >
            <ScheduleDetailSetting fields={this.props.fields} dateData={this.state.currentDate} fullTimeRes={fullTimeRes} />
          </Card>
        </Col>
        <Col span={4}>
          <List
            span={4}
            bordered
            dataSource={hourStore.toList()}
            renderItem={(item, idx) => {
              const { title, defaultHours = 0, currentHours } = item;
              return (
                <List.Item>
                  <List.Item.Meta
                    title={`${idx + 1}. ${title}`}
                    description={`目前時數： ${
                      defaultHours !== 0
                        ? `${currentHours}/${defaultHours}`
                        : `${currentHours}`
                    }`}
                  />
                </List.Item>
              );
            }}
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
