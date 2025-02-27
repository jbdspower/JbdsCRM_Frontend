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
  const [showQuotForm,setQuotForm]=useState(false);

  useEffect(() => getLeadList(), [])

  const getLeadList = () => {
    axiosInstance.get("getAllLead")
      .then((res) => {
        setList(res.data);
      })
      .catch((err) => {
        {
          swal(`${err}`);
        }
      })
  }
  const leadCounters = [
    { title: "All Leads", count: 25 },
    { title: "Today Lead", count: 15 },
    { title: "Quot Sent", count: 15 },
    { title: "Hot Client", count: 15 },
    { title: "Won Leads", count: 15 },
    { title: "Order Lost", count: 15 },
  ];

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
      <LeadNavHeader getLeadList={getLeadList} IsMenu={true} mainTitle="Lead Management" pageTitle={'Leads'} parentTitle={'Lead Management'} />
      <QuaotationForm show={showQuotForm} setShow={setQuotForm}/>
      <div style={{ padding: "20px" }}>
        <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
          {leadCounters.map((counter, index) => (
            <Col span={4} key={index}>
              <Card style={{ textAlign: "center" }}>
                <h3>{counter.title}</h3>
                <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                  {counter.count}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
        <div>
          {list.map((lead, index) => (
            <Card
              key={index}
              style={{ marginBottom: "16px", border: 'solid  1px' }}
              bodyStyle={{ padding: "16px" }}
            >
              <Row justify="space-between" align={'middle'}>
                {/* Lead Details */}
                <Col style={{ border: 'solid  1px' }} span={18}>
                  <Row>
                    <Col span={3}>
                      <b>Lead ID</b>
                    </Col>
                    <Col span={3}>
                      <b>Lead Date</b>
                    </Col>
                    <Col span={3}>
                      <b>Closure Date</b>
                    </Col>
                    <Col span={3}>
                      <b>Deal Value</b>
                    </Col>
                    <Col span={4}>
                      <b>Quote Value</b>
                    </Col>
                    <Col span={4}>
                      <button className="btn btn-sm btn-primary">{lead.Stage}</button>
                    </Col>
                    <Col span={3}>
                      <div className="mt-4">
                        <HistoryOutlined style={{ fontSize: 25 }} />
                        <span style={{ marginLeft: 10 }}>History</span>
                      </div>

                    </Col>
                  </Row>
                  <Row>
                    <Col span={3}>{lead.Id || '-'}</Col>
                    <Col span={3}>{moment(lead.createdAt).format('DD-MMM-YYYY')}</Col>
                    <Col span={3}>{moment(lead.ClosureDate).format('DD-MMM-YYYY')}</Col>
                    <Col span={3}>{lead.LeadValue}</Col>
                    <Col span={4}>{lead.QuoteValue}</Col>

                  </Row>
                  <Row className="mt-5">
                    <Col span={20}>
                      <h3>RECD 500 Kva <EditOutlined /></h3>
                    </Col>
                    <Col style={{ justifyItems: 'center' }} span={4}>
                      <h3>
                        {lead["StarIcon"] ?
                          <StarFilled style={{color:'#0D99FF'}}  onClick={() => handleIconUpdate(index, 'StarIcon', !lead["StarIcon"])} />
                          : <StarOutlined onClick={() => handleIconUpdate(index, 'StarIcon', !lead["StarIcon"])} />
                        }
                      </h3>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col span={20}>
                      <h4>Quote Date </h4>
                    </Col>
                    <Col style={{ justifyItems: 'center' }} span={4}>
                      <h3>
                        {!lead["FollowIcon"] ?
                          <DislikeFilled style={{color:'#0D99FF'}} onClick={() => handleIconUpdate(index, 'FollowIcon', !lead["FollowIcon"])} />
                          : <DislikeOutlined onClick={() => handleIconUpdate(index, 'FollowIcon', !lead["FollowIcon"])} />
                        }
                      </h3>
                    </Col>
                  </Row>
                  <Row className="mt-1">
                    <Col span={20}>
                      <Tag >{moment(lead.QuotaionDate).format('DD-MM-YYYY')}</Tag>

                    </Col>
                    <Col style={{ justifyItems: 'center' }} span={4}>
                      <h3>
                        {lead["FollowIcon"] ?
                          <LikeFilled style={{color:'#0D99FF'}} onClick={() => handleIconUpdate(index, 'FollowIcon', !lead["FollowIcon"])} />
                          : <LikeOutlined onClick={() => handleIconUpdate(index, 'FollowIcon', !lead["FollowIcon"])} />
                        }
                      </h3>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col span={20}>
                      <Steps
                        items={[
                          {
                            title: 'Pending',
                            status: 'finish',
                            icon: <CheckCircleFilled />,
                          },
                          {
                            title: 'Contacted',
                            status: 'finish',
                            icon: <PhoneOutlined />,
                          },
                          {
                            title: 'Quote Sent',
                            status: 'finish',
                            icon: <SaveOutlined />,
                          },
                          {
                            title: 'Meeting Done',
                            status: 'finish',
                            icon: <UsergroupAddOutlined />,
                          },
                        ]}
                      />
                    </Col>
                  </Row>
                  <Row style={{ borderTop: '1px solid', padding: 0 }} className="mt-3 p-0">
                    <Col span={10}>
                      <h6>Next Follow Up</h6>
                      <span>07-Dec-2024 <EditOutlined /></span>
                    </Col>
                    <Col className="mt-3" span={14}>
                      <Button color="gray" shape="round" size='small'>
                        Call 0 / 0
                      </Button>
                      <Button style={{ marginLeft: 10 }} color="gray" shape="round" size='small'>
                        Meeting 0 / 0
                      </Button>
                      <Button onClick={()=>setQuotForm(true)} style={{ marginLeft: 10, background: '#5D3FD3', color: 'white' }} shape="round" size='small'>
                        Send Quotaion
                      </Button>
                      <Button style={{ marginLeft: 10, background: '#5D3FD3', color: 'white' }} shape="round" size='small'>
                        View Quot
                      </Button>
                    </Col>
                  </Row>
                </Col>
                <Col style={{ border: 'solid  1px', padding: 6, height: 378 }} span={6}>
                  <div style={{ borderBottom: 'solid  1px', marginBottom: 2 }} >
                    <h4>FROM</h4>
                    <p><b>Company Name:</b> {lead.Company}</p>
                    <p><b>Contact Person:</b>{lead.Name}</p>
                    <p><b>Mobile:</b> {lead.Mobile}</p>
                    <p><b>Email:</b> {lead.Email || "-"}</p>
                    <p><b>Location:</b> {lead.Address}</p>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Space>
                        <Button icon={<EyeOutlined />} style={{ color: '#5D3FD3' }} type="default" size="small">
                          View More
                        </Button>
                        <Button style={{ color: '#5D3FD3', marginLeft: 70 }} icon={<EditOutlined />} size="small">Edit</Button>
                      </Space>
                    </Space>
                  </div>
                  <div>
                    <p style={{ color: 'black' }}>TO <Button style={{ marginLeft: 120, background: '#5D3FD3', color: 'white' }} shape="round" size='small'>
                      + Assign Lead
                    </Button></p>
                    <p style={{ lineHeight: 0, marginTop: 0 }}>Sandeep , Rahul</p>
                    <div style={{ display: 'flex' }}><PhoneFilled style={{ color: 'green', fontSize: 30 }} />
                      <WhatsAppOutlined style={{ marginLeft: 60, color: 'green', fontSize: 30 }} />
                      <MailOutlined style={{ marginLeft: 60, color: 'green', fontSize: 30 }} /></div>
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
