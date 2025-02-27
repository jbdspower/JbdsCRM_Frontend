import React, { Fragment, useEffect, useState } from 'react';
import { Dropdown, Nav, Tab } from "react-bootstrap";
/// Scroll

import { Link } from "react-router-dom";
import PageTitle from '../../layouts/PageTitle';
import axios from '../../../services/AxiosInstance';
import config from '../../config.json'
import common from '../../../util/common'
import moment from 'moment';

const HistoryTimeline = ({ ticketId }) => {
    const [srDataLogs, setSRDataLogs] = useState([])
    useEffect(() => {
        axios.get(config.api + "ticketData/" + ticketId)
            .then((result) => {
                setSRDataLogs(result.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    const getHistoryStatement = (state) => {
        if (state.StateName == "Create SR") {
            return <h6 className="mb-0">
                Ticket is created by{" "}
                <strong className="text-primary">{state.CreatedBy}</strong>.
                and assigned to {" "}
                {state.FieldData && state.FieldData.AssignPerson && state.FieldData.AssignPerson.map(x => <strong className="text-primary">{x.value}{" "}</strong>)}
            </h6>
        }
        else if (state.StateName == "Assign") {
            if (state.AcceptedBy && state.AcceptedBy.length > 0) {
                return <>
                    <h6 className="mb-0">
                        <strong className="text-info">{state.CreatedBy}</strong>
                        ticket is assigned to {" "}
                        {state.FieldData && state.FieldData.AssignPerson && state.FieldData.AssignPerson.map(x => <strong className="text-primary">{x.value}{","}</strong>)}
                        {state.FieldData.TeamLead && <>and selected<strong className="text-primary">{"  "}{state.FieldData.TeamLead}{"  "} </strong> as team lead.</>}
                    </h6>
                    <br></br>
                    <h6 className="mb-0">
                        Ticket is acceped by  {" "}<strong className="text-primary">{state.CreatedBy}</strong>
                        and waitig for check in by employee (teamlead)<strong className="text-primary">{state.CreatedBy}</strong>.
                    </h6>
                </>
            } else {
                return <h6 className="mb-0">
                    <strong className="text-info">{state.CreatedBy}</strong>.
                    ticket is assigned to {" "}
                    {state.FieldData && state.FieldData.AssignPerson && state.FieldData.AssignPerson.map(x => <strong className="text-primary">{x.value}{","}</strong>)}
                    {state.FieldData.TeamLead && <>and selected<strong className="text-primary">{"  "}{state.FieldData.TeamLead}{"  "} </strong> as team lead</>}
                </h6>
            }

        }
        else if (state.StateName == "Pending") {
            return <h6 className="mb-0">
                tciket  is checked in  by employee <strong className="text-primary">{state.CreatedBy}</strong> with time estimate {"  "}
                {state.FieldData && state.FieldData.TimeEstimate && state.FieldData.TimeEstimate.map(x => <strong className="text-primary">{x.User}{"  "}({x.Hours} hours)</strong>)}{"  "}
                from location <strong className="text-primary">{"  "}{state.FieldData.Location}{"  "}</strong>
            </h6>

        }
        else if (state.StateName == "InProgress") {
            return <h6 className="mb-0">
                tciket  is checked out  by employee <strong className="text-primary">{state.CreatedBy}</strong>. with time estimate {"  "}
                {state.FieldData && state.FieldData.TimeEstimate && state.FieldData.TimeEstimate.map(x => <strong className="text-primary">{x.User}{"  "}</strong>)}{"  "}
                from location <strong className="text-primary">{"  "}{state.FieldData.Location} {"  "}</strong>
            </h6>

        }
        else if (state.StateName == "Complete" && state.NextStateName == "Pending") {
            return <h6 className="mb-0">
                Ticket is waiting for completion. If ticket is not complete waiting for check in again by{" "}
                <strong className="text-success">{state.CreatedBy}</strong>.
            </h6>
        }
        else if (state.StateName == "Complete" && state.NextStateName == "Close") {
            return <h6 className="mb-0">
                Ticket is completed by  <strong className="text-success">{state.CreatedBy}</strong> and give a feedback from customer.{" "}
                
            </h6>
        } else {
            return <></>
        }
    }
    return (
        <Fragment>
            {/* <PageTitle
                activeMenu="Statistics"
                motherMenu="Widget"
                pageContent="Statistics"
            /> */}
            <div className="container-fluid">
                <div className="card">
                    <div className="card-header border-0 pb-0">
                        <h4 className="card-title">History</h4>
                    </div>
                    <div className="card-body">
                        <div
                            style={{ height: "370px" }}
                            id="DZ_W_TimeLine"
                            className="widget-timeline dz-scroll height370 ps--active-y"
                        >
                            <ul className="timeline">
                                {srDataLogs.SR_Data_Logs && srDataLogs.SR_Data_Logs.map(state => {
                                    return <li>
                                        <div className="timeline-badge primary"></div>
                                        <Link
                                            className="timeline-panel text-muted"
                                            to="/widget-basic"
                                        >
                                            <span>{common.getRelativeDate(new Date(state.CreatedAt))}{"     "}({moment(state.CreatedAt).format(' hh:mm a / DD-mm-yyyy')})</span>
                                            {getHistoryStatement(state)}
                                        </Link>
                                    </li>
                                })}

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment >
    );
}

export default HistoryTimeline;