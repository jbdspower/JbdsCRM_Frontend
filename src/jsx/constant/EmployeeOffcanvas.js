import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import axios from 'axios';
import swal from "sweetalert";
import api from "../.././jsx/config.json";

const EmployeeOffcanvas = forwardRef((props, ref) => {
    const [startDate, setStartDate] = useState(new Date());
    const [startDate2, setStartDate2] = useState(new Date());
    const [addEmployee, setAddEmployee] = useState(false);

    // State variables for form input values
    const [employeeName, setEmployeeName] = useState('');
    const [employeeEmail, setEmployeeEmail] = useState('');
    const [password, setPassword] = useState('');
    const [designation, setDesignation] = useState('');
    const [department, setDepartment] = useState('');
    const [mobile, setMobile] = useState('');
    const [gender, setGender] = useState('');
    const [language, setLanguage] = useState('');
    const [userRole, setUserRole] = useState('');
    const [address, setAddress] = useState('');

    // State variables for error messages
    const [errors, setErrors] = useState({});

    // State variable for user roles
    const [userRoles, setUserRoles] = useState([]);

    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddEmployee(true)
        }
    }));

    const nav = useNavigate();

    useEffect(() => {
        // Fetch user roles from the API
        const fetchUserRoles = async () => {
            try {
                const response = await axios.get(api.api + "userrole");
                if (response.status === 200) {
                    console.log(response.data);
                    setUserRoles(response.data);
                } else {
                    console.error('Failed to fetch user roles');
                }
            } catch (error) {
                console.error('Error fetching user roles:', error);
            }
        };

        fetchUserRoles();
    }, []);

    const validateForm = () => {
        let formErrors = {};
        if (!employeeName) formErrors.employeeName = "Employee Name is required";
        if (!employeeEmail) formErrors.employeeEmail = "Employee Email is required";
        else if (!/\S+@\S+\.\S+/.test(employeeEmail)) formErrors.employeeEmail = "Email address is invalid";
        if (!password) formErrors.password = "Password is required";
        if (!designation) formErrors.designation = "Designation is required";
        if (!department) formErrors.department = "Department is required";
        if (!mobile) formErrors.mobile = "Mobile number is required";
        else if (!/^\d{10}$/.test(mobile)) formErrors.mobile = "Mobile number must be 10 digits";
        if (!gender) formErrors.gender = "Gender is required";
        //if (!language) formErrors.language = "Language is required";
        if (!userRole) formErrors.userRole = "User Role is required";
        //if (!address) formErrors.address = "Address is required";

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const employeeData = {
            name: employeeName,
            email: employeeEmail,
            password: password,
            designation: designation,
            department: department,
            mobileNumber: mobile,
            gender: gender,
            // joiningDate: startDate,
            // dateOfBirth: startDate2,
            language: language,
            userRole: userRole,
            address: address,
            enabled: true
        };

        try {
            const response = await axios.post(api.api + "user", employeeData);

            if (response.status === 200) {
                console.log('Employee added successfully');
                swal("Employee successfully Created");
                setEmployeeName('');
                setEmployeeEmail('');
                setPassword('');
                setDesignation('');
                setDepartment('');
                setMobile('');
                setGender('');
                setStartDate(new Date());
                setStartDate2(new Date());
                setLanguage('');
                setUserRole('');
                setAddress('');
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
    // const nav = useNavigate();
    // const handleSubmit=(e)=>{
    //     e.preventDefault();
    //     nav("#");
    // }
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
                        <div>
                            <label>Profile Picture</label>
                            <div className="dz-default dlab-message upload-img mb-3">    
                                <form action="#" className="dropzone">
                                    <svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M27.1666 26.6667L20.4999 20L13.8333 26.6667" stroke="#DADADA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M20.5 20V35" stroke="#DADADA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M34.4833 30.6501C36.1088 29.7638 37.393 28.3615 38.1331 26.6644C38.8731 24.9673 39.027 23.0721 38.5703 21.2779C38.1136 19.4836 37.0724 17.8926 35.6111 16.7558C34.1497 15.619 32.3514 15.0013 30.4999 15.0001H28.3999C27.8955 13.0488 26.9552 11.2373 25.6498 9.70171C24.3445 8.16614 22.708 6.94647 20.8634 6.1344C19.0189 5.32233 17.0142 4.93899 15.0001 5.01319C12.9861 5.0874 11.015 5.61722 9.23523 6.56283C7.45541 7.50844 5.91312 8.84523 4.7243 10.4727C3.53549 12.1002 2.73108 13.9759 2.37157 15.959C2.01205 17.9421 2.10678 19.9809 2.64862 21.9222C3.19047 23.8634 4.16534 25.6565 5.49994 27.1667" stroke="#DADADA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M27.1666 26.6667L20.4999 20L13.8333 26.6667" stroke="#DADADA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <div className="fallback">
                                        <input name="file" type="file" multiple />                                        
                                    </div>
                                </form>
                            </div>    
                        </div>
                        <form>
                            <div className="row">
                                {/* <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Employee ID <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="" />
                                </div>	 */}
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput2" className="form-label">Employee Name <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" id="exampleFormControlInput2" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder="" />
                                    {errors.employeeName && <small className="text-danger">{errors.employeeName}</small>}
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label">Employee Email <span className="text-danger">*</span></label>
                                    <input type="email" className="form-control" id="exampleFormControlInput3" value={employeeEmail} onChange={(e) => setEmployeeEmail(e.target.value)} placeholder="" />
                                    {errors.employeeEmail && <small className="text-danger">{errors.employeeEmail}</small>}
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput4" className="form-label">Password <span className="text-danger">*</span></label>
                                    <input type="password" className="form-control" id="exampleFormControlInput4" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="" />
                                    {errors.password && <small className="text-danger">{errors.password}</small>}
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Designation <span className="text-danger">*</span></label>
                                    <select className="default-select form-control" value={designation} onChange={(e) => setDesignation(e.target.value)}>
                                        <option data-display="Select">Please select</option>
                                        <option value="service_Head">Service Head</option>
                                        <option value="manager">Manager</option>
                                        <option value="senior_manager">Senior Manager</option>
                                        <option value="executive">Executive</option>
                                    </select>
                                    {errors.designation && <small className="text-danger">{errors.designation}</small>}
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Department <span className="text-danger">*</span></label>
                                    <select className="default-select form-control" value={department} onChange={(e) => setDepartment(e.target.value)}>
                                        <option data-display="Select">Please select</option>
                                        <option value="service ">Service</option>
                                        <option value="technical">Technical</option>
                                        <option value="sales-coordinator">Sales Coordinator</option>
                                        <option value="automation ">Automation</option>
                                        <option value="director">Director</option>
                                    </select>
                                    {errors.department && <small className="text-danger">{errors.department}</small>}
                                </div>
                                {/* <div className="col-xl-6 mb-3">
                                    <label className="form-label">Country <span className="text-danger">*</span></label>
                                    <select className="default-select form-control">
                                        <option  data-display="Select">Please select</option>
                                        <option value="html">Ind</option>
                                        <option value="css">USA</option>
                                        <option value="javascript">UK</option>
                                    </select>
                                </div> */}
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput88" className="form-label">Mobile <span className="text-danger">*</span></label>
                                    <input type="number" className="form-control" id="exampleFormControlInput88" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="" />
                                    {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Gender <span className="text-danger">*</span></label>
                                    <select className="default-select form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
                                        <option data-display="Select">Please select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                {/* <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput99" className="form-label">Joining Date<span className="text-danger">*</span></label>                                    
                                    <DatePicker 
                                        className="form-control"
                                        selected={startDate} 
                                        onChange={(date) => setStartDate(date)} 
                                    />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput8" className="form-label">Date of Birth <span className="text-danger">*</span></label>                                    
                                    <DatePicker 
                                        className="form-control"
                                        selected={startDate2} 
                                        onChange={(date) => setStartDate2(date)} 
                                    />
                                </div> */}
                                {/* <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput10" className="form-label">Reporting To <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" id="exampleFormControlInput10" placeholder="" />
                                </div>		 */}
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Language</label>
                                    <select className="default-select form-control" value={language} onChange={(e) => setLanguage(e.target.value)}>
                                        <option data-display="Select">Please select</option>
                                        <option value="english">English</option>
                                        <option value="hindi">Hindi</option>
                                        <option value="Portuguese">Portuguese</option>
                                    </select>
                                    {/* {errors.language && <small className="text-danger">{errors.language}</small>} */}
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">User Role <span className="text-danger">*</span></label>
                                    <select className="default-select form-control" value={userRole} onChange={(e) => setUserRole(e.target.value)}>
                                        <option data-display="Select">Please select</option>
                                        {userRoles.map((role) => (
                                            <option key={role._id} value={role._id}>
                                                {role.UserRole}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.userRole && <small className="text-danger">{errors.userRole}</small>}
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlTextarea1" className="form-label">Address</label>
                                    <textarea className="form-control" id="exampleFormControlTextarea1" value={address} onChange={(e) => setAddress(e.target.value)} rows="2"></textarea>
                                    {/* {errors.address && <small className="text-danger">{errors.address}</small>} */}
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

export default EmployeeOffcanvas;