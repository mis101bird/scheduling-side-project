import React from "react";
import { Modal, Button, Card, Calendar, Icon, Row, Col, Select } from "antd";
import { connect } from "react-redux";
import _get from "lodash/get";
import moment from "moment";

const { Option, OptGroup } = Select;

const SelectClassOrDef = ({
  idx,
  humanResDefs,
  scheduleClassDefs,
  deleteItem,
  changeItem
}) => (
  <div style={{ width: '95%', display: "flex", marginTop: 5 }}>
    <div style={{ lineHeight: '29px' }}>{`${idx + 1}. `}</div>
    <Select onChange={changeItem} style={{ margin: '0 10px 0 5px', flex: 1 }}>
      <OptGroup label="日分配">
        {humanResDefs
          .filter(def => !!def.name)
          .map(def => (
            <Option value={def.name}>{def.name}</Option>
          ))}
      </OptGroup>
      <OptGroup label="班表">
        {scheduleClassDefs
          .filter(def => !!def.name)
          .map(def => (
            <Option value={def.name}>{def.name}</Option>
          ))}
      </OptGroup>
    </Select>
    <Icon
      type="delete"
      theme="filled"
      style={{ fontSize: "20px" }}
      onClick={deleteItem}
    />
  </div>
);

class PersonalModal extends React.Component {
  constructor(props) {
    super(props);
    const { fields: { scheduleTimes = [] } = {} } = props;
    this.state = {
      currentDate: scheduleTimes.length === 0 ? moment() : scheduleTimes[0]
    };
  }

  render() {
    const {
      visible = false,
      handleOk,
      handleCancel,
      changeRes,
      changeCheckItem,
      addCheckItem,
      deleteCheckItem,
      fields: { scheduleTimes = [], humanResDefs = [], scheduleClassDefs = [] }
    } = this.props;
    const currentDateString = this.state.currentDate.format("YYYY/MM/DD");
    return (
      <Modal
        width='50%'
        visible={visible}
        centered
        title="個人調整"
        closable={false}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            確定
          </Button>
        ]}
      >
        <div
          style={{
            width: "100%",
            border: "1px solid #d9d9d9",
            borderRadius: 4,
            marginBottom: 24
          }}
        >
          <Calendar
            fullscreen={false}
            onPanelChange={value => this.setState({ currentDate: value })}
            onSelect={value => this.setState({ currentDate: value })}
            value={this.state.currentDate}
            disabledDate={currentDate => {
              if (scheduleTimes.length === 0) return true;
              return (
                currentDate.isBefore(scheduleTimes[0]) ||
                currentDate.isAfter(scheduleTimes[1])
              );
            }}
          />
        </div>
        <Card
          type="inner"
          title="確定情況 (ex. 我XXX日不上晚班)"
          style={{ marginBottom: 24 }}
        >
          <Row>
            <Col span="12">
              <div style={{ width: '100%' }}>
                <Icon
                  type="check"
                  style={{ fontSize: "20px", color: "#52c41a" }}
                />
                要上的班
                <Icon
                  type="plus-circle"
                  style={{ fontSize: "20px", marginLeft: "10px" }}
                  onClick={() => addCheckItem(this.state.currentDate)}
                />
              </div>
              {this.props.item &&
                _get(this.props.item, `${currentDateString}.includes`, []) &&
                _get(this.props.item, `${currentDateString}.includes`, []).map(
                  (opt, idx) => {
                    const defProps = {
                      idx,
                      ...opt,
                      humanResDefs,
                      scheduleClassDefs,
                      deleteItem: deleteCheckItem(this.state.currentDate, idx),
                      changeItem: changeCheckItem(this.state.currentDate, idx)
                    };
                    return <SelectClassOrDef key={idx} {...defProps} />;
                  }
                )}
            </Col>
            <Col span="12" style={{ display: "flex", alignItems: "center" }}>
              <Icon
                type="cross"
                style={{ fontSize: "20px", color: "#eb2f96" }}
              />
              不要上的班
              <Icon
                type="plus-circle"
                style={{ fontSize: "20px", marginLeft: "10px" }}
              />
            </Col>
          </Row>
        </Card>
        <Card type="inner" title='偏好 (ex. 我"希望"XXX日不上晚班)'>
          HI
        </Card>
      </Modal>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { fields = {} } = state.home;
  return {
    fields,
    item: _get(fields, `fullTimeRes[${props.itemIdx}]`, {})
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  };
};

const mergeProps = (propsFromState, propsFromDispatch, ownProps) => {
  return {
    ...propsFromState,
    ...ownProps,
    changeCheckItem: (calendarDay, idx) => value => {
      const dayString = calendarDay.format("YYYY/MM/DD");
      const newObj = {
        ..._get(propsFromState, `item.${dayString}`, {}),
        ...value
      };
      return ownProps.changeRes({
        [dayString]: {
          ..._get(propsFromState, `item.${dayString}`, {}),
          includes: [
            ..._get(propsFromState, `item.${dayString}.includes`, []).slice(0, idx),
            newObj,
            ..._get(propsFromState, `item.${dayString}.includes`, []).slice(idx + 1)
          ]
        }
      });
    },
    deleteCheckItem: (calendarDay, idx) => () => {
      const dayString = calendarDay.format("YYYY/MM/DD");
      return ownProps.changeRes({
        [dayString]: {
          ..._get(propsFromState, `item.${dayString}`, {}),
          includes: [
            ..._get(propsFromState, `item.${dayString}.includes`, []).slice(0, idx),
            ..._get(propsFromState, `item.${dayString}.includes`, []).slice(idx + 1)
          ]
        }
      });
    },
    addCheckItem: calendarDay => {
      const dayString = calendarDay.format("YYYY/MM/DD");
      if (!propsFromState.item[dayString]) {
        return ownProps.changeRes({
          [dayString]: {
            ..._get(propsFromState, `item.${dayString}`, {}),
            includes: [{ name: "" }]
          }
        });
      }

      return ownProps.changeRes({
        [dayString]: {
          ..._get(propsFromState, `item.${dayString}`, {}),
          includes: [
            ..._get(propsFromState, `item.${dayString}.includes`, []),
            { name: "" }
          ]
        }
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(PersonalModal);
