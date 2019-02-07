import React from "react";
import { Modal, Button, Card, Calendar, Icon, Row, Col, Select, Badge } from "antd";
import { connect } from "react-redux";
import _get from "lodash/get";
import moment from "moment";

const { Option, OptGroup } = Select;

const SelectClassOrDef = ({
  idx,
  humanResDefs,
  precised = false,
  scheduleClassDefs,
  deleteItem,
  changeItem
}) => (
  <div style={{ width: '95%', display: "flex", marginTop: 5 }}>
    <div style={{ lineHeight: '29px' }}>{`${idx + 1}. `}</div>
    <Select onChange={changeItem} style={{ margin: '0 10px 0 5px', flex: 1 }} dropdownStyle={{ height: 100, overflow: 'scroll' }}>
      {
        !precised && (
        <OptGroup label="日分配(含交集)">
        {humanResDefs
          .filter(def => !!def.name)
          .map(def => (
            <Option value={def.name}>{def.name}</Option>
          ))}
      </OptGroup>
        )}
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
      style={{ fontSize: "20px", paddingTop: '4px' }}
      onClick={deleteItem}
    />
  </div>
);

class PartTimeModal extends React.Component {
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
        title="兼職時間"
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
            dateCellRender={(date) => {
              const dateString = date.format('YYYY/MM/DD')
              const { 
                [dateString]: { 
                  availables = []
              } = {} } = this.props.item
              
              if(availables.length !== 0){
                return (<Badge status='error' style={{ bottom: '39px', left: '20px' }} />)
              }
            }}
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
          title="排班挑選"
          style={{ marginBottom: 24 }}
        >
          <Row>
              <div style={{ width: '100%' }}>
                <Icon
                  type="check"
                  style={{ fontSize: "20px", color: "#52c41a" }}
                />
                能兼職的班別
                <Icon
                  type="plus-circle"
                  style={{ fontSize: "20px", marginLeft: "10px" }}
                  onClick={() => addCheckItem(this.state.currentDate, 'availables')}
                />
              </div>
              {this.props.item &&
                _get(this.props.item, `${currentDateString}.availables`, []) &&
                _get(this.props.item, `${currentDateString}.availables`, []).map(
                  (opt, idx) => {
                    const defProps = {
                      idx,
                      ...opt,
                      humanResDefs,
                      scheduleClassDefs,
                      precised: true,
                      deleteItem: deleteCheckItem(this.state.currentDate, idx, 'availables'),
                      changeItem: changeCheckItem(this.state.currentDate, idx, 'availables')
                    };
                    return <SelectClassOrDef key={idx} {...defProps} />;
                  }
                )}
          </Row>
        </Card>
      </Modal>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { fields = {} } = state.home;
  return {
    fields,
    item: _get(fields, `partTimeRes[${props.itemIdx}]`, {})
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
    changeCheckItem: (calendarDay, idx, key) => (value) => {
      const dayString = calendarDay.format("YYYY/MM/DD");
      const newObj = {
        ..._get(propsFromState, `item.${dayString}`, {}),
        ...value
      };
      return ownProps.changeRes({
        [dayString]: {
          ..._get(propsFromState, `item.${dayString}`, {}),
          [key]: [
            ..._get(propsFromState, `item.${dayString}.${key}`, []).slice(0, idx),
            newObj,
            ..._get(propsFromState, `item.${dayString}.${key}`, []).slice(idx + 1)
          ]
        }
      });
    },
    deleteCheckItem: (calendarDay, idx, key) => () => {
      const dayString = calendarDay.format("YYYY/MM/DD");
      return ownProps.changeRes({
        [dayString]: {
          ..._get(propsFromState, `item.${dayString}`, {}),
          [key]: [
            ..._get(propsFromState, `item.${dayString}.${key}`, []).slice(0, idx),
            ..._get(propsFromState, `item.${dayString}.${key}`, []).slice(idx + 1)
          ]
        }
      });
    },
    addCheckItem: (calendarDay, key) => {
      const dayString = calendarDay.format("YYYY/MM/DD");
      if (!propsFromState.item[dayString]) {
        return ownProps.changeRes({
          [dayString]: {
            ..._get(propsFromState, `item.${dayString}`, {}),
            [key]: [{ name: "" }]
          }
        });
      }

      return ownProps.changeRes({
        [dayString]: {
          ..._get(propsFromState, `item.${dayString}`, {}),
          [key]: [
            ..._get(propsFromState, `item.${dayString}.${key}`, []),
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
)(PartTimeModal);
