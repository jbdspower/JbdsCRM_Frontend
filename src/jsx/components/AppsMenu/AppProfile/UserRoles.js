import React, { useState, useEffect  } from 'react';
import {Link} from 'react-router-dom';
import MainPagetitle from '../../../layouts/MainPagetitle';
import JobManagementList from './JobManagementList';
import JobRejectionsList from './JobRejectionsList';
import { Offcanvas } from 'react-bootstrap';
import axios from 'axios'; // Import axios
import swal from "sweetalert";
import api from "../../../config.json";

const roleListData = [
	{title: 'User Management',  addchecked: false, editchecked:true, deletechecked:true},
	{title: 'Release', addchecked: false, editchecked: false, deletechecked: false },
	{title: 'Content Management', addchecked: false, editchecked: true, deletechecked: true},
	{title: 'Libabry Management', addchecked: false, editchecked: true, deletechecked: true },
	{title: 'Permissions for work items', addchecked: true, editchecked: false, deletechecked: false },
	{title: 'User Management', addchecked: true, editchecked: true, deletechecked: false },
	{title: 'Release', addchecked: false, editchecked: true, deletechecked: false },
	{title: 'Content Management', addchecked: true, editchecked: true, deletechecked: false },
	{title: 'Libabry Management', addchecked: false, editchecked: true, deletechecked: true },
	{title: 'Permissions for work items', addchecked: true, editchecked: false, deletechecked: true },
	{title: 'User Management', addchecked: true, editchecked: true, deletechecked: true},
	{title: 'Release', addchecked: true, editchecked: false, deletechecked: true},
	{title: 'Content Management', addchecked: true, editchecked: false, deletechecked: false},
];

const UserRoles = () => {
    const [addRole, setAddRole] = useState(false);
    const [roleName, setRoleName] = useState('');
    const [roles, setRoles] = useState([]);

    const handleRoleNameChange = (e) => setRoleName(e.target.value);

    const handleCheckboxChange = (index, type) => {
        const newRoles = [...roles];
        newRoles[index][type] = !newRoles[index][type];
        setRoles(newRoles);
    };

    const handleSubmit = async () => {
        const roleData = {
            UserRole:roleName,
            permissions: roles,
        };

        try {
            const response = await axios.post(api.api + 'userRole', roleData);
            console.log('Role added successfully:', response.data);
            swal('Role added successfully')
            setAddRole(false); // Close the offcanvas on successful submission
        } catch (error) {
            console.error('There was an error adding the role:', error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${api.api}userRole`);
            setRoles(response.data);
        } catch (error) {
            console.error('There was an error fetching the roles:', error);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    return (
        <>
            <MainPagetitle mainTitle="Dashboard" pageTitle={'User Roles'} parentTitle={'Users Manager'} />
            <div className="container-fluid">
                <div className="row">
                    <div className="d-flex align-items-center justify-content-between">
                        <h4 className="heading mb-3">Add Roles</h4>
                        <Link to={"#"} className="btn btn-primary btn-sm mb-3" onClick={() => setAddRole(true)}>+ Add a role</Link>
                    </div>
                    {/* <div className="col-xl-3 col-lg-4">
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="heading mb-0">Personal</h4>
                                    </div>
                                    <div className="card-body px-0">
                                        <ul className="personal-info">
                                            <li><i className="fa-solid fa-user text-primary me-3"></i> Profile</li>
                                            <li><i className="fa-solid fa-lock text-primary me-3"></i> Password</li>
                                            <li><i className="fa-solid fa-envelope-open text-primary me-3"></i> E-mail</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="heading mb-0">Company</h4>
                                    </div>
                                    <div className="card-body px-0">
                                        <ul className="personal-info">
                                            <li><i className="fa-solid fa-building text-primary me-3"></i> Commpany Details</li>
                                            <li><i className="fa-solid fa-user-plus text-primary me-3"></i> Team Members</li>
                                            <li><i className="far fa-clock text-primary me-3"></i> Format setting</li>
                                            <li><i className="fa-solid fa-briefcase text-primary me-3"></i> Job boards</li>
                                            <li><i className="far fa-user text-primary me-3"></i> Positions</li>
                                            <li><i className="fas fa-times-circle text-primary me-3"></i>Rejections resions</li>
                                            <li><i className="fas fa-envelope text-primary me-3"></i>Automated message</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-9 col-lg-8">
                        <div className="row">
                            <div className="col-xl-12">
                                <JobManagementList />
                            </div>
                            <div className="col-xl-12">
                                <JobRejectionsList />
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
            <Offcanvas className="offcanvas offcanvas-end customeoff" show={addRole} onHide={() => setAddRole(false)} placement='end'>
                <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">Add a Role</h5>
                    <button type="button" className="btn-close" onClick={() => setAddRole(false)}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="offcanvas-body">
                    <div className="container-fluid">
                        <div className="col-xl-12 mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label font-w500">Role name<span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter Role Name" value={roleName} onChange={handleRoleNameChange} />
                        </div>
                        <h4 className="heading">User Access levels</h4>
                        <div className="table-responsive">
                            <table id="role" className="table role-tble">
                                <thead>
                                    <tr>
                                        <th>Entity</th>
                                        <th className="text-end">Add</th>
                                        <th className="text-end">Edit</th>
                                        <th className="text-end">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.map((item, ind) => (
                                        <tr key={ind}>
                                            <td>{item.UserRole}</td>
                                            <td>
                                                <div className="form-check custom-checkbox checkbox-primary">
                                                    <input type="checkbox" className="form-check-input" id={`addinputcheck${ind + 11}`} required=""
                                                        checked={item.addchecked}
                                                        onChange={() => handleCheckboxChange(ind, 'addchecked')}
                                                    />
                                                    <label className="form-check-label" htmlFor={`addinputcheck${ind + 11}`}>Add</label>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="form-check custom-checkbox checkbox-warning">
                                                    <input type="checkbox" className="form-check-input" id={`editinputcheck${ind + 121}`} required=""
                                                        checked={item.editchecked}
                                                        onChange={() => handleCheckboxChange(ind, 'editchecked')}
                                                    />
                                                    <label className="form-check-label" htmlFor={`editinputcheck${ind + 121}`}>Edit</label>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="form-check custom-checkbox checkbox-warning">
                                                    <input type="checkbox" className="form-check-input" id={`deleteinputcheck${ind + 131}`} required=""
                                                        checked={item.deletechecked}
                                                        onChange={() => handleCheckboxChange(ind, 'deletechecked')}
                                                    />
                                                    <label className="form-check-label" htmlFor={`deleteinputcheck${ind + 131}`}>Delete</label>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div>
                        <button className="btn btn-primary btn-sm" onClick={handleSubmit}>Submit</button>{" "}
                        <Link to={"#"} className="btn btn-light btn-sm" onClick={() => setAddRole(false)}>Discard</Link>
                    </div>
                </div>
            </Offcanvas>
        </>
    );
};

export default UserRoles;
