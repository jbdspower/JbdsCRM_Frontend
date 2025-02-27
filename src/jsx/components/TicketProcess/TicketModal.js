import React, { useEffect, useState } from 'react';
import { Row, Card, Col, Button, Modal, Container, Tabs, Tab } from "react-bootstrap";
import ChatElementBlog from '../Dashboard/elements/ChatElementBlog';
import HistoryTimeline from './HistoryTimeline';
import TimeSheet from './Timesheet';
import Stepper from './Stepper';
import moment from 'moment';
import { Select } from 'antd';
import AntdTrasfer from '../Dashboard/elements/AntdTransfer'


const TicketModal = ({ getAllTicket,id, show, onHide, ticketData, showTab, onChange, handleUpdate }) => {
  const [key, setKey] = useState('comment');
  useEffect(() => {
    if (showTab) {
      setKey(showTab)
    } else {
      setKey("comment")
    }
  }, [showTab])

  const dueDates = () => {
    const arr = []
    if (ticketData && ticketData.SR_Data_Logs) {
      ticketData.SR_Data_Logs.forEach((x) => {
        if (x.UpdateData && x.UpdateData.length > 0) {
          x.UpdateData.forEach((dueDate) => {
            if (dueDate.DueDate) {
              arr.push({ date: dueDate.DueDate, title: moment(dueDate.DueDate).format('DD-MM-YYYY') })
            }
          })
        }
      })
    }
    // alert(JSON.stringify(arr))
    return arr
  }

  const getCurrentStep = () => {
    const dueDates1 = dueDates();
    let state = "No Due Date"
    dueDates1.forEach((x) => {
      if (new Date(x.date) >= new Date()) {
        state = x.title
      }
    })
    return state;
  }

  const getStringToDateObject = (date) => {
    // Given date string
    let dateStr = date;

    // Split the date string into components
    let dateParts = dateStr.split("-");

    // Extract the day, month, and year (assuming year is 2020)
    let day = dateParts[0];
    let month = dateParts[1];
    let year = dateParts[2];

    // If the year is incomplete, assume it is 2020 (for example)
    if (year.length === 3) {
      year = "2020";
    }

    // Construct a new date string in the format "YYYY-MM-DD"
    let formattedDateStr = `${year}-${month}-${day}`;

    // Create a Date object
    let dateObj = new Date(formattedDateStr);

    // Output the Date object
    return dateObj
  }

  const getSelectedEmploye = () => {
    const data = { ...ticketData };
    let employee = []
    data.SR_Data_Logs && data.SR_Data_Logs.forEach((state) => {
      if (state.FieldData.AssignRole == "employee") {
        employee = state.FieldData.AssignPerson.map(x => x.value)
      }
    })
    return employee;
  }

  const user = JSON.parse(localStorage.getItem('userDetails'))
  return (<Modal className="fade bd-example-modal-lg" show={show} size="lg" onHide={onHide}>
    <Modal.Header>
      <Modal.Title>Ticket {ticketData.SR_ID}</Modal.Title>
      <Button variant="" className="btn-close" onClick={onHide}></Button>
    </Modal.Header>
    <Modal.Body>
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="comment" title="Comments">
          <ChatElementBlog ticketData={ticketData} ticketId={ticketData.SR_ID} />
        </Tab>
        <Tab eventKey="history" title="History">
          <HistoryTimeline ticketId={ticketData.SR_ID} />
        </Tab>
        <Tab eventKey="timesheet" title="Time Sheet">
          <TimeSheet ticketData={ticketData} />
        </Tab>
        <Tab eventKey="dueDate" title="Due Date">
          <div className='row'>
            Exceeded Due Dates
            <Stepper
              steps={dueDates()}
              CurrentStep={getCurrentStep()}
              Selectable={false}
            />
            {(user.role == 'manager' || user.role == 'super_admin') && <>
              <div className='form-group form-group-sm text-center col-6'>
                <label>Update Due Date</label>
                <input min={dueDates().length > 0 ? moment(getStringToDateObject(dueDates()[dueDates().length - 1].title)).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD")} onChange={onChange} type='date' className='form-control form-control-sm' />
              </div>
              <button className='btn btn-sm btn-primary col-2 h-25 mt-4' onClick={handleUpdate}>Update</button>
            </>}
          </div>
        </Tab>
        {(user.role == 'manager' || user.role == 'super_admin') && <Tab eventKey="assign" title="Assign More Employee">
          <div className='row text-center'>
            <>
              <div className='col-4-sm'></div>
              <div className='form-group form-group-sm text-center col-8-sm'>
                <AntdTrasfer ticketData={ticketData} getAllTicket={getAllTicket} AssignEmployee={getSelectedEmploye()} />
              </div>
            </>
          </div>
        </Tab>}
      </Tabs>
    </Modal.Body>
    {/* <Modal.Footer>
      <Button
        variant="danger light"
        onClick={onHide}
      >
        Close
      </Button>
      <Button
        variant=""
        type="button"
        className="btn btn-primary"
      >
        Save changes
      </Button>
    </Modal.Footer> */}
  </Modal>);
}

export default TicketModal;