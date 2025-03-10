import { Select } from 'antd';
// import 'antd/dist/antd.css'
import React, { useEffect, useState } from 'react';
import CapturePhoto from '../TicketProcess/CapturePhoto';
import moment from 'moment';
import axiosInstance from '../../../services/AxiosInstance';
import Autocomplete from '../TicketProcess/AutoComplete';

const DynamicForm = ({ customerList, errors = {}, handleOnChangeTable, inputData = {}, fields, handleOnChange, files = [], handleRemoveFile, setFiles, prevStateData, CurrentProcess = {} }) => {
    const [selectOptions, setSelectOptions] = useState({});
    const [showCapture, setShowCapture] = useState(false)
    const [captureField, setCaptureField] = useState({});
    const [selectedCompanyName, setSelectedCompanyName] = useState('');

    const handleCompanyNameChange = (value) => {
        setSelectedCompanyName(value);
        handleOnChange({ target: { name: "CompanyName", value } });
    };

    const filteredClientNames = selectedCompanyName
        ? customerList
              .filter(x => x.companyName.toLowerCase() === selectedCompanyName.toLowerCase())
              .map(x => x.name)
        : [];


    useEffect(() => {
        fields.forEach(field => {
            if (field.type === 'select' && field.apiEndpoint) {
                if (field.query) {
                    fetchOptionsQuery(field.name, field.apiEndpoint, field.query);
                } else {
                    // fetchOptions(field.name, field.apiEndpoint);
                }

            }
        });
    }, [fields, inputData]);

    useEffect(() => {
        fields.forEach(field => {
            if (field.type === 'select' && field.apiEndpoint) {
                fetchOptions(field.name, field.apiEndpoint);

            }
        });
    }, [fields]);


    const handleOnChangeRadio = (field, e) => {
        const op = field.options && field.options.filter((one) => one.value == e.target.value)
        op && op.forEach(option => {
            if (option.apiEndpoint) {
                fetchOptions(field.name, option.apiEndpoint);
            }
        });
        handleOnChange({ target: { name: e.target.name, value: e.target.value } })
    }

    const handleFileChange = (e) => {
        handleOnChange({ target: { name: e.target.name, value: e.target.files } })
    }




    const getDataString = (field) => {
        let str = '';
        if (field.value) {
            const keys = Object.keys(field.value.Data)
            str = '';
            keys.forEach((key) => {
                str = str + `${key}\t:\t${field.value.Data[key]}\n`
            })

        }
        return str;
    }

    const fetchOptions = async (fieldName, apiEndpoint) => {
        try {
            const response = await fetch(apiEndpoint);
            let data = await response.json();
            data = data.map((one) => { return { label: one.name, value: one.name } })
            setSelectOptions(prevOptions => ({
                ...prevOptions,
                [fieldName]: data
            }));
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const fetchOptionsQuery = async (fieldName, apiEndpoint, query) => {
        try {
            const params = inputData[query] ? inputData[query].map(x => x.value) : []
            const response = await axiosInstance.put(apiEndpoint, { [query]: params });
            let data = response.data;
            data = data.map((one) => { return { label: one.name, value: one.name } })
            setSelectOptions(prevOptions => ({
                ...prevOptions,
                [fieldName]: data
            }));
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const disableCheck = (field) => {
        let isdisable = false
        if (field.disable == 'isExist') {
            if (prevStateData[field.name]) {
                isdisable = true;
            }
        }
        if (field.disable == true) {
            if (prevStateData[field.name]) {
                isdisable = true;
            }
        }
        return isdisable
    }

    const getFileName = (name) => {
        const all = [...files]
        if (all.length > 0) {
            const file = all.find(x => x.name.startsWith(name));
            if (file) {
                let fileName = file.name;
                fileName = fileName.split('_');
                fileName = name + "_" + (parseInt(fileName[1]) + 1)
                return fileName
            }
            return name + "_1"
        } else {
            return name + "_1"
        }

    }

    const handleUploadJobDoc = (field) => {
        let link = document.createElement('input');
        link.setAttribute('type', 'file');
        link.setAttribute('name', 'JobList');
        document.body.appendChild(link);
        link.click();
        link.onchange = function (e) {
            const originalFile = e.currentTarget.files[0];
            const originalFileName = originalFile.name;

            // Extract the file extension
            const fileExtension = originalFileName.split('.').pop();
            // Create a new File object with the desired name and the original file's properties
            const newFile = new File([originalFile], getFileName(field.name) + "." + fileExtension, {
                type: originalFile.type,
                lastModified: originalFile.lastModified
            });

            // Add the new file to your files array
            setFiles([...files, newFile]);
            //   e.currentTarget.files[0]
        }
        document.body.removeChild(link);
    }

    const renderField = (field) => {
        switch (field.type) {
            case "autocomplete":
                if (field.name == "CompanyName") {
                    const name=customerList.filter(x=>!inputData["ClientName"]||(x.companyName &&inputData["ClientName"] && x.name.toLowerCase().startsWith(inputData["ClientName"].toLowerCase()))).map(x=>x.companyName)
                    return <div className="col-lg-4 mb-3">
                    <Autocomplete
                        auto={true}
                        inputData={inputData}
                        name="CompanyName"
                        handleOnChange={(e) => handleCompanyNameChange(e.target.value)}
                        suggestions={[...new Set(customerList.map(x => x.companyName))]}
                    />
                </div>
                }else if(field.name=="ClientName"){
                    const name=customerList.filter(x=>!inputData["CompanyName"] || (x.name && inputData["CompanyName"] && x.companyName.toLowerCase().startsWith(inputData["CompanyName"].toLowerCase()))).map(x=>x.name)
                    return <div className="col-lg-4 mb-3">
                    <input
                        type="text"
                        name="ClientName"
                        onChange={handleOnChange}
                        value={inputData["ClientName"] || ''}
                        disabled={!selectedCompanyName} // Disable if no company is selected
                        placeholder="Enter or select client name"
                        list="clientNamesList"
                        style={{padding: "8px", border: "1px solid #ccc", borderRadius: "5px", width: "100%"}}
                    />
                    <datalist id="clientNamesList">
                        {filteredClientNames.map((name, index) => (
                            <option key={index} value={name} />
                        ))}
                    </datalist>
                </div>
                
                }else{
                    return <></>
                }

            case 'text':
            case 'email':
            case 'password':
            case 'number':
            case 'color':

                return (
                    <div className="col-lg-4 mb-3">
                        <input
                        value={inputData[field.name]?inputData[field.name]:''}
                            // multiple={field.multiple}
                            onChange={handleOnChange}
                            type={field.type}
                            className="form-control"
                            id="val-username"
                            name={field.name}
                            placeholder={field.placeholder || ''}
                        />
                        <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                        >
                            {errors[field.name] && errors[field.name]}
                        </div>
                    </div>

                );
            case 'date':
                return (
                    <div className="col-lg-4 mb-3">
                        <input
                            defaultValue={prevStateData && prevStateData[field.name] ? moment(new Date(prevStateData[field.name])).format('YYYY-MM-DD') : ''}
                            disabled={disableCheck(field)}
                            // multiple={field.multiple}
                            onChange={(e) => handleOnChange({ target: { value: new Date(e.target.value), name: field.name } })}
                            type={field.type}
                            className="form-control"
                            id="val-username"
                            name={field.name}
                            placeholder={field.placeholder || ''}
                        />
                        <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                        >
                            {errors[field.name] && errors[field.name]}
                        </div>
                    </div>
                );
            case "attachement":
                const file = files.filter(x => x.name.startsWith(field.name))
                return (
                    <div className="col-lg-4 mb-3">
                        {<>  {field.label}<svg onClick={() => handleUploadJobDoc(field)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M14.7364 2.76181H8.0844C6.0044 2.75381 4.3004 4.41081 4.2504 6.49081V17.2278C4.2054 19.3298 5.8734 21.0698 7.9744 21.1148C8.0114 21.1148 8.0484 21.1158 8.0844 21.1148H16.0724C18.1624 21.0408 19.8144 19.3188 19.8024 17.2278V8.03781L14.7364 2.76181Z" stroke="#130F26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14.4746 2.75012V5.65912C14.4746 7.07912 15.6236 8.23012 17.0436 8.23412H19.7976" stroke="#130F26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M11.6406 9.90881V15.9498" stroke="#130F26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.9864 12.2643L11.6414 9.9093L9.29639 12.2643" stroke="#130F26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg></>}

                        <ul >
                            {file.map((file, index) => (
                                <li key={index} >
                                    {/* <img width={100} height={50} src={URL.createObjectURL(file)} alt={`GroupPhoto-${index}`} /> */}
                                    <span>{file.name}</span>
                                    <a
                                        style={{ color: 'blue', cursor: 'pointer' }}
                                        className="m-1 small color-dark-text-primary"
                                        onClick={() => handleRemoveFile(file, index)}
                                    >
                                        Remove
                                    </a>
                                    <a style={{ color: 'blue', cursor: 'pointer' }}
                                        className="m-1 small color-dark-text-primary"
                                        onClick={() => { }}
                                    >
                                        View
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            case 'file':
                const file1 = files.filter(x => x.name.startsWith(field.name))
                return (
                    <div className="col-lg-4 mb-3">
                        <input
                            accept="image/png, image/jpeg"
                            multiple={field.multiple}
                            onChange={(e) => {
                                const arr = []
                                const files1 = e.currentTarget.files;
                                for (let index = 0; index < files1.length; index++) {
                                    const originalFile = files1[index];
                                    const originalFileName = originalFile.name;

                                    // Extract the file extension
                                    const fileExtension = originalFileName.split('.').pop();
                                    const newFile = new File([originalFile], getFileName(field.name) + "." + fileExtension, {
                                        type: originalFile.type,
                                        lastModified: originalFile.lastModified
                                    });
                                    arr.push(newFile);
                                }
                                setFiles([...files, ...arr]);
                                // setFiles([...files, ...e.target.files])
                            }}
                            type={field.type}
                            className="form-control"
                            id="val-username"
                            name={field.name}
                            placeholder={field.placeholder || ''}
                        />
                        <div className="mt-3">
                            <ul className="list-group list-group-sm">
                                {file1.length > 0 ? (
                                    file1.map((file, index) => (
                                        <li key={index} className="list-group-item list-group-item-sm d-flex justify-content-between align-items-center">
                                            <img width={100} height={50} src={URL.createObjectURL(file)} alt={`GroupPhoto-${index}`} />
                                            {file.name}
                                            <span
                                                className="btn btn-danger btn-sm small"
                                                onClick={() => handleRemoveFile(file, index)}
                                            >
                                                Remove
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    <></>
                                    // <li className="list-group-item">No docs uploaded yet.</li>
                                )}
                            </ul>
                        </div>

                    </div>
                );
            case 'capture':
                const file2 = files.filter(x => x.name.startsWith(field.name))
                return (
                    <div className="col-lg-4 mb-3 ">
                        <div >
                            <ul className="list-group list-group-sm">
                                {
                                    file2.map((file, index) => (
                                        <li key={index} className="list-group-item list-group-item-sm d-flex justify-content-between align-items-center">
                                            <img width={100} height={50} src={URL.createObjectURL(file)} alt={`GroupPhoto-${index}`} />
                                            {file.name}
                                            <span
                                                className="btn btn-danger btn-sm small"
                                                onClick={() => handleRemoveFile(file, index)}
                                            >
                                                X
                                            </span>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                        >
                            {errors[field.name] && errors[field.name]}
                        </div>
                        <div>
                            <button onClick={() => { setShowCapture(true); setCaptureField(field) }} style={{ marginLeft: 50, marginTop: 'auto' }} className="btn btn-sm btn-warning ml-4">Click Camera</button>
                        </div>
                    </div>
                );
            case 'radio':
                return <div className="col-lg-4 mb-3" >
                    {field.options.map(option => (
                        <label key={option.value}>
                            &nbsp;&nbsp;&nbsp;<input
                                onChange={(e) => handleOnChangeRadio(field, { target: { name: e.currentTarget.name, value: option.value } })}
                                type={field.type}
                                name={option.name}
                            //value={option.value}
                            />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {`${option.label}`}
                        </label>

                    ))}
                    <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                    >
                        {errors[field.name] && errors[field.name]}
                    </div>
                </div>
            case 'checkbox':
                return <div className="col-lg-4 mb-3" >
                    {field.options.map(option => (
                        <label key={option.value}>
                            &nbsp;&nbsp;&nbsp;<input
                                onChange={(e) => handleOnChangeRadio(field, { target: { name: e.currentTarget.name, value: e.currentTarget.checked } })}
                                type={field.type}
                                name={option.name}
                            //value={option.value}
                            />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {`${option.label}`}
                        </label>

                    ))}
                    <div
                        id="val-username1-error"
                        className="invalid-feedback animated fadeInUp"
                        style={{ display: "block" }}
                    >
                        {errors[field.name] && errors[field.name]}
                    </div>
                </div>
            case 'select':
                return (
                    <div className="col-lg-4 mb-3">
                        <Select
                            style={{ width: '100%' }}
                            mode={(inputData.AssignRole == "employee" || field.multiple ? 'multiple' : "")}
                            options={selectOptions[field.name] ? selectOptions[field.name].map((op) => { return { label: op.label, value: op.value } }) : []}
                            onSelect={(value, all) => {
                                if (inputData[field.name] && (inputData.AssignRole == "employee" || field.multiple)) {
                                    inputData[field.name].push(all)
                                } else {
                                    inputData[field.name] = [all]
                                }
                                // if(inputData[field.name] && inputData[field.name].length>0){
                                //     handleOnChange({ target: { name: "TeamLead", value: inputData[field.name][0].value } })  
                                // }
                                handleOnChange({ target: { name: field.name, value: inputData[field.name] } })
                            }}
                            onDeselect={(value, all) => {
                                if (inputData[field.name]) {
                                    inputData[field.name] = inputData[field.name].filter((a) => a.value !== all.value);
                                }
                                handleOnChange({ target: { name: field.name, value: inputData[field.name] } })
                            }}
                        />
                        <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                        >
                            {errors[field.name] && errors[field.name]}
                        </div>
                        {inputData.AssignRole == "employee" && inputData[field.name] && inputData[field.name].length > 1 && <div className='mt-1'>
                            <><label>Choose Team Lead : </label><br></br>
                                {inputData[field.name].map(option => (
                                    <label key={option.value}>
                                        &nbsp;&nbsp;&nbsp;<input
                                            onChange={(e) => handleOnChange({ target: { name: "TeamLead", value: option.value } })}
                                            type='radio'
                                            name="TeamLead"
                                            defaultChecked={inputData.TeamLead == option.value}
                                        //value={option.value}
                                        />
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {`${option.label}`}
                                    </label>
                                ))}</>
                        </div>}
                    </div>
                );
            case 'phone':
                return (
                    <div className="col-lg-4 mb-3">
                        <input
                            className='form-control'
                            type="tel"
                            name={field.name}
                            value={inputData[field.name]?inputData[field.name]:''}
                            onChange={handleOnChange}
                            placeholder="Enter phone number"
                        />
                        <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                        >
                            {errors[field.name] && errors[field.name]}
                        </div>
                    </div>
                );
            // case 'file':
            //     return (
            //         <input
            //             type="file"
            //             name={field.name}
            //             onChange={handleFileChange}
            //             multiple
            //         />
            //     );
            case 'textarea':
                return (
                    <div className="col-lg-4 mb-3">
                        <textarea
                            // cols={20}
                            // rows={5}
                            value={field.disable ? getDataString(field) : inputData[field.name]}
                            disabled={field.disable}
                            className='form-control'
                            onChange={handleOnChange}
                            name={field.name}
                            placeholder={field.placeholder || ''}
                        />
                        <div
                            id="val-username1-error"
                            className="invalid-feedback animated fadeInUp"
                            style={{ display: "block" }}
                        >
                            {errors[field.name] && errors[field.name]}
                        </div>
                    </div>
                );
            case 'table':
                if (prevStateData.FieldData && prevStateData.FieldData.TimeEstimate) {
                    return (
                        <div className="col-lg-12 mb-3">
                            <table class="table table-sm table-responsive">
                                <thead>
                                    <tr className='text-center'>
                                        <th scope="col">Employee Name</th>
                                        <th scope="col">Availbale( Check Out )</th>
                                        <th scope="col">Work Done Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prevStateData.FieldData && prevStateData.FieldData.TimeEstimate && prevStateData.FieldData.TimeEstimate.map((one) => {
                                        return <tr className='text-center'>
                                            <td>{one.User}{one.IsAlready ? " ( Already checked out ) " : ''}</td>
                                            <td><input disabled={one.IsAlready} checked={one.IsAlready} onChange={(e) => handleOnChangeTable("TimeEstimate", one.User, { target: { name: e.currentTarget.name, value: e.currentTarget.checked } })} placeholder='enter...' name={'Available'} type='checkbox' /></td>
                                            <td><input disabled={one.IsAlready} onChange={(e) => handleOnChangeTable("TimeEstimate", one.User, e)} placeholder='enter...' name={'WorkDesc'} className='form-control form-control-sm' type='text' /></td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                            <div
                                id="val-username1-error"
                                className="invalid-feedback animated fadeInUp"
                                style={{ display: "block" }}
                            >
                                {errors[field.name] && errors[field.name]}
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className="col-lg-12 mb-3">
                            <table class="table table-sm table-responsive">
                                <thead>
                                    <tr className='text-center'>
                                        <th scope="col">Employee Name</th>
                                        <th scope="col">Availbale( Check In )</th>
                                        {/* <th scope="col">Time Estimate(In Hrs)</th> */}
                                        <th scope="col">Work Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prevStateData.FieldData && prevStateData.FieldData.AssignPerson && prevStateData.FieldData.AssignPerson.map((one) => {
                                        return <tr className='text-center'>
                                            <td>{one.value}{one.IsAlready ? " ( Already checked in ) " : ''}</td>
                                            <td><input disabled={one.IsAlready} checked={one.IsAlready} onChange={(e) => handleOnChangeTable("TimeEstimate", one.value, { target: { name: e.currentTarget.name, value: e.currentTarget.checked } })} placeholder='enter...' name={'Available'} type='checkbox' /></td>
                                            {/* <td><input onChange={(e) => handleOnChangeTable("TimeEstimate", one.value, e)} placeholder='enter...' name={'Hours'} className='form-control form-control-sm' type='number' /></td> */}
                                            <td><input disabled={one.IsAlready} onChange={(e) => handleOnChangeTable("TimeEstimate", one.value, e)} placeholder='enter...' name={'WorkDesc'} className='form-control form-control-sm' type='text' /></td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                            <div
                                id="val-username1-error"
                                className="invalid-feedback animated fadeInUp"
                                style={{ display: "block" }}
                            >
                                {errors[field.name] && errors[field.name]}
                            </div>
                        </div>
                    );
                }

            default:
                return null;
        }
    };

    return (
        <>
            <div className="form-group  row">
                <CapturePhoto field={captureField} show={showCapture} onHide={() => setShowCapture(false)} getFile={(event) => {
                    setFiles([...files, ...event.Files]);
                    handleOnChange({ target: { name: "Location", value: event.Location } })
                    setShowCapture(false)
                }} />
                {fields.map(field => (
                    <>
                        {!CurrentProcess[field.disable] && <> {field.type == 'table' ? <br /> : <></>} <strong
                            className="col-lg-2 col-form-label"
                            htmlFor="val-username"
                        >
                            {field.label}
                            {field.name !== 'DueDate' && <span className="text-danger">*</span>}
                        </strong>
                            {renderField(field)}</>}
                    </>
                ))}
            </div>

        </>

    );
};

export default DynamicForm;
