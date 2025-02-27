import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import axios from 'axios';
import swal from "sweetalert";
import api from "../../config.json";

const SafetyItemsForm = forwardRef((props, ref) => {
    const [addEmployee, setAddEmployee] = useState(false);

    // State variables for form input values
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');

    // State variables for error messages
    const [errors, setErrors] = useState({});

    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddEmployee(true)
        }
    }));

    const nav = useNavigate();

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

    const validateForm = () => {
        let formErrors = {};
        if (!categoryName) formErrors.categoryName = "Category Name is required";
        if (!categoryDescription) formErrors.categoryDescription = "Category Description is required";

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const employeeData = {
            name: categoryName,
            description: categoryDescription,
        };
        console.log("employeeData",employeeData);
        

        try {
            const response = await axios.post(api.api + "safetyItems", employeeData);

            if (response.status === 200) {
                swal("Safety Item successfully Created");
                setCategoryName('');
                setCategoryDescription('');
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
                                    <label htmlFor="exampleFormControlInput2" className="form-label">Safety Item Name <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" id="exampleFormControlInput2" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="" />
                                    {errors.categoryName && <small className="text-danger">{errors.categoryName}</small>}
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label">Safety Item Description <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" id="exampleFormControlInput3" value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} placeholder="" />
                                    {errors.categoryDescription && <small className="text-danger">{errors.categoryDescription}</small>}
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

export default SafetyItemsForm;