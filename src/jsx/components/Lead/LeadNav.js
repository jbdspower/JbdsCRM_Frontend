import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Offcanvas } from "react-bootstrap";
import swal from "sweetalert";
import { SVGICON } from "../../constant/theme";
import axiosInstance from "../../../services/AxiosInstance";

const stageOption = [
  { value: "RFQPending", label: "RFQ Pending" },
  { value: "RFQSubmit", label: "RFQ Submit" },
  { value: "Hot", label: "Hot" },
  { value: "Cold", label: "Cold" },
  { value: "OrderWon", label: "Order Won" },
  { value: "OrderLost", label: "Order Lost" },
];
const categoryOption = [
  { value: "Product", label: "Product" },
  { value: "Customer", label: "Customer" },
];

const LeadNavHeader = ({
  pageTitle,
  parentTitle,
  mainTitle,
  getLeadList,
  setSubmitedFilterDate,
  filterDate,
  setfilterDate,
}) => {
  const [data, setData] = useState({ Id: null, ClosureDate: new Date() });
  const [showFilters, setShowFilters] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [showQuataion, setShowQuation] = useState(false);
  const handleClose = () => {
    setShowCalendar(false);
  };
  const handleShowFilters = () => setShowFilters(true);
  const handleCloseFilters = () => {
    if (toDate && fromDate) {
      setSubmitedFilterDate({ toDate, fromDate });
    }
    console.log("toDate", toDate);
    setShowFilters(false);
  };

  const handleCreateLead = () => {
    axiosInstance
      .post("createLead", data)
      .then((res) => {
        setData({ Id: null });
        setShow(false);
        swal("Lead Create Successfully");
        if (getLeadList) {
          getLeadList();
        }
      })
      .catch((err) => {
        swal(`${err}`);
      });
  };
  const handleShow = () => {
    axiosInstance
      .get("getLastLeadId")
      .then((res) => {
        const obj = { ...data };
        obj.Id = res.data;
        setData(obj);
        setShow(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const nav = useNavigate();
  const handleDesk = (e) => {
    e.preventDefault();
    nav("#");
  };
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  const filters = [
    "Today",
    "This Month",
    "Last Month",
    "This Year",
    "Last Year",
    "Custom Range",
  ];

  const handleFilterClick = (filter) => {
    // if (filter === "Custom Range") {
    //   setShowCalendar(true);
    //   setTimeout(() => {
    //     fromDateRef.current?.setOpen(true); // Open From Date Calendar
    //     toDateRef.current?.setOpen(true); // Open To Date Calendar
    //   }, 100);
    // } else {
    //   setShowCalendar(false);
    // }
    setfilterDate(filter)
};

  const applyDateFilter = () => {
    if (!fromDate || !toDate) {
      alert("Please select both start and end dates.");
      return;
    }
  };

  const handleOnChange = (e) => {
    const obj = { ...data };
    const { name, value } = e.currentTarget;
    obj[name] = value;
    setData(obj);
  };
  return (
    <>
      <div className="page-titles" >
        <ol className="breadcrumb">
          <li>
            <h5 className="bc-title">{mainTitle}</h5>
          </li>
          <li className="breadcrumb-item">
            <Link to={"#"}>
              {SVGICON.HomeSvg} {parentTitle}
            </Link>
          </li>
          <li className="breadcrumb-item active">
            <Link to={"#"}>{pageTitle}</Link>
          </li>
        </ol>
        <div className="flex flex-col gap-3 p-3 bg-blue-50 rounded-lg">
          {/* Filter Buttons */}
          <div className="flex gap-3 position-relative" >
            {filters.map((filter) => (
                
              <button
              key={filter}
              className={`p-1 border text-sm font-medium transition-all duration-200 rounded-lg
                ${
                              filterDate === filter
                              ? "border-blue-500 text-blue-500" // Active: Blue border & text
                                : "border-blue-500 text-blue-500"
                            }`}
                            onClick={() => handleFilterClick(filter)}
                            >
                  {console.log("===",filterDate === filter)}
                {filter}
              </button>
            ))}

            {/* Date Picker for Custom Range */}
            {showCalendar && (
              <div
                className="flex"
                style={{ display: "flex", position: "absolute", top: "30px" }}
              >
                <div>
                  {/* <label className="block text-gray-700 font-medium text-center mb-2">From</label> */}
                  <DatePicker
                    selected={fromDate}
                    onChange={(date) => setFromDate(date)}
                    inline // Displays the calendar directly
                    withPortal
                  />
                </div>
                <div>
                  {/* <label className="block text-gray-700 font-medium text-center mb-2">To</label> */}
                  <DatePicker
                    selected={toDate}
                    onChange={(date) => setToDate(date)}
                    inline
                    withPortal
                    renderCustomHeader={({
                      date,
                      decreaseMonth,
                      increaseMonth,
                    }) => (
                      <div className="flex justify-between items-center px-2">
                        <button
                          onClick={decreaseMonth}
                          className="text-sm text-gray-600"
                        >
                          &lt;
                        </button>
                        <span className="text-sm font-medium">
                          {date.toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <button
                          onClick={increaseMonth}
                          className="text-sm text-gray-600"
                        >
                          &gt;
                        </button>
                      </div>
                    )}
                    monthShown={fromDate.getMonth() + 2} // Shows next month
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="link-container">
          <Link
            style={{ marginLeft: 20, fontSize: 15 }}
            to={"#"}
            className="text-primary link-item "
            onClick={() => handleShow()}
          >
            Create Lead
          </Link>
          <Link
            style={{ marginLeft: 20, fontSize: 15 }}
            to={"#"}
            className="text-primary link-item"
            onClick={() => handleShow()}
          >
            Bulk Upload
          </Link>
          <Link
            style={{ marginLeft: 20, fontSize: 15 }}
            to={"#"}
            className="text-primary link-item"
            onClick={() => handleShow()}
          >
            Events
          </Link>
        </div>
      </div>
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        className="offcanvas-end customeoff"
      >
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal1">
            Create New Lead ({data.Id || "-"})
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            onClick={() => handleClose()}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="container-fluid">
            <form onClick={(e) => handleDesk(e)}>
              <div className="row">
                <div className="col-xl-6 mb-3">
                  <label
                    for="exampleFormControlInputfirst"
                    className="form-label"
                  >
                    Name<span className="text-danger">*</span>
                  </label>
                  <input
                    onChange={handleOnChange}
                    type="text"
                    name="Name"
                    className="form-control"
                    id="exampleFormControlInputfirst"
                    placeholder="Name"
                  />
                </div>

                <div className="col-xl-6 mb-3">
                  <label
                    for="exampleFormControlInputfirst"
                    className="form-label"
                  >
                    Company<span className="text-danger">*</span>
                  </label>
                  <input
                    onChange={handleOnChange}
                    type="text"
                    name="Company"
                    className="form-control"
                    id="exampleFormControlInputfirst"
                    placeholder="Company"
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label
                    for="exampleFormControlInputfirst"
                    className="form-label"
                  >
                    Mobile<span className="text-danger">*</span>
                  </label>
                  <input
                    onChange={handleOnChange}
                    type="text"
                    name="Mobile"
                    className="form-control"
                    id="exampleFormControlInputfirst"
                    placeholder="Mobile"
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label
                    for="exampleFormControlInputfirst"
                    className="form-label"
                  >
                    Email<span className="text-danger">*</span>
                  </label>
                  <input
                    onChange={handleOnChange}
                    type="email"
                    name="Email"
                    className="form-control"
                    id="exampleFormControlInputfirst"
                    placeholder="Email"
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label
                    for="exampleFormControlInputfirst"
                    className="form-label"
                  >
                    Address<span className="text-danger">*</span>
                  </label>
                  <textarea
                    onChange={handleOnChange}
                    type="text"
                    name="Address"
                    className="form-control"
                    id="exampleFormControlInputfirst"
                    placeholder="Address"
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label
                    for="exampleFormControlInputfirst"
                    className="form-label"
                  >
                    City<span className="text-danger">*</span>
                  </label>
                  <input
                    onChange={handleOnChange}
                    type="text"
                    name="City"
                    className="form-control"
                    id="exampleFormControlInputfirst"
                    placeholder="City"
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label
                    for="exampleFormControlInputfirst"
                    className="form-label"
                  >
                    District<span className="text-danger">*</span>
                  </label>
                  <input
                    onChange={handleOnChange}
                    type="text"
                    name="District"
                    className="form-control"
                    id="exampleFormControlInputfirst"
                    placeholder="District"
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label
                    for="exampleFormControlInputfirst"
                    className="form-label"
                  >
                    Pin Code<span className="text-danger">*</span>
                  </label>
                  <input
                    onChange={handleOnChange}
                    type="text"
                    name="Pin"
                    className="form-control"
                    id="exampleFormControlInputfirst"
                    placeholder="Pin Code"
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label
                    for="exampleFormControlInputfirst"
                    className="form-label"
                  >
                    State<span className="text-danger">*</span>
                  </label>
                  <input
                    onChange={handleOnChange}
                    type="text"
                    name="State"
                    className="form-control"
                    id="exampleFormControlInputfirst"
                    placeholder="State"
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label
                    for="exampleFormControlInputfirst"
                    className="form-label"
                  >
                    Department<span className="text-danger">*</span>
                  </label>
                  <input
                    onChange={handleOnChange}
                    type="text"
                    name="Department"
                    className="form-control"
                    id="exampleFormControlInputfirst"
                    placeholder="Department"
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label
                    for="exampleFormControlInputfirst"
                    className="form-label"
                  >
                    Designation<span className="text-danger">*</span>
                  </label>
                  <input
                    onChange={handleOnChange}
                    type="text"
                    name="Designation"
                    className="form-control"
                    id="exampleFormControlInputfirst"
                    placeholder="Designation"
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label
                    for="exampleFormControlInputfirst"
                    className="form-label"
                  >
                    Subject<span className="text-danger">*</span>
                  </label>
                  <input
                    onChange={handleOnChange}
                    type="text"
                    name="Subject"
                    className="form-control"
                    id="exampleFormControlInputfirst"
                    placeholder="Subject"
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label
                    for="exampleFormControlInputfirst"
                    className="form-label"
                  >
                    Lead Value (INR)<span className="text-danger">*</span>
                  </label>
                  <input
                    onChange={handleOnChange}
                    type="number"
                    name="LeadValue"
                    className="form-control"
                    id="exampleFormControlInputfirst"
                    placeholder="Lead Value"
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label
                    for="exampleFormControlInputfirst"
                    className="form-label"
                  >
                    Quote Value (INR)<span className="text-danger">*</span>
                  </label>
                  <input
                    onChange={handleOnChange}
                    type="number"
                    name="QuoteValue"
                    className="form-control"
                    id="exampleFormControlInputfirst"
                    placeholder="Quote Value"
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label className="form-label">
                    Category<span className="text-danger">*</span>
                  </label>
                  <Select
                    onChange={(value) => {
                      handleOnChange({
                        currentTarget: { name: "Category", value: value.value },
                      });
                    }}
                    options={categoryOption}
                    isSearchable={false}
                    className="custom-react-select"
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label className="form-label">
                    Stage<span className="text-danger">*</span>
                  </label>
                  <Select
                    onChange={(value) =>
                      handleOnChange({
                        currentTarget: { name: "Stage", value: value.value },
                      })
                    }
                    options={stageOption}
                    isSearchable={false}
                    className="custom-react-select"
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label
                    for="exampleFormControlInputthree"
                    className="form-label"
                  >
                    Closure Date<span className="text-danger">*</span>
                  </label>
                  <DatePicker
                    className="form-control"
                    selected={data.ClosureDate || new Date()}
                    onChange={(date) => {
                      const obj = { ...data };
                      obj.ClosureDate = new Date(date);
                      setData(obj);
                    }}
                  />
                </div>
                <div className="col-xl-12 mb-3">
                  <label className="form-label">
                    Description<span className="text-danger"></span>
                  </label>
                  <textarea
                    onChange={handleOnChange}
                    name="Description"
                    rows="3"
                    className="form-control"
                  ></textarea>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  onClick={handleCreateLead}
                  className="btn btn-primary me-1"
                >
                  Submit
                </button>
                <Link
                  to={"#"}
                  className="btn btn-danger light ms-1"
                  onClick={() => handleClose()}
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </Offcanvas>
    </>
  );
};

export default LeadNavHeader;
