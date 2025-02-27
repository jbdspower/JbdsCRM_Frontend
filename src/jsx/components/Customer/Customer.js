import React,{useRef} from 'react';
import {Link} from 'react-router-dom';
import {Tab, Nav} from 'react-bootstrap';
import MainPagetitle from '../../layouts/MainPagetitle';
import { SVGICON } from '../../constant/theme';
// import GridTab from './GridTab';
import CustomerForm from './CustomerForm';
import CustomerListTbl from './CustomerTabl';

const Customer = () => {
    const productdata = useRef();
    const categorydata = useRef();
    return (
        <>
            <MainPagetitle mainTitle="Dashboard" pageTitle="Customer" parentTitle="Management"/>
            <div className="container-fluid">
				<div className="row">
                    <Tab.Container defaultActiveKey={'List'} >
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="heading mb-0">Customer Details</h4>
                            <div className="d-flex align-items-center">
                                <Nav as="ul" className="nav nav-pills mix-chart-tab user-m-tabe" id="pills-tab">
                                    {/* <Nav.Item as="li" className="nav-item" role="presentation">
                                        <Nav.Link as="button" className="nav-link" eventKey={'List'}>
                                            {SVGICON.List}
                                        </Nav.Link>
                                    </Nav.Item> */}
                                    {/* <Nav.Item as="li" className="nav-item" >
                                        <Nav.Link as="button" className="nav-link" eventKey={'Grid'}>
                                            {SVGICON.GridDots}										
                                        </Nav.Link>
                                    </Nav.Item> */}
                                </Nav>

                                <Link to className="btn btn-primary btn-sm ms-2"
                                    onClick={()=>categorydata.current.showEmployeModal()}
                                >+ Add Customer
                                </Link>
                            </div>
                        </div>
                        <div className="col-xl-12 active-p">
                            <Tab.Content>
                                {/* <Tab.Pane  eventKey={'Grid'}>
                                    <GridTab />
                                </Tab.Pane> */}
                                <Tab.Pane eventKey={'List'}>
                                    <CustomerListTbl />
                                </Tab.Pane>
                            </Tab.Content>
                        </div>
                    </Tab.Container>
                </div>
            </div>    
          
            <CustomerForm 
                ref={categorydata}
                Title="Add Customer"
            />         
        </>
    );
};

export default Customer;