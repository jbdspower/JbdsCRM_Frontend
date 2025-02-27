import React, { useRef, useState } from 'react';
import { Row, Card, Col, Button, Modal, Container, Tabs, Tab } from "react-bootstrap";
import ChatElementBlog from '../Dashboard/elements/ChatElementBlog';
import HistoryTimeline from './HistoryTimeline';
import Webcam from 'react-webcam';
import { getLocation } from '../Location/GetLocation';
import swal from 'sweetalert'


const CapturePhoto = ({show, onHide, getFile,field }) => {
    const webcamRef = useRef()
    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            fetch(imageSrc)
                .then(res => res.blob())
                .then(async blob => {
                    const filename = `${field.name}.png`; // Add extension to the filename
                    const newFile = new File([blob], filename, { type: "image/png" });
                    console.log(newFile)
                    const location = await getLocation();
                    getFile({ Location: location, Files: [newFile] });
                })
                .catch(error => {
                    swal("Error in Fetching location");
                    console.error('Error while fetching the image:', error);
                });
        } else {
            swal("Error in Fetching location");
            console.error('No image captured from webcam.');
        }
    };
    
    return (<Modal className="fade bd-example-modal-lg" show={show} size="lg" onHide={onHide}>
        <Modal.Header>
            <Modal.Title>Capture Photo</Modal.Title>
            <Button variant="" className="btn-close" onClick={onHide}></Button>
        </Modal.Header>
        <Modal.Body className='text-center'>
           {show && <Webcam
                style={{ width: 400, height: 300, borderRadius: '100%' }}
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"
            />}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="" className="btn-primary" onClick={capture}>Capture</Button>
        </Modal.Footer>
    </Modal>);
}

export default CapturePhoto;