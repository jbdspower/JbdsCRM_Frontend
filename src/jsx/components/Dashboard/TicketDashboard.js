import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash'
import { ThemeContext } from "../../../context/ThemeContext";
import MainPagetitle from '../../layouts/MainPagetitle';
import CardWidget from './elements/CardWidget';

import axiosInstance from '../../../services/AxiosInstance';
import config from '../../config.json'
import ChartPie from '../charts/Chartjs/pie';
import TicketList from '../TicketProcess/TicketList';
import MyCalendar from './elements/MyCalender';
import LocationDetails from '../Location/LocationDeatils';
import PieChartShowModal from './PieChartShowModal'

// const DashboardComboChart = loadable(() =>
// 	pMinDelay(import("./Dashboard/DashboardComboChart"), 1000)
// );
const widgetDashboard = [
	{ title: "Total Employee", icon: "user", count: 0, ids: [] },
	{ title: "Active Employee", icon: "user", count: 0, ids: [] },
	{ title: "Total Active Ticket", icon: "chart", count: 0, ids: [] },
	{ title: "Month Ticket", icon: "chart", count: 0, ids: [] },
	{ title: "On Hold Ticket", icon: "chart", count: 0, ids: [] },
	{ title: "Due Date Ticket", icon: "chart", count: 0, ids: [] },
	{ title: "Closed Ticket", icon: "chart", count: 0, ids: [] }

]
const TicketDashboard = () => {
	const [showModal, setShowModal] = useState(false);
	const [param, setParam] = useState("");
	const [filterIds, setFilterIds] = useState([]);
	const [searchText,setSearchText]=useState("")
	const [widgets, setWidgets] = useState(widgetDashboard);
	const [data, setData] = useState({ ticketStatus: [], ticketPriority: [] });
	const [calenderEvents, setCalenderEvents] = useState([])
	const [calenderEventsCache, setCalenderEventsCache] = useState([])
	const { changeBackground } = useContext(ThemeContext);
	const currentUser = JSON.parse(localStorage.getItem('userDetails'));
	useEffect(() => {
		getAllTicket();
		changeBackground({ value: "light", label: "Light" });
	}, []);

	const getAllTicket = () => {
		axiosInstance.post(config.api + "GetDashboardData", {})
			.then((result) => {
				const widget = [...widgetDashboard];

				widget[0].count = result.data.totalEmployee.count;
				widget[0].ids = result.data.totalEmployee.ids;

				widget[1].count = result.data.activeEmployee.count;
				widget[1].ids = result.data.activeEmployee.ids;

				widget[2].count = result.data.activeTicket.count;
				widget[2].ids = result.data.activeTicket.ids;

				widget[3].count = result.data.monthTicket.count;
				widget[3].ids = result.data.monthTicket.ids;

				widget[4].count = result.data.onHoldTicket.count;
				widget[4].ids = result.data.onHoldTicket.ids;

				widget[5].count = result.data.dueDateTicket.count;
				widget[5].ids = result.data.dueDateTicket.ids;

				widget[6].count = result.data.closeTicket.count;
				widget[6].ids = result.data.closeTicket.ids;

				setWidgets(widget);
				setData(result.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getChartData = (Param) => {
		const allData = { ...data };
		let colors = [
			"rgba(128, 0, 128, 1)",
			"rgba(153, 50, 204, 0.7)",
			"rgba(186, 85, 211, 0.5)",
			"rgba(221, 160, 221, 0.3)",
		]
		const chartData = { labels: [], data: [], colors: [] };
		if (Param === "Status") {
			chartData.labels = allData.ticketStatus.map(x => x.Status);
			chartData.data = allData.ticketStatus.map(x => x.Count);
			chartData.colors = allData.ticketStatus.map(x => x.Color)
		}
		if (Param === "Priority") {
			chartData.labels = allData.ticketPriority.map(x => x.Priority);
			chartData.data = allData.ticketPriority.map(x => x.Count);
			chartData.colors = colors
		}
		return chartData;
	};

	const handleClickChart = (label, value, Id) => {
		const allData = { ...data };
		if (Id == "Status") {
			setShowModal(true);
			setParam(label);
			let ids = allData.ticketStatus.filter(x => x.Status == label)
			let allIds = []
			ids.forEach(x => {
				allIds = [...allIds, ...x.Ids]
			});
			setFilterIds(allIds)
		} else {
			setShowModal(true);
			setParam(label);
			let ids = allData.ticketPriority.filter(x => x.Priority == label)
			let allIds = []
			ids.forEach(x => {
				allIds = [...allIds, ...x.Ids]
			});
			setFilterIds(allIds)
		}


	}

	const handleClickWidget = (widget = {}) => {
		setShowModal(true);
		setParam(widget.title);
		setFilterIds(widget.ids)
	}

	const getEmployess = () => {
		const list = _.cloneDeep(calenderEvents)
		const employee = _.uniqBy(list, "userName").filter(x => currentUser && x.userName !== currentUser.name)
		return employee
	}


	return (
		<>
			<MainPagetitle mainTitle="Dashboard" pageTitle="Dashboard" parentTitle="Home" />
			<div className="container-fluid">
				<PieChartShowModal ids={filterIds} title={param} onHide={() => setShowModal(false)} key={param} show={showModal} />
				<div className="row">
					<div className="col-xl-9 wid-100">
						<div className="row">
							<CardWidget onClick={handleClickWidget} widgets={widgets} />
							<div className="col-xl-6">
								<div className='card'>
									<div className="card-header border-0 pb-0 flex-wrap">
										<h4 className="heading mb-0">TICKET STATUS</h4>
									</div>
									<div className="card-body">
										<ChartPie onClick={(label, value) => handleClickChart(label, value, "Status")} colors={getChartData("Status").colors} datalabels={getChartData("Status").labels} chartData={getChartData("Status").data} />
									</div>
								</div>
							</div>
							<div className="col-xl-6">
								<div className='card'>
									<div className="card-header border-0 pb-0 flex-wrap">
										<h4 className="heading mb-0">TICKET PRIORITY</h4>
									</div>
									<div className="card-body">
										<ChartPie
											onClick={(label, value) => handleClickChart(label, value, "Priority")}
											colors={getChartData("Priority").colors}
											datalabels={getChartData("Priority").labels}
											chartData={getChartData("Priority").data} />
										{/* <TicketList isList={true} /> */}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="col-xl-9 wid-100">
						<div className="row">
							<div className="col-xl-12">
								<div className='card'>
									<div className="card-header border-0 pb-0 flex-wrap">
										<h4 className="heading mb-0">TICKET SUMMARY</h4>
										<div>
											<input onChange={(e)=>setSearchText(e.currentTarget.value)} type='text' placeholder='Search ID...' className='form-control form-control-sm'/>
										</div>
									</div>
									<div className="card-body">
										<TicketList search={searchText} isList={true} />
									</div>
								</div>
							</div>

						</div>
					</div>
					<div className="col-xl-9 wid-100">
						<div className="row">
							<div className="col-xl-12">
								<div className='card'>
									<div className="card-header border-0 pb-0 flex-wrap">
										<h4 className="heading mb-0">TICKET LOCATION SUMMARY</h4>
									</div>
									<div className="card-body">
										<LocationDetails isList={true} />
									</div>
								</div>
							</div>

						</div>
					</div>

					<div className="col-xl-9 wid-100">
						<div className="row">
							<div className="col-xl-12">
								<div className="card">
									<div className="card-header border-0 pb-0 flex-wrap">
										<h4 className="heading mb-0">UPCOMMING EVENTS</h4>
										{currentUser && ["manager", "super_admin"].includes(currentUser.role) && <div className="col-lg-3">
											<div className="form-group mb-3 ">
												<select
													onChange={(e) => {
														const list = [...calenderEventsCache];
														if (e.currentTarget.value == "All") {
															setCalenderEvents(list)
														} else {
															setCalenderEvents(list.filter(x => x.userName == e.currentTarget.value))
														}
													}}
													placeholder="Select employee"
													defaultValue={"option"}
													className="form-control form-control-sm"
												>
													<option value={"All"}>All</option>
													{getEmployess().map((x) => {
														return <option>{x.userName}</option>
													})}
												</select>
											</div>
										</div>}
									</div>
									<div className="card-body p-0">
										<MyCalendar events={calenderEvents} getEvents={(events) => { setCalenderEvents(events); setCalenderEventsCache(events) }} />
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

export default TicketDashboard;
