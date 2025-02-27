import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tab, Nav } from "react-bootstrap";
import MainPagetitle from "../../layouts/MainPagetitle";
import { SVGICON } from "../../constant/theme";
import api from "../../config.json";
import config from '../../../appConfig.json'
import axiosInstance from "../../../services/AxiosInstance";
import moment from "moment";
import _ from 'lodash'
import theme from '../../../jsx/constant/theme'
// import GridTab from './GridTab';

const LocationDetails = ({isList}) => {
  const [allTicket, setAllTicket] = useState([]);
  const [cardCounters, setCardCounters] = useState([]);
  const [events, setEvents] = useState([])
  const [showEvents, setShowEvents] = useState([])
  const [show, setShow] = useState(false);
  useEffect(() => {
    getAllTicket()
  }, [])


  const getFiles = (ticket, controlname) => {
    let files = []
    ticket && ticket.SR_Data_Logs.forEach(x => {
      if (x.Control_Name == controlname) {
        files = [...files, ...x.FieldData.Files]
      }
    })
    return files
  }

  function getCheckInCheckOutDetailsByUser(data = []) {
    let eventsCheck = [];

    data.forEach(one => {
      one.SR_Data_Logs.forEach(log => {
        if (log.StateType == "Pending") {
          log.EventLogs.forEach((event) => {
            event.CheckInLocation = event.Location
            event.SR_ID = one.SR_ID
            event.Company = one.SR_Data_Logs[0].FieldData ? one.SR_Data_Logs[0].FieldData.CompanyName : ""
            if (event.CheckInFiles) {
              event.CheckInFiles = [ ...log.FieldData.Files.filter(x => x.filename.includes("GroupImages"))]
            } else {
              event.CheckInFiles = log.FieldData.Files.filter(x => x.filename.includes("GroupImages"))
            }
            if (event.CheckOutFiles) {
              event.CheckOutFiles = [ ...log.FieldData.Files.filter(x => x.filename.includes("GroupImages"))]
            } else {
              event.CheckOutFiles = log.FieldData.Files.filter(x => x.filename.includes("GroupImages"))
            }
            eventsCheck.push(event)
          })
        }
        if (log.StateType == "InProgress") {
          log.EventLogs.forEach((event) => {
            eventsCheck.forEach((x, i) => {
              if (!x.CheckOutTime && eventsCheck[i]) {
                eventsCheck[i].CheckOutTime = event.CheckOutTime
                eventsCheck[i].CheckOutLocation = event.Location
              }
            })
          })
        }
      });
    })
    eventsCheck.forEach((one)=>{
      one.CheckInFiles=_.uniqBy(one.CheckInFiles,'filename');
      one.CheckOutFiles=_.uniqBy(one.CheckOutFiles,'filename')
    })
    console.log(eventsCheck, "eventsCheck")
    return eventsCheck;
  }

  const getAllTicket = () => {
    axiosInstance
      .get(api.api + "GetAllTicket")
      .then((result) => {
        console.log("result", result.data);

        const events = getCheckInCheckOutDetailsByUser(result.data);
        setEvents(events);
        setShowEvents(events)

      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getEmployess = () => {
    const list = _.cloneDeep(events)
    const employee = _.uniqBy(list, "User")
    return employee
  }
  return (
    <>
     {!isList && <MainPagetitle
        mainTitle="Ticket"
        pageTitle={"Location List"}
        parentTitle={"Home"}
      />}
      {/* <TicketModal
        getAllTicket={getAllTicket}
        onChange={(e) => setDueDate(e.currentTarget.value)}
        handleUpdate={handleUpdateDueDate}
        showTab={showTab}
        ticketData={selectedTicket}
        show={show}
        onHide={() => {
          setShow(false);
          setSelectedTicket({});
        }}
      /> */}

      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-3">
        {!isList &&  <h5 className="mb-0">List</h5>}

          <div className="d-flex align-items-center">


            {/* <div className="icon-box  icon-box-sm task-tab me-2">
                        <Link to={"/ticket-summary"}>
                            {SVGICON.FourDots}
                        </Link>
                    </div> */}
            {/* {user && user.role !== "employee" && (
              <Link
                to={"/create-ticket"}
                className="btn btn-primary btn-sm ms-2"
                onClick={() => task.current.showEmployeModal()}
              >
                + Create Ticket
              </Link>
            )} */}
          </div>
          <div className="col-lg-3">
            <div className="form-group mb-3 ">
              <select
                onChange={(e) => {
                  const list = [...events];
                  if (e.currentTarget.value == "All") {
                    setShowEvents(list)
                  } else {
                    setShowEvents(list.filter(x => x.User == e.currentTarget.value))
                  }
                }}
                placeholder="Select employee"
                defaultValue={"option"}
                className="form-control form-control-sm"
              >
                <option value={"All"}>All</option>
                {getEmployess().map((x) => {
                  return <option>{x.User}</option>
                })}
              </select>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive active-projects task-table">
                  <div className="tbl-caption d-flex justify-content-between align-items-center">
                    <h4 className="heading mb-0">Locations</h4>

                    {/* <div>
                      <CSVLink
                        {...csvlink}
                        className="btn btn-primary light btn-sm me-2"
                      >
                        <i className="fa-solid fa-file-excel" /> Export Report
                      </CSVLink>
                    </div> */}
                  </div>
                  <div
                    id="task-tbl_wrapper"
                    className="dataTables_wrapper no-footer"
                  >
                    <table
                      id="proempoloyeestbl2"
                      className="table ItemsCheckboxSec dataTable no-footer mb-0"
                    >
                      <thead>
                        <tr>
                          <th className="sorting_asc_15">
                            <div className="form-check custom-checkbox ms-0">
                              <input
                                type="checkbox"
                                className="form-check-input checkAllInput"
                                required=""
                              // onClick={() => checkboxFun("all")}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="checkAll"
                              ></label>
                            </div>
                          </th>
                          <th>Employee Name</th>
                          <th>Company Name</th>
                          <th>Ticket Number</th>
                          <th>Date</th>
                          <th>Check-In Location</th>
                          <th>Check-Out Location</th>
                          <th>Check-In Selfie</th>
                          <th>Check-Out Selfie</th>
                          <th>Work Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {showEvents.map((item, index) => (
                          <tr key={index}>
                            <td className="sorting_25">
                              <div className="form-check11custom-checkbox">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`employees${index + 211}`}
                                  required=""
                                //   onClick={() => checkboxFun()}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`employees${index + 211}`}
                                ></label>
                              </div>
                            </td>
                            <td>
                              <span>{item.User}</span>
                            </td>
                            <td>
                              <span>{item.Company}</span>
                            </td>
                            <td>
                              <span>{item.SR_ID}</span>
                            </td>
                            <td>
                              <span className="badge badge-info light border-0 me-1">
                                {moment(item.CheckInTime).format('DD-MM-YYYY')}
                              </span>
                            </td>
                            <td>
                              <span className="badge badge-info light border-0 me-1">
                                {item.CheckInLocation || "-"}
                              </span>
                            </td>
                            <td>
                              <span className="badge badge-info light border-0 me-1">
                                {item.CheckOutLocation || "-"}
                              </span>
                            </td>
                            <td>
                              {item.CheckInFiles.map(x => {
                                return <span className="badge badge-info light border-0 me-1">
                                  <img width={10} height={10} src={config.fileUrl + x.filename} />
                                  <a href={config.fileUrl + x.filename} style={{ marginLeft: 10 }}>
                                    <i className="fa fa-download" aria-hidden="true"></i>
                                  </a>
                                  {/* {x.filename || "-"} */}
                                </span>
                              })}
                            </td>
                            <td>
                              {item.CheckOutFiles.map(x => {
                                return <span className="badge badge-info light border-0 me-1">
                                  <img width={10} height={10} src={config.fileUrl + x.filename} />
                                  <a href={config.fileUrl + x.filename} style={{ marginLeft: 10 }}>
                                    <i className="fa fa-download" aria-hidden="true"></i>
                                  </a>
                                </span>
                              })}
                            </td>

                            <td>
                              <span className="badge badge-info light border-0 me-1">
                                {item.WorkDesc || "-"}
                              </span>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* <div className="d-sm-flex text-center justify-content-between align-items-center">
                      <div className="dataTables_info">
                        Showing {activePag.current * sort + 1} to{" "}
                        {data.length > (activePag.current + 1) * sort
                          ? (activePag.current + 1) * sort
                          : data.length}{" "}
                        of {data.length} entries
                      </div>
                      <div
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
                              className={`paginate_button  ${
                                activePag.current === i ? "current" : ""
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
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationDetails;
