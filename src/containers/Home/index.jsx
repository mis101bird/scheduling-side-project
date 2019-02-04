import React from "react";
import { connect } from "react-redux";
import { Card, Layout, Row, Button, DatePicker, Form, List, Icon } from "antd";
import iconReact from "../../assets/react.svg";
import iconRedux from "../../assets/redux.png";
import iconAntd from "../../assets/antd.png";
import AppHeader from "../../components/AppHeader";
import AppFooter from "../../components/AppFooter";
import "./index.less";
import moment from "moment";
import {
  changeScheduleFields,
  changeSchedulePeriodAndHolidaySelect
} from "../../actions/home";

const { RangePicker } = DatePicker;

const { Content } = Layout;

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
            actions={[
              <a onClick={deleteHoliday(index)}>
                刪除
              </a>
            ]}
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
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.deleteSundayHoliday = this.deleteSundayHoliday.bind(this);
    this.deleteSaturdayHoliday = this.deleteSaturdayHoliday.bind(this);
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

  render() {
    const { holidays } = this.props.fields;
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
                  size="large"
                  onChange={momentTimes =>
                    this.props.changePeriodAndHoliday(momentTimes)
                  }
                />
              </Form.Item>
              <Form.Item
                label="診所休假列表"
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
            </Card>
            <Card type="inner" title="規則設定">
              1. 人力分配 (早/午/晚) 2. 排班類型 (優先序/早午晚定義) -->
              自動計算時數
            </Card>
            <Card type="inner" title="正職偏好設定">
              動態新增
            </Card>
            <Row>
              <Button type="primary" size="large">
                計算
              </Button>
            </Row>
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
      )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Home);
