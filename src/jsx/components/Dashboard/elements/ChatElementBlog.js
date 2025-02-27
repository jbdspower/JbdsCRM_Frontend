import React, { useEffect, useState } from 'react';
import { IMAGES, SVGICON } from '../../../constant/theme';
import { Dropdown } from 'react-bootstrap';
import { MentionsInput, Mention } from 'react-mentions'
import axios from '../../../../services/AxiosInstance';
import api from '../../../config.json'
import moment from 'moment';
import { Mentions } from 'antd';
import '../../../index.css'
const ChatElementBlog = ({ ticketData, ticketId }) => {
    const [globalSelect, setGlobalSelect] = useState('Setting');
    const [comment, setComment] = useState("");
    const [mentionOptions, setMensionOptions] = useState([]);
    const [allComment, setAllComment] = useState({ RcvdMsg: [], SentMsg: [] })
    useEffect(() => {
        getAllComment()
        if (ticketData) {
            const option = []
            ticketData.SR_Data_Logs && ticketData.SR_Data_Logs.forEach(x => {
                if (x.FieldData && x.FieldData && x.FieldData.AssignPerson) {
                    x.FieldData.AssignPerson.forEach((one) => {
                        option.push({ label: one.value, value: one.value })
                    })
                }
            })
            setMensionOptions(option)
        }
    }, [ticketId])
    const createComment = () => {
        axios.post(api.api + "ticketComment", { Message: comment, TicketId: ticketId })
            .then((result) => {
                setComment("");
                getAllComment()
            })
            .catch((err) => {
                console.log(err);
            })
    }
    const getAllComment = () => {
        axios.put(api.api + "ticketComment", { TicketId: ticketId })
            .then((result) => {
                setComment("");
                setAllComment(result.data)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <>
            <div className="card">
                {/* <div className="card-header border-0 mb-0">
                    <h4 className="heading mb-0">Comment</h4>
                    <div className="d-flex align-items-center cs-settiong">
                       {SVGICON.Setting}
                        <Dropdown className='global-drop'>
                            <Dropdown.Toggle as="div" className='i-false global-drop-toggle'>                            
                                {globalSelect}{" "}
                                <i className="fa-solid fa-chevron-down" /> 
                            </Dropdown.Toggle>
                            <Dropdown.Menu className='global-drop-menu'>
                                <Dropdown.Item onClick={()=>setGlobalSelect('Setting')}>Setting</Dropdown.Item>
                                <Dropdown.Item onClick={()=>setGlobalSelect('Group')}>Group</Dropdown.Item>
                                <Dropdown.Item onClick={()=>setGlobalSelect('Chat')}>Chat</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>	
                </div> */}
                <div className="card-body pt-0 mt-1">
                    <div className="chat-box-area style-1 dz-scroll" id="chartBox2">
                        <div className="media">
                            <div className="message-received w-auto">
                                <div className="d-flex">
                                    <img src={IMAGES.contact2} className="avatar rounded-circle" alt="" />
                                    <div className="ms-1 text">
                                        {/* {allComment.RcvdMsg.map((x) => {
                                            return <>
                                                <p className="mb-1">{x.Message}</p>
                                                <span>{moment(new Date(x.CommentDate)).format("h:mm a")}</span>
                                            </>
                                        })} */}
                                        {allComment.RcvdMsg.map((x) => {
                                            return <>
                                                <p className="mb-1">{x.Message}</p>
                                                <span className="fs-12">{moment(new Date(x.CommentDate)).format("DD-MMM-YYYY h:mm a")}</span>
                                            </>
                                        })}
                                    </div>
                                </div>
                            </div>

                        </div>
                        {/* <span className="text-center d-block mb-4">Today</span> */}
                        <div className="media justify-content-end align-items-end ms-auto">
                            <div className="message-sent w-auto">
                                {allComment.SentMsg.map((x) => {
                                    return <>
                                        <p className="mb-1">{x.Message}</p>
                                        <span className="fs-12">{moment(new Date(x.CommentDate)).format("DD-MMM-YYYY h:mm a")}</span>
                                    </>
                                })}
                                {/* <p className="mb-1">Okay, I’ll arrange it soon. i noftify you when</p>
                                <p className="mb-1">Very Good morning</p>
                                <p>Okay, I’ll arrange it soon. i noftify you when it’s done<br />
                                    +91-235 2574 2566<br />
                                    kk Sharma<br />
                                    pan card eeer2063i</p> */}

                            </div>
                        </div>
                    </div>
                    <div className="message-send">
                        <div className="type-massage style-1">
                            <div className="input-group">
                                <Mentions
                                    placeholder='input type for mention @'
                                    className="mentions-dropdown-zindex"
                                    style={{
                                        width: '100%',
                                        zIndex: 9999,
                                        position: 'relative'
                                    }}
                                    value={comment}
                                    prefix={['@']}
                                    onChange={(val) => setComment(val)}
                                    options={mentionOptions}
                                />

                                {/* <textarea defaultValue={comment} onChange={(e) => setComment(e.target.value)} rows="1" className="form-control" placeholder="Hello user..."></textarea> */}
                            </div>

                        </div>
                        <button onClick={createComment} type="button" className="btn btn-primary p-2">
                            Comment{" "}
                            {SVGICON.Attachment}
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
};

export default ChatElementBlog;