import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Tag, Divider, Space, Steps } from "antd";
import Icon, { CheckCircleFilled, DislikeFilled, DislikeOutlined, DownloadOutlined, EditOutlined, EyeOutlined, HistoryOutlined, LikeFilled, LikeOutlined, LoadingOutlined, MailOutlined, MessageOutlined, PhoneFilled, PhoneOutlined, SaveOutlined, SmileOutlined, SolutionOutlined, StarFilled, StarOutlined, UsergroupAddOutlined, UserOutlined, WhatsAppOutlined } from '@ant-design/icons'
import MainPagetitle from "../../layouts/MainPagetitle";
import LeadNavHeader from "./LeadNav";
import axiosInstance from "../../../services/AxiosInstance";
import swal from 'sweetalert'
import moment from "moment";
import _ from 'lodash'
import QuaotationForm from "./QuotationForm";

const LeadListPage = () => {
  const [list, setList] = useState([]);
  const [showQuotForm, setQuotForm] = useState(false);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null); // Store only one selected index


  
  useEffect(() => {
    getLeadList();
  }, []);
  
  const getLeadList = () => {
    axiosInstance.get("getAllLead")
      .then((res) => {
        setList(res.data);
        setFilteredLeads(res.data); // Initially show all leads
      })
      .catch((err) => {
        swal(`${err}`);
      });
  };


  // Dynamically calculate lead counters
  const leadCounters = [
    { title: "All Leads", count: list.length, filter: () => list },
    { title: "Today Lead", count: list.filter(lead => moment(lead.createdAt).isSame(moment(), 'day')).length, filter: () => list.filter(lead => moment(lead.createdAt).isSame(moment(), 'day')) },
    { title: "Quot Sent", count: list.filter(lead => lead.Stage === "Quote Sent").length, filter: () => list.filter(lead => lead.Stage === "Quote Sent") },
    { title: "Hot Client", count: list.filter(lead => lead.StarIcon).length, filter: () => list.filter(lead => lead.StarIcon) },
    { title: "Won Leads", count: list.filter(lead => lead.Stage === "Won").length, filter: () => list.filter(lead => lead.Stage === "Won") },
    { title: "Order Lost", count: list.filter(lead => lead.Stage === "Lost").length, filter: () => list.filter(lead => lead.Stage === "Lost") },
  ];


  const handleCardClick = (index) => {
    setSelectedCard(index);
    setFilteredLeads(leadCounters[index].filter()); // Apply filter
  };


  const leadList = [
    {
      leadId: "JP-1",
      leadDate: "05-DEC-2024",
      closureDate: "10-DEC-2024",
      dealValue: "200000",
      quotValue: "210000",
      status: ["Pending", "Contacted", "Quot Sent", "Meeting Done"],
      companyName: "XYZ Pvt. Ltd.",
      contactName: "Mr. Sachin",
      mobile: "999999999",
      email: "xyz@jbdspower.com",
      location: "Gurgaon",
    },
    // Add more leads here
  ];

  const handleIconUpdate = (idx, fieldName, value) => {
    const obj = _.cloneDeep(list[idx])
    obj[fieldName] = value;
    axiosInstance.patch("updateLead", obj)
      .then((result) => {
        const listData = _.cloneDeep(list);
        listData[idx] = obj;
        setList(listData);
        //  getLeadList()
      })
      .catch((err) => {
        swal(`${err}`, { dangerMode: true })
      })
  }

  return (
    <>
    <LeadNavHeader getLeadList={getLeadList} IsMenu={true} mainTitle="Lead Management" pageTitle="Leads" parentTitle="Lead Management" />
    <QuaotationForm show={showQuotForm} setShow={setQuotForm} />

    <div style={{ padding: "10px" }}>
    <Row gutter={[0, 0]} style={{ marginBottom: "10px", padding: "2px"}}>
          {leadCounters.map((counter, index) => (
            <Col span={2} xs={9} lg={2} key={index}>
              <div style={{ position: "relative", cursor: "pointer" }} onClick={() => handleCardClick(index)}>
                <Card
                  style={{
                    textAlign: "center",
                    width: "90%",
                    height: "90px",
                    padding: "2px",
                    border: selectedCard === index ? "2px solid #1890ff" : "1px solid #d9d9d9",
                    transition: "0.3s",
                  }}
                >
                  <h4 style={{ fontSize: "12px" }}>{counter.title}</h4>
                  <p style={{ fontSize: "12px", fontWeight: "bold" }}>{counter.count}</p>
                </Card>
                {selectedCard === index && <CheckCircleFilled style={{ position: "absolute", top: "5px", right: "15px", fontSize: "18px", color: "#1890ff" }} />}
              </div>
            </Col>
          ))}
        </Row>


      <div style={{ maxHeight: "calc(100vh - 20px)", overflowY: "auto" }}>
      {filteredLeads.map((lead, index) => (
        <Card key={index} style={{ marginBottom: "6px", padding: "6px" }}>
        <Row gutter={[4, 4]}>
          <Col xs={24} lg={18}>
            <Row gutter={[3, 3]}>
              {[
                { label: "Lead ID", value: lead.Id || "-" },
                { label: "Lead Date", value: moment(lead.createdAt).format("DD-MMM-YYYY") },
                { label: "Closure Date", value: moment(lead.ClosureDate).format("DD-MMM-YYYY") },
                { label: "Deal Value", value: lead.LeadValue },
                { label: "Quote Value", value: lead.QuoteValue },
              ].map((item, idx) => (
                <Col xs={12} sm={8} md={6} key={idx}>
                  <b>{item.label}</b>
                  <p style={{ marginBottom: "2px" }}>{item.value}</p>
                </Col>
              ))}
              <Col xs={24} sm={6}>
                <Button className="btn btn-sm btn-primary">{lead.Stage}</Button>
              </Col>
              <Col xs={24} sm={6}>
                <HistoryOutlined style={{ fontSize: 16 }} /> <span>History</span>
              </Col>
            </Row>
            <Row justify="space-between" align="middle" style={{ marginTop: 4 }}>
              <Col><h4 style={{ margin: 0, fontSize: "14px" }}>RECD 500 Kva <EditOutlined /></h4></Col>
              <Col>{lead.StarIcon ? <StarFilled style={{ color: "#0D99FF" }} /> : <StarOutlined />}</Col>
            </Row>
            <Row justify="space-between" align="middle" style={{ marginTop: 2 }}>
              <Col><h4 style={{ margin: 0, fontSize: "14px" }}>Quote Date</h4></Col>
              <Col>{lead.FollowIcon ? <LikeFilled style={{ color: "#0D99FF" }} /> : <LikeOutlined />}</Col>
            </Row>
            <Row><Col><Tag>{moment(lead.QuotaionDate).format("DD-MM-YYYY")}</Tag></Col></Row>
            <Steps
              size="small"
              items={[
                { title: 'Pending', status: 'finish', icon: <CheckCircleFilled /> },
                { title: 'Contacted', status: 'finish', icon: <PhoneOutlined /> },
                { title: 'Quote Sent', status: 'finish', icon: <SaveOutlined /> },
                { title: 'Meeting Done', status: 'finish', icon: <UsergroupAddOutlined /> },
              ]}
            />
            <Row justify="space-between" style={{ marginTop: 4, borderTop: "1px solid", paddingTop: 2 }}>
              <Col><h6 style={{ margin: 0, fontSize: "13px" }}>Next Follow Up</h6><span>07-Dec-2024 <EditOutlined /></span></Col>
              <Col>
                <Button size="small">Call 0 / 0</Button>
                <Button size="small" style={{ marginLeft: 3 }}>Meeting 0 / 0</Button>
                <Button size="small" style={{ marginLeft: 3, background: "#5D3FD3", color: "white" }}>Send Quotation</Button>
                <Button size="small" style={{ marginLeft: 3, background: "#5D3FD3", color: "white" }}>View Quote</Button>
              </Col>
            </Row>
          </Col>
      
          <Col xs={24} lg={6} style={{ padding: 2 }}>
            <div style={{ borderBottom: "1px solid" }}>
              <h4 style={{ marginBottom: 2, fontSize: "14px" }}>FROM</h4>
              <p style={{ marginBottom: 2, fontSize: "13px" }}><b>Company:</b> {lead.Company}</p>
              <p style={{ marginBottom: 2, fontSize: "13px" }}><b>Contact:</b> {lead.Name}</p>
              <p style={{ marginBottom: 2, fontSize: "13px" }}><b>Mobile:</b> {lead.Mobile}</p>
              <p style={{ marginBottom: 2, fontSize: "13px" }}><b>Email:</b> {lead.Email || "-"}</p>
              <p style={{ marginBottom: 2, fontSize: "13px" }}><b>Location:</b> {lead.Address}</p>
              <p style={{ marginBottom: 2, fontSize: "13px" }}>
                TO <Button size="small" style={{ float: "right", background: "#5D3FD3", color: "white" }}>+ Assign Lead</Button>
              </p>
              <p style={{ marginBottom: 2, fontSize: "13px" }}>Sandeep, Rahul</p>
              <Space>
                <PhoneFilled style={{ color: "green", fontSize: 16 }} />
                <WhatsAppOutlined style={{ color: "green", fontSize: 16 }} />
                <MailOutlined style={{ color: "green", fontSize: 16 }} />
              </Space>
              <Space style={{ marginTop: 2 }}>
                <Button icon={<EyeOutlined />} size="small">View</Button>
                <Button icon={<EditOutlined />} size="small">Edit</Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>
      
      
        ))}
      </div>
    </div>
  </>
  );
};
export default LeadListPage;
