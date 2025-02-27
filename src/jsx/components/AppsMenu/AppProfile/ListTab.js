import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { Modal, Button, Form } from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';
import axios from 'axios';
import api from '../../../config.json';
import { exportTableToExcel } from '../../../../util/common';

const headersTitle = [
    { label: 'Employee ID', key: 'emplid' },
    { label: 'Position', key: 'position' },
    { label: 'Employee Name', key: 'title' },
    { label: 'Email Address', key: 'email' },
    { label: 'Date', key: 'date' },
    { label: 'Status', key: 'week' },
];

const csvlink = {
    headers: headersTitle,
    data: [], // Fill with the appropriate data
    filename: "csvfile.csv"
};

const ListTab = ({ filter = [],isList }) => {
    const [allUser, setAllUser] = useState([]);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [test, setTest] = useState(0);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({});
    const sort = 10;


    const fetchAllUsers = () => {
        axios.get(`${api.api}user`)
            .then((result) => {
                console.log("result.data", result.data);
                setAllUser(result.data);
                setData(result.data.slice(0, sort));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleEditUser = (user) => {
        console.log("UserId", user);
        setCurrentUser(user);
        setUpdatedUser(user);
        setShowEditModal(true);
    };

    const handleDeleteUser = (userId) => {
        axios.patch(`${api.api}user/${userId}`, { enabled: false })
            .then(() => {
                fetchAllUsers();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handlePageChange = (pageIndex) => {
        const start = pageIndex * sort;
        const end = start + sort;
        setData(allUser.slice(start, end));
        setCurrentPage(pageIndex);
    };

    const handleSaveChanges = () => {
        axios.patch(`${api.api}user/${currentUser._id}`, updatedUser)
            .then(() => {
                fetchAllUsers();
                setShowEditModal(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchAllUsers();
    }, [test]);

    const checkbox = document.querySelectorAll(".sorting_20 input");
    const motherCheckBox = document.querySelector(".sorting_asc_11 input");

    const checkboxFun = (type) => {
        for (let i = 0; i < checkbox.length; i++) {
            const element = checkbox[i];
            if (type === "all") {
                if (motherCheckBox.checked) {
                    element.checked = true;
                } else {
                    element.checked = false;
                }
            } else {
                if (!element.checked) {
                    motherCheckBox.checked = false;
                    break;
                } else {
                    motherCheckBox.checked = true;
                }
            }
        }
    };

    const getFilterUser = () => {
        let users = [...data];
        if (isList && filter ) {
            users = users.filter(x => filter.includes(x._id))
        }
        return users
    }

    return (
        <>
            <div className="card">
                <div className="card-body p-0">
                    <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                        <div className="tbl-caption">
                            <h4 className="heading mb-0">User List</h4>
                            <div>
                                <div onClick={() => exportTableToExcel("user-tbl_wrapper")} className="btn btn-primary light btn-sm me-2">
                                    <i className="fa-solid fa-file-excel" /> Export Report
                                </div>
                            </div>
                        </div>
                        <div id="user-tbl_wrapper" className="dataTables_wrapper no-footer">
                            <table id="projects-tbl" className="table ItemsCheckboxSec dataTable no-footer mb-0">
                                <thead>
                                    <tr>
                                        <th className="sorting_asc_11">
                                            <div className="form-check custom-checkbox ms-0">
                                                <input type="checkbox" className="form-check-input checkAllInput" required=""
                                                    onClick={() => checkboxFun("all")}
                                                />
                                                <label className="form-check-label" htmlFor="checkAll"></label>
                                            </div>
                                        </th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Designation</th>
                                        <th>Department</th>
                                        <th>Mobile</th>
                                        <th>User Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getFilterUser().map((item, index) => (
                                        <tr key={index}>
                                            <td className="sorting_20">
                                                <div className="form-check custom-checkbox">
                                                    <input type="checkbox" className="form-check-input"
                                                        id={`user${index + 211}`} required=""
                                                        onClick={() => checkboxFun()}
                                                    />
                                                    <label className="form-check-label" htmlFor={`user${index + 211}`}></label>
                                                </div>
                                            </td>
                                            <td>{item.name}</td>
                                            <td>{item.email}</td>
                                            <td>{item.designation}</td>
                                            <td>{item.department}</td>
                                            <td>{item.mobileNumber}</td>
                                            <td>{item.userRole.UserRole}</td>
                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle as="div" className="btn-link i-false">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z" stroke="#737B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                            <path d="M18 12C18 12.5523 18.4477 13 19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12Z" stroke="#737B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                            <path d="M4 12C4 12.5523 4.44772 13 5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12Z" stroke="#737B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                        </svg>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu className="dropdown-menu-right" align="end">
                                                        <Dropdown.Item onClick={() => handleEditUser(item)}>Edit</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => handleDeleteUser(item._id)}>Disable</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="d-sm-flex text-center justify-content-between align-items-center">
                                <div className="dataTables_info">
                                    Showing {currentPage * sort + 1} to{" "}
                                    {allUser.length > (currentPage + 1) * sort
                                        ? (currentPage + 1) * sort
                                        : allUser.length}{" "}
                                    of {allUser.length} entries
                                </div>
                                <div className="dataTables_paginate paging_simple_numbers">
                                    <Link
                                        className={`paginate_button previous ${currentPage === 0 ? "disabled" : ""}`}
                                        to="#"
                                        onClick={() => currentPage > 0 && handlePageChange(currentPage - 1)}
                                    >
                                        <i className="fa-solid fa-angle-left" />
                                    </Link>
                                    <span>
                                        {Array(Math.ceil(allUser.length / sort)).fill().map((_, i) => (
                                            <Link
                                                key={i} to="#"
                                                className={`paginate_button ${currentPage === i ? "current" : ""}`}
                                                onClick={() => handlePageChange(i)}
                                            >
                                                {i + 1}
                                            </Link>
                                        ))}
                                    </span>
                                    <Link
                                        className={`paginate_button next ${currentPage + 1 >= Math.ceil(allUser.length / sort) ? "disabled" : ""}`}
                                        to="#"
                                        onClick={() => currentPage + 1 < Math.ceil(allUser.length / sort) && handlePageChange(currentPage + 1)}
                                    >
                                        <i className="fa-solid fa-angle-right" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit User Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formUserName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedUser.name || ''}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formUserEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={updatedUser.email || ''}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formUserDesignation">
                            <Form.Label>Designation</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedUser.designation || ''}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, designation: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formUserDepartment">
                            <Form.Label>Department</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedUser.department || ''}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, department: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formUserMobile">
                            <Form.Label>Mobile</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedUser.mobileNumber || ''}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, mobileNumber: e.target.value })}
                            />
                        </Form.Group>
                        {/* <Form.Group className="mb-3" controlId="formUserRole">
                            <Form.Label>User Role</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedUser.userRole || ''}
                                onChange={(e) => setUpdatedUser({ ...updatedUser, userRole: e.target.value })}
                            />
                        </Form.Group> */}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ListTab;