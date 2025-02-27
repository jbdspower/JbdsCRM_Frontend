import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import axios from 'axios';
import swal from "sweetalert";
import api from "../../config.json";
import Autocomplete from '../TicketProcess/AutoComplete';

const CustomerForm = forwardRef((props, ref) => {
    const [addEmployee, setAddEmployee] = useState(false);
    const [companyList, setCompanyList] = useState([])

    // State variables for form input values
    const [obj, setObj] = useState('');

    // State variables for error messages
    const [errors, setErrors] = useState({});

    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddEmployee(true)
        }
    }));

    const nav = useNavigate();
    useEffect(() => {
        fetchAllCustomer()
    }, [])

    const fetchAllCustomer = () => {
        axios.get(`${api.api}customer`)
            .then((result) => {
                setCompanyList(result.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // useEffect(() => {
    //     // Fetch user roles from the API
    //     const fetchUserRoles = async () => {
    //         try {
    //             const response = await axios.get(api.api + "userrole");
    //             if (response.status === 200) {
    //                 console.log(response.data);
    //             } else {
    //                 console.error('Failed to fetch user roles');
    //             }
    //         } catch (error) {
    //             console.error('Error fetching user roles:', error);
    //         }
    //     };

    //     fetchUserRoles();
    // }, []);


    const handleOnChange = (e) => {
        const data = { ...obj };
        data[e.target.name] = e.target.value;
        setObj(data);
    }

    const validateForm = () => {
        let formErrors = {};
        if (!obj.name) formErrors.name = " Name is required";
        if (!obj.companyName) formErrors.companyName = "Company Name is required";
        if (!obj.mobileNumber) formErrors.mobileNumber = "Moblie Number Description is required";
        if (!obj.email) formErrors.email = "email is required";
        if (!obj.designation) formErrors.designation = "Designation is required";
        if (!obj.department) formErrors.department = "Department is required";

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post(api.api + "customer", obj);

            if (response.status === 200) {
                swal("Customer successfully Created");
                setObj({});
                setAddEmployee(false);
                nav('#');
                nav('#');
            } else {
                swal("Something went wrong. Please try again");
                console.error('Failed to add employee');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <Offcanvas show={addEmployee} onHide={() => setAddEmployee(false)} className="offcanvas-end customeoff" placement='end'>
                <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
                    <button type="button" className="btn-close" onClick={() => setAddEmployee(false)}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="offcanvas-body">
                    <div className="container-fluid">
                        <form>
                            <div className="row">
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput2" className="form-label">Customer Name <span className="text-danger">*</span></label>
                                    <input type="text" name='name' className="form-control" id="exampleFormControlInput2" value={obj.name} onChange={handleOnChange} placeholder="" />
                                    {errors.name && <small className="text-danger">{errors.name}</small>}
                                </div>
                                <div className="col-xl-6 mb-3">
                                <label htmlFor="exampleFormControlInput3" className="form-label">Company <span className="text-danger">*</span></label>
                                    <Autocomplete suggestions={companyList.map(x => x.companyName)} auto={false} inputData={obj} name={"companyName"} handleOnChange={handleOnChange} />
                                    {/* <label htmlFor="exampleFormControlInput3" className="form-label">Company <span className="text-danger">*</span></label>
                                    <input type="text" name='companyName' className="form-control" id="exampleFormControlInput3" value={obj.companyName} onChange={handleOnChange} placeholder="" /> */}
                                    {errors.companyName && <small className="text-danger">{errors.companyName}</small>}
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label">Mobile Number <span className="text-danger">*</span></label>
                                    <input type="text" name='mobileNumber' className="form-control" id="exampleFormControlInput3" value={obj.mobileNumber} onChange={handleOnChange} placeholder="" />
                                    {errors.mobileNumber && <small className="text-danger">{errors.mobileNumber}</small>}
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label">Email <span className="text-danger">*</span></label>
                                    <input type="email" name='email' className="form-control" id="exampleFormControlInput3" value={obj.email} onChange={handleOnChange} placeholder="" />
                                    {errors.email && <small className="text-danger">{errors.email}</small>}
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label">Designation <span className="text-danger">*</span></label>
                                    <input type="text" name='designation' className="form-control" id="exampleFormControlInput3" value={obj.designation} onChange={handleOnChange} placeholder="" />
                                    {errors.designation && <small className="text-danger">{errors.designation}</small>}
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label">Department <span className="text-danger">*</span></label>
                                    <input type="text" name='department' className="form-control" id="exampleFormControlInput3" value={obj.department} onChange={handleOnChange} placeholder="" />
                                    {errors.department && <small className="text-danger">{errors.department}</small>}
                                </div>

                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary me-1" onClick={(e) => handleSubmit(e)}>Submit</button>
                                <Link to={"#"} onClick={() => setAddEmployee(false)} className="btn btn-danger light ms-1">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </Offcanvas>
        </>
    );
});

export default CustomerForm;