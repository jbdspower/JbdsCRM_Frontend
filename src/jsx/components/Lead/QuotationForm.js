import React from 'react';
import { Offcanvas } from 'react-bootstrap';
import { Link ,useNavigate} from 'react-router-dom';

const QuaotationForm = ({ show, setShow,handleOnChange }) => {
    const nav = useNavigate();
    const handleQuotation = (e) => {
        e.preventDefault();
        nav("#");
    }

    return (<>
        <Offcanvas style={{width:'80%'}}  show={show} onHide={() => setShow(false)} placement='end' className="offcanvas-end customeoff">
            <div style={{background:'blue',margin:0}} className="offcanvas-header">
                <h5 style={{color:'white'}} className="modal-title" id="#gridSystemModal1">500 kva RECD KIT   (JPL-1 )</h5>
                <button style={{background:'white'}} type="button" className="btn-close" data-bs-dismiss="offcanvas"
                    onClick={() => setShow(false)}
                >
                    <i style={{color:'black'}}  className="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div className="offcanvas-body">
                <div className="container-fluid">
                    <form onClick={(e) => handleQuotation(e)}>
                        <div className="row">
                            <div className="col-xl-6 mb-3">
                                <label for="exampleFormControlInputfirst" className="form-label">Name<span className="text-danger">*</span></label>
                                <input onChange={handleOnChange} type="text" name='Name' className="form-control" id="exampleFormControlInputfirst" placeholder="Name" />
                            </div>

                            <div className="col-xl-6 mb-3">
                                <label for="exampleFormControlInputfirst" className="form-label">Company<span className="text-danger">*</span></label>
                                <input onChange={handleOnChange} type="text" name='Company' className="form-control" id="exampleFormControlInputfirst" placeholder="Company" />
                            </div>

                        </div>
                        <div>
                            <button type="submit" onClick={() => { }} className="btn btn-primary me-1">Submit</button>
                            <Link to={"#"} className="btn btn-danger light ms-1" onClick={() => setShow(false)}>Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </Offcanvas>
    </>);
}

export default QuaotationForm;