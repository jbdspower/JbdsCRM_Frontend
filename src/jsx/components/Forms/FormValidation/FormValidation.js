import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../../../layouts/PageTitle";
import { Formik } from "formik";
import * as Yup from "yup";
import DynamicForm from "../DynamicForm";
import moment, { min } from "moment";
import Webcam from "react-webcam";
import swal from "sweetalert";
import axios from 'axios';
import api from '../../../config.json';
import { getLocation } from "../../Location/GetLocation";

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Your username must consist of at least 3 characters ")
    .max(50, "Your username must consist of at least 3 characters ")
    .required("Please enter a username"),
  password: Yup.string()
    .min(5, "Your password must be at least 5 characters long")
    .max(50, "Your password must be at least 5 characters long")
    .required("Please provide a password"),
});

const FormValidation = ({ Controls = [], Fields = [], onSubmit, name, prevStateData, currentState, CurrentProcess = {} }) => {
  const [showPassword, setShowPassword] = useState(false);
  const userDetail = JSON.parse(localStorage.getItem('userDetails'));
  const [inputData, setInputData] = useState({});
  const [interv, setInterv] = useState(0);
  const [timer, setTimer] = useState(0);
  const [files, setFiles] = useState([])
  const [cameraCapture, setCameraCature] = useState(false);
  const [captureImage, setCaptureImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [customerList, setCustomerList] = useState([]);
  const webcamRef = React.useRef(null);
  useEffect(() => {
    if (prevStateData && prevStateData.EventLogs && prevStateData.EventLogs.length > 0) {
      const obj = prevStateData.EventLogs.find((one) => one.User == userDetail.name)
      if (obj) {
        setTimer(new Date().getTime() - new Date(obj.CheckInTime).getTime())
        setInterv(
          setInterval(() => {
            setTimer((t) => t + 1000);
          }, 1000)
        );
      }
    }
    //return clearInterval(interv)
  }, [prevStateData])
  useEffect(()=>{
  fetchAllProducts()
  },[])
 
  const handleOnChange = (e) => {
    const { name, value } = e.target
    console.log(name, value, "------------------")
    const obj = { ...inputData };
    obj[name] = value;
    if (name == "AssignPerson") {
      obj["TeamLead"] = value.length > 0 ? value[0].value : '';
    }
    if (name == "CompanyName") {
      const cusOBJ=customerList.find(x=>x.companyName==value)
      //  obj.ClientName=cusOBJ?cusOBJ.name:obj.ClientName?obj.ClientName:""
      obj.ClientMobNumber=cusOBJ?cusOBJ.mobileNumber:obj.ClientMobNumber?obj.ClientMobNumber:""
      obj.ClientEmailId=cusOBJ?cusOBJ.email:obj.ClientEmailId?obj.ClientEmailId:""
      obj.Designation=cusOBJ?cusOBJ.designation:obj.Designation?obj.Designation:""
      obj.Department=cusOBJ?cusOBJ.department:obj.Department?obj.Department:""
       obj.ClientAddress=cusOBJ?cusOBJ.address:obj.ClientAddress?obj.ClientAddress:""
    }
    if (name == "ClientName") {
      const cusOBJ=customerList.find(x=>x.name==value)
      // obj.CompanyName=cusOBJ?cusOBJ.companyName:obj.CompanyName?obj.CompanyName:""
      obj.ClientMobNumber=cusOBJ?cusOBJ.mobileNumber:obj.ClientMobNumber?obj.ClientMobNumber:""
      obj.ClientEmailId=cusOBJ?cusOBJ.email:obj.ClientEmailId?obj.ClientEmailId:""
      obj.Designation=cusOBJ?cusOBJ.designation:obj.Designation?obj.Designation:""
      obj.Department=cusOBJ?cusOBJ.department:obj.Department?obj.Department:""
      obj.ClientAddress=cusOBJ?cusOBJ.address:obj.ClientAddress?obj.ClientAddress:""
    }
    setInputData(obj);
  }

  const fetchAllProducts = () => {
    axios.get(`${api.api}customer`)
        .then((result) => {
          setCustomerList(result.data);
        })
        .catch((err) => {
            console.log(err);
        });
};

  const handleOnChangeTable = (key, user, e) => {
    const { name, value } = e.target
    const obj = { ...inputData };
    if (obj[key]) {
      const index = obj[key].findIndex(x => x.User == user);
      if (index > -1) {
        obj[key][index][name] = value
      }
      else {
        obj[key].push({ User: user, [name]: value });
      }
    } else {
      obj[key] = [{ User: user, [name]: value }];
    }
    setInputData(obj);
  }
  const handleRemoveFile = (file, indexToRemove) => {
    setFiles(files.filter((x) => x.name !== file.name));
  };



  const dateDiffInHHMM = (ms) => {
    // Get the difference in milliseconds
    // Convert milliseconds to hours and minutes
    const diffInHours = Math.floor(ms / (1000 * 60 * 60));
    const diffInMinutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const diffInSeconds = Math.floor((ms % (1000 * 60)) / 1000);

    // Format hours, minutes, and seconds as hh:mm:ss
    const formattedHours = String(diffInHours).padStart(2, '0');
    const formattedMinutes = String(diffInMinutes).padStart(2, '0');
    const formattedSeconds = String(diffInSeconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  const validateData = async (data = [], files = []) => {
    const validationErrors = {};
    try {
      const testObj = {}
      Fields.forEach((one) => {
        if (one.required && one.name == "AssignPerson") {
          testObj[one.name] = Yup.array().min(1).required("Required")
        }
        else if (one.required && one.name == "GroupImages") {
          if (files.length == 0) {
            testObj[one.name] = Yup.array().min(1).required("Please capture group photo or others.")
            validationErrors[one.name] = "Please capture group photo or others."
          }
        }
        else if (one.required && one.name == "TimeEstimate") {
          testObj[one.name] = Yup.array().min(1).required("Please check In and Availability")
        }
        else if (one.required) {
          if (one.disable == 'isExist' && prevStateData[one.name]) {

          }
          else if (one.type == 'phone') {
            testObj[one.name] = Yup.string()
              .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
              .required("Please enter a phone number")
          } else {
            testObj[one.name] = Yup.string().required("Required")
          }
        }
        else {
          // testObj[one.name] = Yup.string()
        }
      })
      const schema = Yup.object().shape(testObj);
      await schema.validate(data, { abortEarly: false });
      setErrors({})
      return true
      // Form is valid, handle form submission
    } catch (err) {
      // Handle validation errors

      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      throw err
    }
  }

  const handleSubmit = (control, data = {}, files = []) => {
    if (control.Validation) {
      validateData(data, files)
        .then((result) => {
          onSubmit(control, data, files)
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
        })
    } else {
      onSubmit(control, data, files)
    }
  }


  return (
    <Fragment>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-lg-12">
            <div className="card bordered-box p-0">
              <div className="card-header bg-warning">
                <h4 id="timer" className="card-title">{name}  </h4>
                <strong style={{ marginRight: 100 }} className="float-right text-black fs-4 pr-5">{currentState == "InProgress" ? `${dateDiffInHHMM(timer)}` : ''}</strong>
              </div>
              <div className="card-body ">
                <div className="form-validation">

                  <DynamicForm
                    customerList={customerList}
                    CurrentProcess={CurrentProcess}
                    errors={errors}
                    handleOnChangeTable={handleOnChangeTable}
                    prevStateData={prevStateData}
                    inputData={inputData} 
                    files={files}
                    setFiles={setFiles}
                    handleRemoveFile={handleRemoveFile}
                    handleOnChange={handleOnChange}
                    fields={Fields} />

                  <div className="mb-3 row ">
                    {Controls.map((one, idx) => {

                      const event = one.Event_To_Log.find(x => x.Event == "CameraCapture")
                      // if ((one.Control_Name == "Start Inspection") || (one.Control_Name == "Accept & Start Inspection")) {
                      //   return <><div className={event && idx == 0 ? "col-sm-6 d-flex " : "col-sm-2 d-flex"}>
                      //     <div >
                      //       <button disabled={inputData[one.disable] == true ? false : true} onClick={() => handleSubmit({ ...one }, inputData, files)} type="submit" className="btn btn-sm btn-primary mr-2">
                      //         {one.Control_Name}
                      //       </button>
                      //     </div>
                      //   </div>
                      //   </>
                      // }
                      return <><div className={event && idx == 0 ? "col-sm-6 d-flex " : "col-sm-2 d-flex"}>
                        <div >
                          <button disabled={inputData[one.disable] == true ? true : false} onClick={() => handleSubmit(one, inputData, files)} type="submit" className="btn btn-sm btn-primary mr-2">
                            {one.Control_Name}
                          </button>
                        </div>
                      </div>
                      </>
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default FormValidation;
