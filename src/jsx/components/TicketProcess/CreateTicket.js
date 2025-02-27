import React, { useState, useRef, useEffect } from 'react';
import MainPagetitle from '../../layouts/MainPagetitle';
import axios from './../../../services/AxiosInstance';
import api from "../../config.json";
import config from "../../../appConfig.json";
import swal from "sweetalert";
import Webcam from "react-webcam";
import { Button, Modal } from "antd";
import _ from "lodash";
import process from './Process.json'

// import DynamicTable from "../../utill/testingdynamictable";
// import AlertMessage from "../../utill/AlertMessage";
// import { StartWorkflow, StateTypes, stateSelector } from "../StateTypes/StateTypes"
// import WorkflowHistory from "./HistoryWorkflow";
import WorkFlowStepperAndStateComp from "./WorkFlowStepperAndStateComp";
import FormValidation from '../Forms/FormValidation/FormValidation';
import { json, useLocation, useNavigate, useParams } from 'react-router-dom';
import CheckInCheckOutForm from '../Forms/CheckInCheckOutForm';
import Autocomplete from './AutoComplete';
// import moment from "moment";

const CreateTicket = ({ history, location, NextStateApi, WorkFlowName }) => {
	const [receivedDataState, setReceivedDataState] = useState(null);
	const location1 = useLocation();
	// Access the passed data
	// const receivedData = location.state?.data;
	const [customInput, setCustomInput] = useState({})
	const [RefreshState, setRefreshState] = useState(false);
	const [ticketData, setTicketData] = useState({})
	const [stateData, setStateData] = useState({});
	const [MoldList, setMoldList] = useState([]);
	const [Dynamicdata, setDynamicdata] = useState([])
	const [currentState, setCurrentState] = useState({});
	const [WorkFlowList, setWorkFlowList] = useState([]);
	const [selectedSrId, setselectedSrId] = useState({});
	const [stepperList, setstepperList] = useState([]);
	const [HistoryLogs, setHistoryLogs] = useState({});
	const [open, setOpen] = useState(false);
	const [ModalData, setModalData] = useState([]);
	const [UsersStatus, setUsersStatus] = useState([]);
	const [querySuccess, setquery] = useState(false);
	const [files, setFiles] = useState([])
	const [Index, setIndex] = useState(null);
	const navigate = useNavigate();
	const params = useParams()
	const user = JSON.parse(localStorage.getItem('userDetails'))

	useEffect(() => {
		axios
			.get(api.api + "serviceRequest")
			.then((result) => {
				if (result.status == 200) {

					const filteredState = result.data.filter(
						(one) => one.SR_ID === location.state.data
					);
					console.log(
						filteredState[0].SR_Data_Logs[
							filteredState[0].SR_Data_Logs.length - 1
						].Users,
						"current state"
					);
					const userStatus =
						filteredState[0].SR_Data_Logs[
							filteredState[0].SR_Data_Logs.length - 1
						].Users;
					setUsersStatus(userStatus);
				}
			})
			.catch((err) => {
				// AlertMessage(`${err.response.data.message}`, "bottom-right", "red")


				// swal(`${err}`);
			});
	}, [location, WorkFlowList]);


	const getNextState = (SR_ID) => {
		axios
			.put(api.api + "nextState", { Sr_ID: SR_ID })
			.then(async (result) => {
				if (result.status == 200) {
					setTicketData(result.data.ticketData)
					if (result.data.ticketData && result.data.ticketData.CustomData && result.data.ticketData.CustomData.Files) {
						for (let i = 0; i < result.data.ticketData.CustomData.Files.length; i++) {
							result.data.ticketData.CustomData.Files[i] =
								await urlToFile(config.fileUrl + result.data.ticketData.CustomData.Files[i].filename, result.data.ticketData.CustomData.Files[i].filename);
						}
					}
					setCustomInput(result.data.ticketData ? result.data.ticketData.CustomData : {})

					if (result.data.Warning) {
						swal({
							title: "Warning",
							text: result.data.Warning,
							icon: "warning",
							button: "OK"
						});
					}
					if (result.data == "State_Close") {
						swal("Close", 'State already closed no need to working on further.');
						navigate('/ticket-list');
					} if (result.data == "View_Only"|| user.role=="super_admin") {
						setCurrentState(result.data);
						swal("You can view data only")
						// navigate('/ticket-list')
					} else if (result.data == "Waiting_For_Accpet") {
						swal("Waiting for accept as team lead")
						navigate('/ticket-list')
					} else {
						setCurrentState(result.data);
						setquery(false);
					}
				}
			})
			.catch((err) => {
				alert(`${err}`)
			});
	}
	useEffect(() => {
		if (params && params.SR_ID) {
			getNextState(params.SR_ID)
		} else {
			axios
				.put(api.api + "nextState", { WorkFlowid: process[0]._id })
				.then((result) => {
					if (result.status == 200) {
						setCurrentState(result.data);
						setquery(false);

					}
				})
				.catch((err) => {

				});
		}
	}, [params.SR_ID]);

	useEffect(() => {
		let statelist;
		let selectedworkflow;
		process.map((item, idx1) => {
			if (item.WorkFlowName === WorkFlowName) {
				selectedworkflow = item;
				statelist = item.State.map((item, idx) => {
					return { title: item.StateName, Index: idx };
				});
			}
		});

		if (currentState.CurrentProcess && currentState.CurrentProcess.IsRunning) {
			statelist.forEach((state) => {
				if (state.title == currentState.StateName) {
					const description = `${currentState.CurrentProcess.ProcessType} ${state.title}`
					state.description = description
				}
			})
		}
		setstepperList(statelist);
		setWorkFlowList([selectedworkflow]);

	}, [currentState.PrevStateData]);

	// Function to update preventive_main state in parent component
	const handleOnComponentStateChange = (
		newPreventiveMain,
		componentInputName
	) => {
		const newData = {
			...stateData,
			[componentInputName]: newPreventiveMain, // Assuming there's only one key-value pair in the data object
		};
		setStateData(newData);
	};



	const returnValue = (data, type, Name) => {
		const keys = Object.keys(data); // Extract keys from the data object
		const values = Object.values(data); // Extract values from the data object
		// Create a new object with the existing data from outer component
		// and add/update the new key-value pair
		if (keys[0] === "PartNumber") {
			// SendPartNumber(values[0]);
		}
		console.log("cldksjnvlsnd", data);
		const newData = {
			...stateData,
			[keys[0]]: values[0], // Assuming there's only one key-value pair in the data object
		};

		// Update the outer component data
		setStateData(newData);

		return newData;
	};

	const handleGoNext = (control, data, files) => {
		const errors = null;
		const selectedData = { ...data }
		delete currentState._id

		const newData = {
			...currentState,
			["Data"]: selectedData,
			["Control"]: control
		};
		const formData = new FormData();
		formData.append("Data", JSON.stringify(newData))
		Array.from(files).forEach((file) => {
			formData.append("files", file)
		})
		setquery(true);
		axios
			.put(api.api + "serviceRequestState", formData)
			.then((result) => {
				if (result.status == 200) {
					if (control.Continous) {
						getNextState(currentState.SR_ID)
					} else {
						if (!control.Send_Notification && result.data && result.data.length > 0) {
							axios
								.put(api.api + `${NextStateApi}`, { Sr_ID: result.data })
								.then((result) => {
									if (result.status == 200) {
										if (result.data == "View_Only") {
											swal("You can view history only")
											navigate('/ticket-list')
										}
										else if (result.data == "Waiting_For_Accpet") {
											swal("Waiting for accept as team lead")
											navigate('/ticket-list')
										}
										else {
											swal("Save Ticket")
											navigate('/ticket-list')
											setCurrentState(result.data);
											setquery(false);
										}

									} else {
										setquery(false);
									}
								})
								.catch((err) => {
									setquery(false);

								});
						}
						if (control.Send_Notification) {
							swal("Sucess", "Send Notication Succefully");
							navigate('/ticket-list')
						}
					}

					setquery(false);

				} else {
					setquery(false);

					swal("Unable to submit data");
				}
			})
			.catch((err) => {
				if (err.response.data) {
					setquery(false);
					swal("WARNING", err.response.data.message, { dangerMode: true });
				}

			});
		// Update the outer component data
		setStateData(newData);
	};

	async function urlToFile(url, fileName) {
		const response = await fetch(url);
		const blob = await response.blob();

		// Ensuring the MIME type is properly handled
		const file = new File([blob], fileName, { type: blob.type || 'application/octet-stream' });
		return file;
	}

	const handleSaveData = (data, files) => {
		data = { ...data }
		data._id = ticketData._id
		data.SR_ID = ticketData.SR_ID
		delete data.Files
		const formData = new FormData();
		formData.append("Data", JSON.stringify(data))
		Array.from(files).forEach((file) => {
			formData.append("files", file)
		})
		setquery(true);
		axios
			.put(api.api + "ticketCustomData", formData)
			.then(async (result) => {
				if (result.status == 200) {
					for (let i = 0; i < result.data.Files.length; i++) {
						result.data.Files[i] = await urlToFile(config.fileUrl + result.data.Files[i].filename, result.data.Files[i].filename);
					}
					setCustomInput(result.data)
					swal("SUCCESS", "Data Saved Successfully");
				}

			})
			.catch((err) => {
				if (err.response.data) {
					setquery(false);
					swal("WARNING", err.response.data.message, { dangerMode: true });
				}

			});
	};








	const handleOnChange = (e) => {
		const { value, name } = e.currentTarget;
		const newData = {
			...stateData,
			[name]: value, // Assuming there's only one key-value pair in the data object
		};
		setStateData(newData);
	};

	const showClientDetail = () => {
		if (ticketData.FieldData) {
			let showData = ticketData.FieldData
			const str = `Name : ${showData.ClientName} , Phone : ${showData.ClientMobNumber}
		 , Email : ${showData.ClientEmailId} , Company : ${showData.CompanyName}`;
			return <><br></br><label>{`Client Detail - ${str}`}</label></>
		}
		return <></>
	}


	return (
		<>
			<MainPagetitle mainTitle="Ticket" pageTitle={'Ticket'} parentTitle={'Home'} />
			<div className="container-fluid text-right">
				{/* <div className="text-center heading-bg mb-4 shadow-sm">
					<h4 className=" p-0 m-0">Ticket Process </h4>
				</div> */}
				<strong>{`TICKET - ${currentState.SR_ID}`}</strong>
				{/* {showClientDetail()} */}
				{currentState.StateName !== "Create SR" &&
					<CheckInCheckOutForm
						setFiles={setFiles}
						allFiles={currentState.AllFiles}
						ticketData={ticketData}
						info={ticketData.SR_Data_Logs && ticketData.SR_Data_Logs.length > 0 ? ticketData.SR_Data_Logs[0].FieldData : {}}
						customInput={customInput}
						setCustomInput={setCustomInput}
					/>}
				{user.role !== "super_admin" && currentState.StateName !== "Create SR" && <div >
					<button onClick={() => handleSaveData(customInput, customInput.Files)} className='btn btn-sm btn-info'>Save Data</button>
				</div>}
				{user.role !== "super_admin" || currentState.StateName == "Create SR" && <div className="card-body Workflow-container d-flex gap-2">
					<WorkFlowStepperAndStateComp
						currentState={currentState}
						stepperList={stepperList}
						WorkFlow={process[0]}
						Dynamicdata={Dynamicdata}
						receivedDataState={receivedDataState}
						UsersStatus={UsersStatus}
						UsersStatusVisibility={true}
						user={user}
						handleOnComponentStateChange={handleOnComponentStateChange}
						handleOnChange={handleOnChange}
						stateData={stateData}
						MoldList={MoldList}
						RefreshState={RefreshState}
						returnValue={returnValue}
						// handelOnClick={handelOnClick}
						setRefreshState={setRefreshState}
						IdName={'SR ID'}
					/>


				</div>}

			</div>
			{(["manager","employee"].includes(user.role)|| (currentState.StateName == "Create SR"))
			&& <FormValidation currentState={currentState.StateName}
				CurrentProcess={currentState.CurrentProcess}
				prevStateData={currentState.PrevStateData}
				name={currentState.FormName}
				Controls={currentState.Control}
				onSubmit={(control, data, file) => handleGoNext(control, data, file)}
				Fields={currentState.Fields} />}


		</>
	);
};

export default CreateTicket;
