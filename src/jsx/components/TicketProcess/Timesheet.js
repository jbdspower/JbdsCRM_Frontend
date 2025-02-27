import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Row, Card, Col, Button, Modal, Container, Tabs, Tab } from "react-bootstrap";


const TimeSheet = ({ ticketData }) => {
    const [key, setKey] = useState('');
    const [tabs, setTabs] = useState([])

    useEffect(() => {
        if (ticketData && ticketData.SR_Data_Logs) {
            const events = getEvents(ticketData)
            if (events.length > 0) {
                setTabs(events)
                setKey(events[0].User)

            }
        }
    }, [ticketData])



    const getEvents = (tiket) => {
        let eventsByUser = {}

        tiket.SR_Data_Logs.forEach((one) => {
            if (one.StateName == "Pending" || one.StateName == "InProgress") {
                one.EventLogs.forEach((x) => {
                    if (!eventsByUser[x.User]) {
                        eventsByUser[x.User] = { User: x.User, Events: [] }
                    }

                    if (one.StateName == "Pending") {
                        eventsByUser[x.User].Events.push(x)
                    } else if (one.StateName == "InProgress") {
                        const idx = eventsByUser[x.User].Events.findIndex(d => d.CheckInTime == x.CheckInTime)
                        if (idx > -1) {
                            eventsByUser[x.User].Events[idx].CheckOutTime = x.CheckOutTime
                        } else {
                            eventsByUser[x.User].Events.push(x)
                        }
                    }
                })
            }
        })

        // Convert the eventsByUser object into an array
        let eventsArray = Object.keys(eventsByUser).map(user => eventsByUser[user])
        eventsArray.forEach((x, i) => {
            eventsArray[i].Events = eventsArray[i].Events.filter(y => y.CheckInTime && y.CheckOutTime)
        })
        return eventsArray
    }

    const getDiffHours = (date1, date2) => {
        const startDate = new Date(date1);
        const endDate = new Date(date2);
    
        // Calculate the difference in milliseconds
        const diffInMs = endDate - startDate;
    
        // Convert milliseconds to total hours and minutes
        const diffInMinutes = diffInMs / (1000 * 60);
        const totalHours = Math.floor(diffInMinutes / 60);
        const remainingMinutes = Math.floor(diffInMinutes % 60);
    
        // Format the hours and minutes
        const formattedHours = String(totalHours).padStart(2, '0');
        const formattedMinutes = String(remainingMinutes).padStart(2, '0');
    
        return `${formattedHours}:${formattedMinutes}`;
    };
    
    // Example usage
    console.log(getDiffHours('2024-07-17T08:00:00', '2024-07-17T10:30:00')); // Output: "02:30"
    

    if (tabs.length == 0) {
        return <></>
    }
    return (<Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
    >
        {tabs.map((x) => {
            return <Tab eventKey={x.User} title={x.User}>
                <table class="table table-sm table-responsive">
                    <thead>
                        <tr className='text-center'>
                            <th scope="col">Date</th>
                            <th scope="col">In Time</th>
                            <th scope="col">Out Time</th>
                            <th scope="col">Total Hrs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {x.Events.map((one) => {
                            return <tr className='text-center'>
                                <td>{moment(one.CheckInTime).format("DD-MM-YYYY")}</td>
                                <td>{moment(one.CheckInTime).format("hh:mm a")}</td>
                                <td>{moment(one.CheckOutTime).format("hh:mm a")}</td>
                                <td>{getDiffHours(one.CheckInTime, one.CheckOutTime)}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </Tab>
        })}
    </Tabs>);
}

export default TimeSheet;