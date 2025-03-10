import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import api from '../../config.json'

import CountUp from 'react-countup';
import { CSVLink } from 'react-csv';
import MainPagetitle from '../../layouts/MainPagetitle';
import { IMAGES, SVGICON } from '../../constant/theme';
import EmployeeOffcanvas from '../../constant/EmployeeOffcanvas';
import axios from '../../../services/AxiosInstance';
import TicketModal from './TicketModal';
import '../../../App.css'
import moment from 'moment';
import axiosInstance from '../../../services/AxiosInstance';
import swal from 'sweetalert';
import { exportTableToExcel } from '../../../util/common';
import { Select } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";



const tableData = [
    { emplid: '01', invid: 'INV-100023456', assign: '3', status: 'Complete', startdate: '06 May 2023', enddate: '12 june 2023', title: 'Create Frontend WordPress', select: 'High' },
    { emplid: '02', invid: 'INV-100023567', assign: '4', status: 'Testing', startdate: '06 May 2023', enddate: '12 june 2023', title: 'HTML To React Convert', select: 'Low' },
    { emplid: '03', invid: 'INV-100023987', assign: '4', status: 'Pending', startdate: '06 May 2023', enddate: '12 june 2023', title: 'HTML template Issue Complete', select: 'Medium' },
    { emplid: '04', invid: 'INV-100023420', assign: '3', status: 'In Progress', startdate: '06 May 2023', enddate: '12 june 2023', title: 'Complete Admin Dashboard Project', select: 'Low' },
    { emplid: '05', invid: 'INV-100023436', assign: '4', status: 'Testing', startdate: '06 May 2023', enddate: '12 june 2023', title: 'Create Frontend WordPress', select: 'High' },
    { emplid: '06', invid: 'INV-100023123', assign: '5', status: 'Pending', startdate: '06 May 2023', enddate: '12 june 2023', title: 'HTML To React Convert', select: 'Low' },
    { emplid: '07', invid: 'INV-100023987', assign: '4', status: 'Complete', startdate: '06 May 2023', enddate: '12 june 2023', title: 'HTML template Issue Complete', select: 'Medium' },
    { emplid: '08', invid: 'INV-100023852', assign: '3', status: 'Testing', startdate: '06 May 2023', enddate: '12 june 2023', title: 'Complete Admin Dashboard Project', select: 'High' },
    { emplid: '09', invid: 'INV-100023741', assign: '5', status: 'Complete', startdate: '06 May 2023', enddate: '12 june 2023', title: 'Create Frontend WordPress', select: 'Low' },
    { emplid: '10', invid: 'INV-100023963', assign: '4', status: 'Pending', startdate: '06 May 2023', enddate: '12 june 2023', title: 'HTML To React Convert', select: 'High' },
    { emplid: '11', invid: 'INV-100023123', assign: '5', status: 'Pending', startdate: '06 May 2023', enddate: '12 june 2023', title: 'HTML To React Convert', select: 'Low' },
    { emplid: '12', invid: 'INV-100023987', assign: '4', status: 'Complete', startdate: '06 May 2023', enddate: '12 june 2023', title: 'HTML template Issue Complete', select: 'Medium' },
    { emplid: '13', invid: 'INV-100023852', assign: '3', status: 'Testing', startdate: '06 May 2023', enddate: '12 june 2023', title: 'Complete Admin Dashboard Project', select: 'High' },
    { emplid: '14', invid: 'INV-100023741', assign: '5', status: 'Complete', startdate: '06 May 2023', enddate: '12 june 2023', title: 'Create Frontend WordPress', select: 'Low' },
    { emplid: '15', invid: 'INV-100023963', assign: '4', status: 'Pending', startdate: '06 May 2023', enddate: '12 june 2023', title: 'HTML To React Convert', select: 'High' },
    { emplid: '16', invid: 'INV-100023456', assign: '3', status: 'Complete', startdate: '06 May 2023', enddate: '12 june 2023', title: 'Create Frontend WordPress', select: 'High' },
    { emplid: '17', invid: 'INV-100023567', assign: '4', status: 'Testing', startdate: '06 May 2023', enddate: '12 june 2023', title: 'HTML To React Convert', select: 'Low' },
    { emplid: '18', invid: 'INV-100023987', assign: '4', status: 'Pending', startdate: '06 May 2023', enddate: '12 june 2023', title: 'HTML template Issue Complete', select: 'Medium' },
    { emplid: '19', invid: 'INV-100023420', assign: '3', status: 'In Progress', startdate: '06 May 2023', enddate: '12 june 2023', title: 'Complete Admin Dashboard Project', select: 'Low' },
    { emplid: '20', invid: 'INV-100023436', assign: '4', status: 'Testing', startdate: '06 May 2023', enddate: '12 june 2023', title: 'Create Frontend WordPress', select: 'High' },

];
const headersTitle = [
    { label: 'Employee ID', key: 'emplid' },
    { label: 'Invoice', key: 'invid' },
    { label: 'Status', key: 'status' },
    { label: 'Name', key: 'title' },
    { label: 'Start Date', key: 'startdate' },
    { label: 'End Date', key: 'enddate' },
    { label: 'Priority', key: 'select' },
]



const TicketList = ({ isList, filter, isExcel, search }) => {
    const [show, setShow] = useState(false);
    const [showTab, setShowTab] = useState("");
    const [selectedTicket, setSelectedTicket] = useState({});
    const [statusPriority, setStatusPriority] = useState(tableData);
    const [allTicket, setAllTicket] = useState([]);
    const [allTicketCache, setAllTicketCache] = useState([]);
    const [cardCounters, setCardCounters] = useState([])
    const [dueDate, setDueDate] = useState('')
    const [filterBy, setFilterBy] = useState({ Value: [] })
    const [assignee, setAssignee] = useState([])
    const priority = ["Urgent", "High", "Low", "Medium"]
    const status = ["Active", "On Hold", "Cancelled"]
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(allTicket.length / itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const paginatedTickets = allTicket.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        getAllTicket();
    }, []);

    const filters = [
        { value: "TicketStatus", label: "Ticket Status" },
        { value: "TicketPriority", label: "Ticket Priority" },
        { value: "Company", label: "Company" },
        { value: "Employee", label: "Employee" },
        { value: "TicketNo", label: "Ticket No" }
    ]
    //const [dropValue, setDropValue] = useState(tableData);		
    const [data, setData] = useState(
        document.querySelectorAll("#task-tbl_wrapper tbody tr")
    );
    const sort = 10;
    const activePag = useRef(0);
    const [test, settest] = useState(0);
    const chageData = (frist, sec) => {
        for (var i = 0; i < data.length; ++i) {
            if (i >= frist && i < sec) {
                data[i].classList.remove("d-none");
            } else {
                data[i].classList.add("d-none");
            }
        }
    };

    const csvlink = {
        headers: headersTitle,
        data: allTicket,
        filename: "csvfile.csv"
    }

    useEffect(() => {
        getAllTicket()
        setData(document.querySelectorAll("#task-tbl_wrapper tbody tr"));
    }, [test, filter]);

    useEffect(() => {
        if (allTicketCache.length > 0) {
            let tickets = [...allTicketCache]
            if (search) {
                tickets = tickets.filter(x =>
                    x.SR_ID.toLowerCase().includes(search.toLowerCase())
                    // ||
                    // x.CompanyName.toLowerCase().includes(search.toLowerCase())
                    // ||
                    // x.SR_ID.toLowerCase().includes(search.toLowerCase())
                    // ||
                    // x.SR_ID.toLowerCase().includes(search.toLowerCase())
                )
                setAllTicket(tickets)
            } else {
                setAllTicket(tickets)
            }
        }

    }, [search]);

    activePag.current === 0 && chageData(0, sort);
    let paggination = Array(Math.ceil(data.length / sort))
        .fill()
        .map((_, i) => i + 1);
    const onClick = (i) => {
        activePag.current = i;
        chageData(activePag.current * sort, (activePag.current + 1) * sort);
        settest(i);
    };

    const checkbox = document.querySelectorAll(".sorting_25 input");
    const motherCheckBox = document.querySelector(".sorting_asc_15 input");
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

    const handleSelect = (id, value) => {
        let temp = statusPriority.map((data) => {
            if (id === data.emplid) {
                return { ...data, select: value };
            }
            return data;
        });
        setStatusPriority(temp);
    };
    const handleAction = (id, value) => {
        let temp = statusPriority.map((data) => {
            if (id === data.emplid) {
                return { ...data, status: value };
            }
            return data;
        });
        setStatusPriority(temp);
    };
    const task = useRef();

    const getAllTicket = () => {
        axios.get(api.api + "GetAllTicket")
            .then((result) => {
                const counters = result.data.reduce((acc, incident) => {
                    // Check if the state is already in the accumulator
                    let stateCounter = acc.find(state => state.State === incident.StateName);
                    if (stateCounter) {
                        // Increment the count for the existing state
                        stateCounter.Count++;
                    } else {
                        // Add a new state to the accumulator with count 1
                        acc.push({ State: incident.StateName, Count: 1, Color: "primary" });
                    }
                    return acc;
                }, []);
                setCardCounters(counters)
                if (filter && filter.length > 0) {
                    setAllTicket(result.data.filter(x => filter.includes(x._id)))
                    setAllTicketCache(result.data.filter(x => filter.includes(x._id)))
                } else {
                    setAllTicket(result.data)
                    setAllTicketCache(result.data)
                }
                setShow(false)
            })
            .catch((err) => {
                console.log(err);
            })
    }
    console.log("all tickeetss", allTicket)

    const getDiffHours = (date1, date2) => {
        const startDate = new Date(date1);
        const endDate = new Date(date2);

        // Calculate the difference in milliseconds
        const diffInMs = endDate - startDate;

        // Convert milliseconds to hours
        const diffInHours = diffInMs / (1000 * 60 * 60);
        return diffInHours
    }

    const getTotalDiffHours = (tiket) => {
        let evets = []
        let totalHours = 0
        tiket.SR_Data_Logs.forEach((one) => {
            if (one.StateName == "Pending") {
                one.EventLogs.forEach((x) => {
                    evets.push(x)
                })
            }
            if (one.StateName == "InProgress") {
                one.EventLogs.forEach((x) => {
                    const idx = evets.findIndex(d => d.User == x.User)
                    if (idx > -1) {
                        evets[idx].CheckOutTime = x.CheckOutTime
                    }
                })
            }
        })
        // alert(JSON.stringify(evets))
        evets.forEach((x) => {
            if (x.CheckOutTime && x.CheckInTime) {
                totalHours = totalHours + getDiffHours(x.CheckInTime, x.CheckOutTime)
            }
        })
        return totalHours.toFixed(1);
    }

    const handleUpdateDueDate = (param) => {

        axiosInstance.patch(api.api + "updateDueDate", { DueDate: dueDate, TicketId: selectedTicket.SR_ID })
            .then((result) => {
                getAllTicket()
                setShow(false)
                swal("Update Due Date Successfully");
            })
            .catch((err) => {
                swal(`${err}`);
            })

    }


    const user = JSON.parse(localStorage.getItem('userDetails'))


    const getCloseStatus = (item) => {
        if (user.role == "super_admin") {
            return <Dropdown className="task-dropdown-2">
                <Dropdown.Toggle as="div" className="">{item.StateName}</Dropdown.Toggle>
                <Dropdown.Menu className='task-drop-menu'>
                    <Dropdown.Item onClick={() => {
                        axiosInstance.patch(api.api + "ReOpenTicket", { TicketId: item.SR_ID })
                            .then((result) => {
                                swal(`Ticket Re-Open Succefully`)
                                getAllTicket()
                            })
                            .catch((err) => {
                                console.log(err, "Error")
                                swal(`${err.response.data.message}`, { dangerMode: true })
                            })
                    }}>Re Open</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        } else {
            return <span className="badge badge-danger light border-0 me-1">{item.StateName}</span>
        }
    }

    const changeStatus = (item, status, key) => {
        axiosInstance.patch(api.api + "changeParams", { TicketId: item.SR_ID, Value: status, Param: key })
            .then((result) => {
                swal(`Ticket ${key} Update Succefully`)
                getAllTicket()
            })
            .catch((err) => {
                console.log(err, "Error")
                swal(`${err.response.data.message}`, { dangerMode: true })
            })
    }

    const getStatus = (item, key) => {
        if (user.role == "super_admin" || user.role == "manager") {
            if (key == "Status") {
                return <Dropdown className="task-dropdown-2">
                    <Dropdown.Toggle as="div" className="">{item[key]}</Dropdown.Toggle>
                    <Dropdown.Menu className='task-drop-menu'>
                        {status.map((status) => {
                            return <Dropdown.Item onClick={() => changeStatus(item, status, "Status")}>{status}</Dropdown.Item>
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            }
            if (key == "Priority") {
                return <Dropdown className="task-dropdown-2">
                    <Dropdown.Toggle as="div" className="">{item[key]}</Dropdown.Toggle>
                    <Dropdown.Menu className='task-drop-menu'>
                        {priority.map((p) => {
                            return <Dropdown.Item onClick={() => changeStatus(item, p, 'Priority')}>{p}</Dropdown.Item>
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            }

        } else {
            return <span className="badge badge-danger light border-0 me-1">{item[key]}</span>
        }
    }

    const getOptions = () => {
        const filter = filters.find(x => x.label == filterBy.Param)
        let options = []
        if (filter && filter.value == "TicketStatus") {
            options = status.map((x) => { return { label: x, value: x } })
        }
        else if (filter && filter.value == "TicketPriority") {
            options = priority.map((x) => { return { label: x, value: x } })
        }
        else if (filter && filter.value == "Company") {
            options = allTicket.map(x => {
                if (x.SR_Data_Logs.length > 0) {
                    return { value: x.SR_Data_Logs[0].FieldData.CompanyName, label: x.SR_Data_Logs[0].FieldData.CompanyName }
                }
            })
        }
        else if (filter && filter.value == "Employee") {
            options = allTicket.map(x => {
                if (x.SR_Data_Logs.length > 0) {
                    return { value: x.SR_Data_Logs[0].FieldData.ClientName, label: x.SR_Data_Logs[0].FieldData.ClientName }
                }
            })
        }
        else if (filter && filter.value == "TicketNo") {
            options = allTicket.map(x => {
                return { value: x.SR_ID, label: x.SR_ID }
            })
        }
        return options
    }

    const getFilterTicket = () => {
        let tickets = [...allTicket];
        const filter = filters.find(x => x.label == filterBy.Param)
        if (filter && filter.value == "TicketStatus") {
            tickets = tickets.filter(x => filterBy.Value.length == 0 || filterBy.Value.some(a => a.value == x.Status))
        }
        else if (filter && filter.value == "TicketPriority") {
            tickets = tickets.filter(x => filterBy.Value.length == 0 || filterBy.Value.some(a => a.value == x.Priority))
        }
        else if (filter && filter.value == "Company") {
            tickets = allTicket.filter(x => {
                if (filterBy.Value.length == 0 || (x.SR_Data_Logs.length > 0 && filterBy.Value.some(a => a.value == x.SR_Data_Logs[0].FieldData.CompanyName))) {
                    return x
                }
            })
        }
        else if (filter && filter.value == "Employee") {
            tickets = allTicket.filter(x => {
                if (filterBy.Value.length == 0 || (x.SR_Data_Logs.length > 0 && filterBy.Value.some(a => a.value == x.SR_Data_Logs[0].FieldData.ClientName))) {
                    return x
                }
            })
        }
        else if (filter && filter.value == "TicketNo") {
            tickets = tickets.filter(x => filterBy.Value.length == 0 || filterBy.Value.some(a => a.value == x.SR_ID))

        }
        return tickets
    }

    return (
        <>
            {!isList && <MainPagetitle mainTitle="Ticket" pageTitle={'Ticket List'} parentTitle={'Home'} />}

            {!isList && <TicketModal getAllTicket={getAllTicket}
                onChange={(e) => setDueDate(e.currentTarget.value)}
                handleUpdate={handleUpdateDueDate} showTab={showTab}
                ticketData={selectedTicket} show={show}
                onHide={() => { setShow(false); setSelectedTicket({}) }} />}

            <div className="container-fluid">
                {!isList && <div className="d-flex justify-content-between align-items-center mb-3">
                    {/* <h5 className="mb-0">Ticket List</h5> */}
                    {!isList && <div className="d-flex align-items-center mt-1">
                        <div className='d-flex align-items-center'>
                            <h5 className="mb-0 w-100">Filter By:</h5>
                            <Select
                                value={filterBy.Param || []}
                                options={filters}
                                style={{ width: '100%', marginLeft: 5 }}
                                onSelect={(value, all) => {
                                    const obj = { ...filterBy }
                                    obj.Param = all.label
                                    obj.Value = []
                                    setFilterBy(obj)
                                }}
                                placeholder="   Select Filter By   "
                            />
                        </div>
                        {filterBy.Param && <div style={{ marginLeft: 30 }} className='d-flex align-items-center'>
                            <h5 style={{ width: 250 }} className="mb-0 ">{filterBy.Param} Is:</h5>
                            <Select
                                value={filterBy.Value || []}
                                mode='multiple'
                                style={{ width: '100%', marginLeft: 5 }}
                                options={getOptions()}
                                onSelect={(value, all) => {
                                    const obj = { ...filterBy }
                                    obj.Value.push(all)
                                    setFilterBy(obj)
                                }}
                                onDeselect={(value, all) => {
                                    const obj = { ...filterBy }
                                    obj.Value = obj.Value.filter(x => x.value !== all.value)
                                    setFilterBy(obj)
                                }}
                                placeholder={`${filterBy.Param}`}
                            />
                        </div>}

                        <div style={{ marginLeft: 10 }} className='d-flex align-items-center mb-2'>
                            <button onClick={() => setFilterBy({ Value: [] })} className='btn btn-sm btn-primary'>Clear</button>
                        </div>
                    </div>}


                    <div className="d-flex align-items-center">

                        <div className="icon-box  icon-box-sm task-tab me-2">
                            <Link to={"/ticket-summary"}>
                                {SVGICON.FourDots}
                            </Link>
                        </div>
                        {user && user.role !== 'employee' && <Link to={"/create-ticket"} className="btn btn-primary btn-sm ms-2"
                            onClick={() => task.current.showEmployeModal()}
                        >+ Create Ticket</Link>}
                    </div>
                </div>}

                <div className="row">
                    {!isList && <div className="col-xl-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="row task">
                                    {cardCounters.map((item, index) => (
                                        <div className="col-xl-2 col-sm-4 col-6" key={index}>
                                            <div className="task-summary">
                                                <div className="d-flex align-items-baseline">
                                                    <CountUp className={`mb-0 fs-28 fw-bold me-2 text-${item.Color}`} end={item.Count} duration={'5'} />
                                                    <h6 className='mb-0'>{item.State}</h6>
                                                </div>
                                                <p>Ticket</p>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                    </div>}

                    <div className='col-xl-12'>
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="table-responsive active-projects task-table">
                                    {isList && isExcel && <div className="tbl-caption d-flex justify-content-between align-items-center">
                                        {!isList && <h4 className="heading mb-0">Task</h4>}
                                        {<div>
                                            <div onClick={() => exportTableToExcel("Ticket_Detail")} className="btn btn-primary light btn-sm me-2"><i className="fa-solid fa-file-excel" /> Export Report</div>
                                        </div>}
                                    </div>}
                                    <div id="task-tbl_wrapper" className="dataTables_wrapper no-footer">
                                        <table id={"Ticket_Detail"} className="table ItemsCheckboxSec dataTable no-footer mb-0">
                                            <thead>
                                                <tr>
                                                    <th className="sorting_asc_15" >
                                                        <div className="form-check custom-checkbox ms-0">
                                                            <input type="checkbox" className="form-check-input checkAllInput" required=""
                                                                onClick={() => checkboxFun("all")}
                                                            />
                                                            <label className="form-check-label" htmlFor="checkAll"></label>
                                                        </div>
                                                    </th>
                                                    <th>Ticket ID</th>
                                                    <th>Company Name</th>
                                                    <th>Company Division</th>
                                                    <th>Current State</th>
                                                    <th>Status</th>
                                                    <th>Priority</th>
                                                    <th>Start Date</th>
                                                    <th>Due Date</th>
                                                    {/* <th>Exceeded Due Dates</th> */}
                                                    <th>Created By</th>
                                                    <th>Assigned To</th>
                                                    <th>Total Hours</th>
                                                    <th>Comment</th>
                                                    {/* <th >Action</th> */}
                                                    {/* <th>Assigned To</th> */}
                                                    {/* <th>Tags</th> */}
                                                    {/* <th className="text-end">Priority</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedTickets.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="sorting_25">
                                                            <div className="form-check custom-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    id={`employees${index + 211}`}
                                                                    onClick={() => checkboxFun()}
                                                                />
                                                                <label className="form-check-label" htmlFor={`employees${index + 211}`}></label>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <NavLink className="text-primary" to={`/edit-ticket/${item.SR_ID}`} state={item}>
                                                                {item.SR_ID}
                                                            </NavLink>
                                                        </td>
                                                        <td>
                                                            <span className="badge badge-info light border-0 me-1">
                                                                {item.SR_Data_Logs[0]?.FieldData?.CompanyName || "-"}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {item.SR_Data_Logs[0]?.FieldData?.CompanyDivision?.[0]?.value || '-'}
                                                        </td>
                                                        <td>
                                                            {item.StateName === "Close" ? getCloseStatus(item)
                                                                : <span className="badge badge-info light border-0 me-1">{item.StateName}</span>}
                                                        </td>
                                                        <td>{getStatus(item, "Status")}</td>
                                                        <td>{getStatus(item, "Priority")}</td>
                                                        <td>
                                                            <span>{item.StartDate ? moment(item.StartDate).format('DD-MM-YYYY') : '-'}</span>
                                                        </td>
                                                        <td>
                                                            <span>{item.DueDate ? moment(item.DueDate).format('DD-MM-YYYY') : '-'}</span>
                                                        </td>
                                                        <td>
                                                            <span>{item.CreatedBy}</span>
                                                        </td>
                                                        <td>
                                                            <span>
                                                                {item.SR_Data_Logs.at(-1)?.FieldData?.AssignPerson?.map(person => person.label).join(", ") || "-"}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <NavLink className="text-primary" onClick={() => { setShow(true); setShowTab("timesheet"); setSelectedTicket(item); }}>
                                                                {getTotalDiffHours(item)} Hours
                                                            </NavLink>
                                                        </td>
                                                        <td>
                                                            <div onClick={() => { setShow(true); setSelectedTicket(item); }} className="icon-badge-container">
                                                                <i className="fas fa-comment" style={{ color: '#0D99FF', fontSize: '24px', cursor: 'pointer' }}></i>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>


                                        </table>
                                        {/* Pagination Controls */}
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <button className="btn btn-primary" onClick={handlePrevPage} disabled={currentPage === 1}>
                                                <FontAwesomeIcon icon={faChevronLeft} /> 
                                            </button>
                                            <span>Page {currentPage} of {totalPages}</span>
                                            <button className="btn btn-primary" onClick={handleNextPage} disabled={currentPage === totalPages}>
                                                 <FontAwesomeIcon icon={faChevronRight} />
                                            </button>
                                        </div>
                                        <div className="d-sm-flex text-center justify-content-between align-items-center">
                                            <div className="dataTables_info">
                                                Showing {activePag.current * sort + 1} to{" "}
                                                {data.length > (activePag.current + 1) * sort
                                                    ? (activePag.current + 1) * sort
                                                    : data.length}{" "}
                                                of {data.length} entries
                                            </div>
                                            {/* <div
                                                className="dataTables_paginate paging_simple_numbers"
                                                id="example2_paginate"
                                            >
                                                <Link
                                                    className="paginate_button previous disabled"
                                                    to="/ticket-list"
                                                    onClick={() =>
                                                        activePag.current > 0 &&
                                                        onClick(activePag.current - 1)
                                                    }
                                                >
                                                    <i className="fa-solid fa-angle-left" />
                                                </Link>
                                                <span>
                                                    {paggination.map((number, i) => (
                                                        <Link
                                                            key={i}
                                                            to="/ticket-list"
                                                            className={`paginate_button  ${activePag.current === i ? "current" : ""
                                                                } `}
                                                            onClick={() => onClick(i)}
                                                        >
                                                            {number}
                                                        </Link>
                                                    ))}
                                                </span>
                                                <Link
                                                    className="paginate_button next"
                                                    to="/ticket-list"
                                                    onClick={() =>
                                                        activePag.current + 1 < paggination.length &&
                                                        onClick(activePag.current + 1)
                                                    }
                                                >
                                                    <i className="fa-solid fa-angle-right" />
                                                </Link>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {!isList && <EmployeeOffcanvas
                ref={task}
                Title="New Task"
            />}
        </>
    );
};

export default TicketList;