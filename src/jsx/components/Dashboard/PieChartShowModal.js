import React, { useEffect, useState } from 'react';
import { Row, Card, Col, Button, Modal, Container, Tabs, Tab } from "react-bootstrap";

import TicketList from '../TicketProcess/TicketList';
import User from '../AppsMenu/AppProfile/User';


const PieChartShowModal = ({title, show ,onHide,ids=[]}) => {
 
 

  return (
  <Modal className="fade bd-example-modal-xl" show={show} size="xl" onHide={onHide}>
    <Modal.Header>
      <Modal.Title>{title} Detail</Modal.Title>
      <Button variant="" className="btn-close" onClick={onHide}></Button>
    </Modal.Header>
    <Modal.Body>
    {title == "Total Employee" || title == "Active Employee" ?
											<User isExcel={true} filter={ids} isList={true} /> :
                      <TicketList  isExcel={true} filter={ids} isList={true}/>}
    
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

export default PieChartShowModal;