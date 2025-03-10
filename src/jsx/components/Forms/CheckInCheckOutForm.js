import React, { useEffect, useState } from 'react';
import './CheckInCheckOut.css';
import moment from 'moment';
import Stepper from '../TicketProcess/Stepper';
import config from '../../../appConfig.json'
import FileUpload from '../../FileUpload/FileUpload';
import { Select } from 'antd';
import CustomSelect from './CustomSelect';
import axiosInstance from '../../../services/AxiosInstance';
import _ from 'lodash'
import { Button } from "antd"; // Import Button from Ant Design
import { DownloadOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import notoFont from "./NotoSans-Regular.js";


const CheckInCheckOutForm = ({ setCustomInput, setFiles, allFiles = [], info = {}, ticketData = {}, customInput = {} }) => {
    const [category, setCategory] = useState([])
    const [product, setProduction] = useState([])
    const [machineryTool, setMachineryTool] = useState([])
    const [manpower, setManpower] = useState([])
    const [consumables, setConsumables] = useState([])

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Add Logo
        const logoUrl = "/jbds_power_logo.jpg"; // Replace with actual URL
        doc.addImage(logoUrl, "PNG", 10, 10, 40, 15); // Positioning (x, y, width, height)
        
        let y = 30; // Start position after the logo

        // Title
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("JBDS Power Project International power limited", 105, y, { align: "center" });
        y += 10;

        // Divider Line
        doc.setDrawColor(0); // Black color
        doc.setLineWidth(0.5);
        doc.line(10, y, 200, y);
        y += 6;

        // Section - Client Details
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Client Details", 10, y);
        y += 6;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${info.ClientName}`, 10, y);
        y += 6;
        doc.text(`Company: ${info.CompanyName}`, 10, y);
        y += 6;
        doc.text(`Email: ${info.ClientEmailId}`, 10, y);
        y += 6;
        doc.text(`Phone: ${info.ClientMobNumber}`, 10, y);
        y += 6;
        doc.text(`Address: ${info.ClientAddress}`, 10, y);
        y += 10;

        // Divider
        doc.line(10, y, 200, y);
        y += 6;

        // Section - Ticket Details
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Ticket Details", 10, y);
        y += 6;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Status: ${ticketData.Status || '-'}`, 10, y);
        y += 6;
        doc.text(`Priority: ${ticketData.Priority || '-'}`, 10, y);
        y += 6;
        doc.text(`PO Ref No: ${info.PORefNo || "-"}`, 10, y);
        y += 6;
        doc.text(`Invoice Ref No: ${info.InvoiceRefNo || "-"}`, 10, y);
        y += 10;

        // Divider
        doc.line(10, y, 200, y);
        y += 6;

        // Section - Complaint Description
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Complaint Description", 10, y);
        y += 6;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(info.ComplaintDesc || "-", 10, y, { maxWidth: 180 });
        y += 10;

        // Divider
        doc.line(10, y, 200, y);
        y += 6;

        // Section - Attachments (Image URLs)
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Attachments", 10, y);
        y += 6;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        if (info.Files && info.Files.length > 0) {
            info.Files.forEach((file, index) => {
                doc.text(`${index + 1}. ${config.fileUrl + file.filename}`, 10, y);
                y += 6;
            });
        } else {
            doc.text("No attachments available.", 10, y);
            y += 6;
        }

        // Save the PDF
        doc.save("ticket_details.pdf");
    };


      

    useEffect(() => {
        getCategory()
        getSafetyItems()
        getProduct()
        getManpower()
        gettools()
    }, [])

    const getAssignPersons = () => {
        let assignedPerson = [];
        ticketData.SR_Data_Logs && ticketData.SR_Data_Logs.forEach(x => {
            if (x.FieldData && x.FieldData.AssignPerson) {
                assignedPerson = [...assignedPerson, ...x.FieldData.AssignPerson]
            }
        })
        return _.uniqBy(assignedPerson, "value")
    }

    const getCategory = () => {
        axiosInstance.get(config.api + "categroy")
            .then((result) => {
                setCategory(result.data);
            })
            .catch((errr) => {
                console.log(errr);
            })
    }
    const getProduct = () => {
        axiosInstance.get(config.api + "product")
            .then((result) => {
                setProduction(result.data);
            })
            .catch((errr) => {
                console.log(errr);
            })
    }
    const getManpower = () => {
        axiosInstance.get(config.api + "manpower")
            .then((result) => {
                setManpower(result.data);
            })
            .catch((errr) => {
                console.log(errr);
            })
    }
    const getSafetyItems = () => {
        axiosInstance.get(config.api + "safetyItems")
            .then((result) => {
                setConsumables(result.data);
            })
            .catch((errr) => {
                console.log(errr);
            })
    }

    const gettools = () => {
        axiosInstance.get(config.api + "tool")
            .then((result) => {
                setMachineryTool(result.data);
            })
            .catch((errr) => {
                console.log(errr);
            })
    }



    const dueDates = () => {
        const arr = []
        if (ticketData && ticketData.SR_Data_Logs) {
            ticketData.SR_Data_Logs.forEach((x) => {
                if (x.UpdateData && x.UpdateData.length > 0) {
                    x.UpdateData.forEach((dueDate) => {
                        if (dueDate.DueDate) {
                            arr.push({ date: dueDate.DueDate, title: moment(dueDate.DueDate).format('DD-MM-YYYY') })
                        }
                    })
                }
            })
        }
        // alert(JSON.stringify(arr))
        return arr
    }

    const getCurrentStep = () => {
        const dueDates1 = dueDates();
        let state = "No Due Date"
        dueDates1.forEach((x) => {
            if (new Date(x.date) >= new Date()) {
                state = x.title
            }
        })
        return state;
    }

    const downloadFileURL = (filename) => {
        const fileUrl = `${config.fileUrl}${filename}`; // Construct full file URL
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = filename; // Ensures it prompts for download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    

    const downloadFile = (file) => {
        // Assuming 'file' is the file object containing the blob
        const url = URL.createObjectURL(file);

        // Create an anchor element and trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.name); // The file name to download
        document.body.appendChild(link);
        link.click();

        // Clean up the object URL after download
        link.parentNode.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const reports = [
        { name: "MOMReport", label: "MOM Report" },
        { name: "PDIReport", label: "PDI Report" },
        { name: "InstallationReport", label: "Installation Report" },
        { name: "ServiceReport", label: "Service Report" },
        { name: "CommissioningReport", label: "Commissioning Report" },
        { name: "DAPReport", label: "DAP Report" },
        { name: "ProjectHandoverReport", label: "Project Handover Report" }]

    const customInputChange = (e) => {
        const obj = { ...customInput }
        obj[e.currentTarget.name] = e.currentTarget.value

        setCustomInput(obj)
    }

    const getFileName = (name) => {
        const all = customInput.Files ? [...customInput.Files] : []
        if (all.length > 0) {
            const file = all.find(x => x.name && x.name.startsWith(name));
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
            if (customInput.Files) {
                customInputChange({ currentTarget: { name: "Files", value: [...customInput.Files, newFile] } })
            } else {
                customInputChange({ currentTarget: { name: "Files", value: [newFile] } })
            }
            // Add the new file to your files array
            // setFiles([...files, newFile]);
            //   e.currentTarget.files[0]
        }
        document.body.removeChild(link);
    }

    const handleRemoveFile = (file) => {
        let all = customInput.Files ? [...customInput.Files] : []

        all = all.filter((x) => x.name !== file.name);
        customInputChange({ currentTarget: { name: "Files", value: all } })
    };


    return (

        <div className='p-2'>
            <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownloadPDF}
                style={{ margin: "10px", float: "right"}}
            >
            </Button>

			<div id="ticket-list-container" style={{ maxHeight: "calc(100%)", overflowY: "auto" }}>
            <div className='row'>
                <div className='col-sm-3'>
                    <strong className='textStyleStrong'>Client Detail:</strong><br />
                    <div className='bordered-box'>
                        <strong className='p-1 textStyleStrong'>Name: {info.ClientName}</strong><br />
                        <strong className='p-1 textStyleStrong'>Company Name: {info.CompanyName}</strong><br />
                        <strong className='p-1 textStyleStrong'>Company Division: {info.CompanyDivision && info.CompanyDivision.length > 0 ? info.CompanyDivision[0].value : "-"}</strong><br />
                        <strong className='p-1 textStyleStrong'>Email ID: {info.ClientEmailId}</strong><br />
                        <strong className='p-1 textStyleStrong'>Mobile No: {info.ClientMobNumber}</strong><br />
                        <strong className='p-1 textStyleStrong'>Address: {info.ClientAddress}</strong><br />
                    </div>
                </div>
                <div className='col-sm-3'>
                    <strong className='textStyleStrong'>Ticket Detail:</strong><br />
                    <div className='bordered-box'>
                        <strong className='p-1 textStyleStrong'>Ticket Status: {ticketData.Status || '-'}</strong><br />
                        <strong className='p-1 textStyleStrong'>Ticket Mode: {info.TicketMode && info.TicketMode.length > 0 ? info.TicketMode[0].value : '-'}</strong><br />
                        <strong className='p-1 textStyleStrong'>Priority: {ticketData.Priority || '-'}</strong><br />
                        <strong className='p-1 textStyleStrong'>PO Ref No: {info.PORefNo || "-"}</strong><br />
                        <strong className='p-1 textStyleStrong'>Invoice Ref No: {info.InvoiceRefNo || '-'}</strong><br />
                        <strong className='p-1 textStyleStrong'>So Ref No: {info.SORefNo || "-"}</strong><br />
                    </div>
                </div>
                <div className='col-sm-3'>
                    <strong className='textStyleStrong'>Client Requirement / Complaint</strong><br />
                    <div className='bordered-box'>
                        <div className='row p-1'>
                            <div className='col-sm-6'>
                                <strong className='p-1 textStyleStrong'>Description: </strong>
                            </div>
                            <div className='col-sm-6 inner-bordered-box'>
                                <strong className='textStyleStrong'>
                                    {info.ComplaintDesc}
                                </strong>
                            </div>
                        </div>
                        <div className='row p-1'>
                            <div className='col-sm-4'>
                                <strong className='p-1 textStyleStrong'>Attachments: </strong><br />
                            </div>
                            {/* <div className='col-sm-8'>
                                <FileUpload setFiles={setFiles} files={allFiles.filter(x=>x.startsWith("UploadImages"))} fileName="UploadImages" />
                            </div> */}
                        </div>
                        <div className='row p-1'>
                            {info.Files && info.Files.map((one, index) => {
                                return (
                                    <div className='col-sm-2 d-flex align-items-center' key={index}>
                                        {/* Attachment icon */}
                                        <i className="fa fa-paperclip" aria-hidden="true"></i>

                                        {/* File thumbnail or icon */}
                                        <img style={{ width: 20, height: 20, marginLeft: 5 }} src={config.fileUrl + one.filename} alt={one.filename} />

                                        {/* Download icon with link */}
                                        <a href="#" onClick={() => downloadFileURL(one.filename)} style={{ marginLeft: 10 }}>
                                            <i className="fa fa-download" aria-hidden="true"></i>addddj
                                        </a>

                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </div>
                <div className='col-sm-3'>
                    <strong className='textStyleStrong'>Timeline:</strong><br />
                    <div className='bordered-box'>
                        <strong className='p-1 textStyleStrong'>Start Date : {moment(ticketData.StartDate).format('DD-mm-yyyy')}</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                        <strong className='p-1 textStyleStrong'>Due Date : {ticketData.DueDate ? moment(ticketData.DueDate).format('DD-mm-yyyy') : '-'}</strong><br />
                        Exceeded Due Dates
                        <Stepper
                            steps={dueDates()}
                            CurrentStep={getCurrentStep()}
                            Selectable={false}
                        />
                    </div>
                    {/* <div className='button-container'>
                        <button className='btn btn-sm btn-info' style={{ marginRight: 10 }}>Check In</button>
                        <button className='btn btn-sm btn-warning'>Capture</button>
                    </div> */}
                </div>
            </div>
            <div className='row'>
                <div className='col-sm-3'>
                    <div className='bordered-box1'>
                        <div className='header-with-icon bg-warning'>
                            <strong className='textStyleStrong'>Assign Ticket</strong><br />
                            <i className="fas fa-plus"></i> {/* Font Awesome Plus Icon */}
                        </div>
                        {getAssignPersons().map((x) => <><strong className='p-1 textStyleStrong'>{x.value}</strong><br /></>)}
                    </div>
                </div>
                <div className='col-sm-9'>
                    <div className='bordered-box1'>
                        <div className='header-with-icon bg-warning'>
                            <strong className='textStyleStrong'>Reports</strong><br />
                        </div>
                        <div className='row mt-3'>
                            {reports.map(report => {
                                return <div className="col-lg-6 mb-3">
                                    <div className="form-group row">
                                        <div className='col'>
                                            <label className=" col-form-label"><strong className='textStyleStrong'>{report.label}</strong><span className="text-danger">*</span></label>
                                        </div>
                                        <div className='col mt-1'> {report.label}<svg onClick={() => handleUploadJobDoc(report)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M14.7364 2.76181H8.0844C6.0044 2.75381 4.3004 4.41081 4.2504 6.49081V17.2278C4.2054 19.3298 5.8734 21.0698 7.9744 21.1148C8.0114 21.1148 8.0484 21.1158 8.0844 21.1148H16.0724C18.1624 21.0408 19.8144 19.3188 19.8024 17.2278V8.03781L14.7364 2.76181Z" stroke="#130F26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M14.4746 2.75012V5.65912C14.4746 7.07912 15.6236 8.23012 17.0436 8.23412H19.7976" stroke="#130F26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M11.6406 9.90881V15.9498" stroke="#130F26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M13.9864 12.2643L11.6414 9.9093L9.29639 12.2643" stroke="#130F26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                            <ul >
                                                {customInput.Files && customInput.Files.filter(x => (x.filename && x.filename.includes(report.name)) || (x.name && x.name.includes(report.name))).map((file, idx) => <li key={"index"} >
                                                    <span>{report.name + "_" + (idx + 1)}</span>
                                                    <a
                                                        style={{ color: 'blue', cursor: 'pointer' }}
                                                        className="m-1 small color-dark-text-primary"
                                                        onClick={() => handleRemoveFile(file)}
                                                    >
                                                        Remove
                                                    </a>
                                                    <a style={{ color: 'blue', cursor: 'pointer', marginLeft: 10 }} onClick={() => downloadFileURL(file.name || file.filename)} >
                                                        <i className="fa fa-download" aria-hidden="true"></i>
                                                    </a>
                                                    {/* <a style={{ color: 'blue', cursor: 'pointer' }}
                                                        className="m-1 small color-dark-text-primary"
                                                    // onClick={() => { }}
                                                    >
                                                        View
                                                    </a> */}
                                                </li>)}
                                            </ul>

                                        </div>
                                    </div>

                                </div>
                            })}

                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-sm-12'>
                    <div className='bordered-box1'>
                        <div className='header-with-icon bg-warning'>
                            <strong className='textStyleStrong'>Service Requirement</strong><br />
                        </div>
                        <div className='row mt-3'>
                            <div className="col-lg-6 mb-3">
                                <div className="form-group row">
                                    <div className='col'>
                                        <label className=" col-form-label"><strong className='textStyleStrong'>Select Category</strong><span className="text-danger">*</span></label>
                                    </div>
                                    <div className="col mb-3">
                                        <Select
                                            value={customInput.Category || []}
                                            mode='multiple'
                                            style={{ width: '100%' }}
                                            options={category.map((x) => { return { label: x.name, value: x.name } })}
                                            onChange={(value, all) => customInputChange({ currentTarget: { name: "Category", value: all } })}
                                        />

                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 mb-3">
                                <div className="form-group row">
                                    <div className='col'>
                                        <label className=" col-form-label"><strong className='textStyleStrong'>Add Product</strong><span className="text-danger">*</span></label>
                                    </div>
                                    <div className="col mb-3">
                                        <CustomSelect FieldName="Product" customInput={customInput} customInputChange={customInputChange} options={product.filter(x => customInput.Category && customInput.Category.some(has => has.value == x.categroy))} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <div className="col-lg-6 mb-3">
                                <div className="form-group row">
                                    <div className='col'>
                                        <label className=" col-form-label"><strong className='textStyleStrong'>Machinery / Tools</strong><span className="text-danger">*</span></label>
                                    </div>
                                    <div className="col mb-3">
                                        <CustomSelect FieldName="Tools" customInput={customInput} customInputChange={customInputChange} options={machineryTool} />

                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 mb-3">
                                <div className="form-group row">
                                    <div className='col'>
                                        <label className=" col-form-label"><strong className='textStyleStrong'>Safety Consumables Items</strong><span className="text-danger">*</span></label>
                                    </div>
                                    <div className="col mb-3">
                                        <CustomSelect FieldName="SafetyItems" customInput={customInput} customInputChange={customInputChange} options={consumables} />


                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <div className="col-lg-6 mb-3">
                                <div className="form-group row">
                                    <div className='col'>
                                        <label className=" col-form-label"><strong className='textStyleStrong'>Select Manpower</strong><span className="text-danger">*</span></label>
                                    </div>
                                    <div className="col mb-3">

                                        <CustomSelect FieldName="Manpower" customInput={customInput} customInputChange={customInputChange} options={manpower} />


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>

                <div className='col-sm-12'>
                    <div className='bordered-box1'>
                        <div className='header-with-icon bg-warning'>
                            <strong className='textStyleStrong'>Service Taken</strong><br />
                        </div>
                        <div className='row mt-3'>
                            <div className='col-sm-3'>
                                <div className='bordered-box1 p-0'>
                                    <div className='header-with-icon bg-info'>
                                        <strong className='textStyleStrong'>Product Used : </strong><br />
                                    </div>
                                    <table className='table bg-none p-0'>
                                        <thead>
                                            {customInput.Product && Object.keys(customInput.Product).map((key) => {
                                                return <tr>
                                                    <th className='th'>{key}</th><th className='col'>{customInput.Product[key]}</th>
                                                </tr>
                                            })}

                                        </thead>
                                    </table>
                                </div>
                            </div>
                            <div className='col-sm-3'>
                                <div className='bordered-box1 p-0'>
                                    <div className='header-with-icon bg-info'>
                                        <strong className='textStyleStrong'>Machinery / Tool Used : </strong><br />
                                    </div>
                                    <table className='table bg-none p-0'>
                                        <thead>
                                            {customInput.Tools && Object.keys(customInput.Tools).map((key) => {
                                                return <tr>
                                                    <th className='th'>{key}</th><th className='col'>{customInput.Tools[key]}</th>
                                                </tr>
                                            })}

                                        </thead>
                                    </table>
                                </div>
                            </div>
                            <div className='col-sm-3'>
                                <div className='bordered-box1 p-0'>
                                    <div className='header-with-icon bg-info'>
                                        <strong className='textStyleStrong'>Safety / Consumables Items Used : </strong><br />
                                    </div>
                                    <table className='table bg-none p-0'>
                                        <thead>
                                            {customInput.SafetyItems && Object.keys(customInput.SafetyItems).map((key) => {
                                                return <tr>
                                                    <th className='th'>{key}</th><th className='col'>{customInput.SafetyItems[key]}</th>
                                                </tr>
                                            })}
                                        </thead>
                                    </table>
                                </div>
                            </div>
                            <div className='col-sm-3'>
                                <div className='bordered-box1 p-0'>
                                    <div className='header-with-icon bg-info'>
                                        <strong className='textStyleStrong'>Manpower Used : </strong><br />
                                    </div>
                                    <table className='table bg-none p-0'>
                                        <thead>
                                            {customInput.Manpower && Object.keys(customInput.Manpower).map((key) => {
                                                return <tr>
                                                    <th className='th'>{key}</th><th className='col'>{customInput.Manpower[key]}</th>
                                                </tr>
                                            })}

                                        </thead>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

// const CheckInCheckOutForm = () => {
//     return (
//         <div className='p-2'>
//             <div className='row'>
//                 <div className='col-sm-4'>
//                     <strong className='textStyleStrong'>Client Detail:</strong><br />
//                     <div className='bordered-box'>
//                         <strong className='p-1 textStyleStrong'>Name: </strong><br />
//                         <strong className='p-1 textStyleStrong'>Company Name: </strong><br />
//                         <strong className='p-1 textStyleStrong'>Email ID: </strong><br />
//                         <strong className='p-1 textStyleStrong'>Mobile No: </strong><br />
//                         <strong className='p-1 textStyleStrong'>Address:</strong><br />
//                     </div>
//                 </div>
//                 <div className='col-sm-4'>
//                     <strong className='textStyleStrong'>Client Requirement / Complaint</strong><br />
//                     <div className='bordered-box'>
//                         <div className='row p-1'>
//                             <div className='col-sm-6'>
//                                 <strong className='p-1 textStyleStrong'>Description:</strong>
//                             </div>
//                             <div className='col-sm-6 inner-bordered-box'>
//                                 <strong className='textStyleStrong'>
//                                     We have to install gas genset
//                                 </strong>
//                             </div>
//                         </div>
//                         <div className='row p-1'>
//                             <div className='col-sm-4'>
//                                 <strong className='p-1 textStyleStrong'>Attachments: <i className="fas fa-paperclip"></i></strong><br />
//                             </div>
//                             <div className='col-sm-8'>
//                                 {/* Attachment handling can be implemented here */}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className='col-sm-4'>
//                     <strong className='textStyleStrong'>Timeline:</strong><br />
//                     <div className='bordered-box'>
//                         <strong className='p-1 textStyleStrong'>Start Date </strong><br />
//                         <strong className='p-1 textStyleStrong'>Due Date</strong><br />
//                     </div>
//                     <div className='button-container'>
//                         <button className='btn btn-sm btn-info' style={{ marginRight: 10 }}>Check In</button>
//                         <button className='btn btn-sm btn-warning'>Capture</button>
//                     </div>
//                 </div>
//             </div>
//             <div className='row'>
//                 <div className='col-sm-3'>
//                     <div className='bordered-box1'>
//                         <div className='header-with-icon bg-warning'>
//                             <strong className='textStyleStrong'>Assign Ticket</strong><br />
//                             <i className="fas fa-plus"></i> {/* Font Awesome Plus Icon */}
//                         </div>
//                         <strong className='p-1 textStyleStrong'>Company Name: </strong><br />
//                         <strong className='p-1 textStyleStrong'>Email ID: </strong><br />
//                         <strong className='p-1 textStyleStrong'>Mobile No: </strong><br />
//                         <strong className='p-1 textStyleStrong'>Address:</strong><br />
//                     </div>
//                 </div>
//                 <div className='col-sm-9'>
//                     <div className='bordered-box1'>
//                         <div className='header-with-icon bg-warning'>
//                             <strong className='textStyleStrong'>Task Board</strong><br />
//                         </div>
//                         <table className="table table-sm small task-table">
//                             <tbody>
//                                 <tr className='text-center'>
//                                     <td><strong className='textStyleStrong'>1. User</strong></td>
//                                     {/* <td><input placeholder='Enter...' name={'Available'} type='checkbox' /></td> */}
//                                     <td><input placeholder='Enter...' name={'WorkDesc'} className='form-control form-control-sm bordered-input' type='text' /></td>
//                                     <td><button className='btn btn-sm btn-info' >Submit</button></td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//             <div className='row'>
//                 <div className='col-sm-4'>
//                     <div className='bordered-box1'>
//                         <div className='header-with-icon bg-warning'>
//                             <strong className='textStyleStrong'>Add Product Detail</strong><br />
//                             <i className="fas fa-plus"></i> {/* Font Awesome Plus Icon */}
//                         </div>
//                         <strong className='p-1 textStyleStrong'>Company Name: </strong><br />
//                         <strong className='p-1 textStyleStrong'>Email ID: </strong><br />
//                         <strong className='p-1 textStyleStrong'>Mobile No: </strong><br />
//                         <strong className='p-1 textStyleStrong'>Address:</strong><br />
//                     </div>
//                 </div>
//                 <div className='col-sm-4'>
//                     <div className='bordered-box1'>
//                         <div className='header-with-icon bg-warning'>
//                             <strong className='textStyleStrong'>Add Manpower Detail</strong><br />
//                             <i className="fas fa-plus"></i> {/* Font Awesome Plus Icon */}
//                         </div>
//                         <strong className='p-1 textStyleStrong'>Company Name: </strong><br />
//                         <strong className='p-1 textStyleStrong'>Email ID: </strong><br />
//                         <strong className='p-1 textStyleStrong'>Mobile No: </strong><br />
//                         <strong className='p-1 textStyleStrong'>Address:</strong><br />
//                     </div>
//                 </div>
//                 <div className='col-sm-4'>
//                     <div className='bordered-box1'>
//                         <div className='header-with-icon bg-warning'>
//                             <strong className='textStyleStrong'>Add Other Detail</strong><br />
//                             <i className="fas fa-plus"></i> {/* Font Awesome Plus Icon */}
//                         </div>
//                         <strong className='p-1 textStyleStrong'>Company Name: </strong><br />
//                         <strong className='p-1 textStyleStrong'>Email ID: </strong><br />
//                         <strong className='p-1 textStyleStrong'>Mobile No: </strong><br />
//                         <strong className='p-1 textStyleStrong'>Address:</strong><br />
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

export default CheckInCheckOutForm;
