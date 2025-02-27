import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Button, Form } from 'react-bootstrap';
import axiosInstance from '../../../../services/AxiosInstance';
import swal from "sweetalert";

const localizer = momentLocalizer(moment);

const MyCalendar = ({ getEvents, events = [] }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  useEffect(() => {
    axiosInstance.get("event")
      .then((result) => {
        const fetchedEvents = result.data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        getEvents(fetchedEvents)
      })
      .catch((err) => {
        swal(`${err}`, { dangerMode: true });
      });
  }, []);

  const handleShowModal = (selectedDate) => {
    setStart(selectedDate); // Keep as Date object
    setEnd(selectedDate);   // Default end date to start date
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTitle('');
    setStart(null);
    setEnd(null);
  };

  const handleAddEvent = () => {
    if (title && start && end) {
      const newEvent = {
        title,
        start,
        end,
      };
      axiosInstance.post("event", newEvent)
        .then((result) => {
          const all = [...events, { ...newEvent }]
          getEvents(all)
          handleCloseModal();
        })
        .catch((err) => {
          swal(`${err}`, { dangerMode: true });
        });
    } else {
      alert("Please fill in all fields");
    }
  };
  const MyCustomEvent = ({ event }) => (
    <div style={{ color: 'white', backgroundColor: '#007BFF', padding: '5px', borderRadius: '4px' }}>
      <strong>{event.title}</strong>
      <div style={{ fontSize: '0.8rem' }}>
        {event.userName}
        {/* {moment(event.start).format('hh:mm A')} - {moment(event.end).format('hh:mm A')} */}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '0.5rem' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 450, width: '100%', marginTop: '1rem' }}
        className="calendar-custom"
        selectable
        components={{
          event: MyCustomEvent, // Custom event renderer
        }}
        onSelectSlot={(slotInfo) => handleShowModal(slotInfo.start)} // Open modal on date cell click
      />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="eventTitle">
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="startDate" className="mt-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={moment(start).format("YYYY-MM-DDTHH:mm")}
                onChange={(e) => setStart(new Date(e.target.value))}
              />
            </Form.Group>

            <Form.Group controlId="endDate" className="mt-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={moment(end).format("YYYY-MM-DDTHH:mm")}
                onChange={(e) => setEnd(new Date(e.target.value))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddEvent}>
            Add Event
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyCalendar;
