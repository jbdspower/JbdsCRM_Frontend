import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import axios from 'axios';
import swal from "sweetalert";
import api from "../.././jsx/config.json";

const ProductForm = forwardRef((props, ref) => {
    const [addEmployee, setAddEmployee] = useState(false);

    // State variables for form input values
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [categroy, setcategroy] = useState('');

    // State variables for error messages
    const [errors, setErrors] = useState({});

    // State variable for user roles
    const [categroys, setcategroys] = useState([]);

    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddEmployee(true)
        }
    }));

    const nav = useNavigate();

    useEffect(() => {
        // Fetch user roles from the API
        const fetchcategroys = async () => {
            try {
                const response = await axios.get(api.api + "categroy");
                if (response.status === 200) {
                    console.log(response.data);
                    setcategroys(response.data);
                } else {
                    console.error('Failed to fetch user roles');
                }
            } catch (error) {
                console.error('Error fetching user roles:', error);
            }
        };

        fetchcategroys();
    }, []);

    const validateForm = () => {
        let formErrors = {};
        if (!productName) formErrors.productName = "Product Name is required";
        if (!productDescription) formErrors.productDescription = "Product Description is required";
        if (!categroy) formErrors.categroy = "User Role is required";

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        props.setLoading(true)
        const employeeData = {
            name: productName,
            description: productDescription,
            categroy: categroy,
        };
        console.log("DDDDDDDDDDDD",employeeData);
        

        try {
            const response = await axios.post(api.api + "product", employeeData);

            if (response.status === 200) {
                swal("Product successfully Created");
                setProductName('');
                setProductDescription('');
                setcategroy('');
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
        finally{
            props.setLoading(false)
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
                        {/* <div>
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
                        </div> */}
                        <form>
                            <div className="row">
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput2" className="form-label">Product Name <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" id="exampleFormControlInput2" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="" />
                                    {errors.productName && <small className="text-danger">{errors.productName}</small>}
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label">Product Description <span className="text-danger">*</span></label>
                                    <input type="email" className="form-control" id="exampleFormControlInput3" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="" />
                                    {errors.productDescription && <small className="text-danger">{errors.productDescription}</small>}
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">User Role <span className="text-danger">*</span></label>
                                    <select className="default-select form-control" value={categroy} onChange={(e) => setcategroy(e.target.value)}>
                                        <option data-display="Select">Please select</option>
                                        {categroys.map((role) => (
                                            <option key={role._id} value={role._id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.categroy && <small className="text-danger">{errors.categroy}</small>}
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

export default ProductForm;