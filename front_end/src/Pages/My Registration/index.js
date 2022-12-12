import React ,{useState,useEffect,useMemo} from 'react';
import moment from 'moment';
import {UncontrolledDropdown,DropdownToggle,DropdownMenu,DropdownItem,Button,ButtonGroup,Alert} from 'reactstrap';
import api from '../../Services/api';
import { useNavigate } from 'react-router';
import '../My Registration/style.css';


const MyRegistration = () => {
    
    const [events,setEvents] = useState([]);
    const [z,setZ] = useState([]);
    const user = localStorage.getItem('user');
    const user_id = localStorage.getItem('user_id');
    const [flg,setFlg] = useState(false);
    const [mssg,setMssg] = useState("");
    
    const navigate = useNavigate();

    useEffect(()=>{
        fetchAllRequests();
    },[]);

    const fetchAllRequests = async()=>{
        try{
            const response = await api.get("/registration/requests",{headers:{user_id:user_id,user:user}});
            // console.log(response.data);
            setEvents(response.data);
        }
        catch(err){
            console.log(err);
            navigate('/login')
        }
    }

    const acceptEventHandler = async(event)=>{
        try{
            await api.post(`/registration/${event}/approvals`,{},{headers:{user_id:user_id,user:user}});          
            console.log("Subscription accepted successfully !");
            setFlg(true);
            setMssg("Accepted Succesfully");
            setTimeout(()=>{
                setFlg(false);
                setMssg("");
            },4000);
        }
        catch(err){
            console.log(err);
        }
    }

    const rejectEventHandler = async(event)=>{
        try{
            await api.post(`/registration/${event}/rejections`,{},{headers:{user_id:user_id,user:user}});
            console.log("Subscription recjected successfully !");
            setFlg(true);
            setMssg("Rejected Succesfully");
            setTimeout(()=>{
                setFlg(false);
                setMssg("");
            },4000);
        }
        catch(err){
            console.log(err);
        }
    }

    const logoutHandler = async()=>{
        localStorage.removeItem('user');
        localStorage.removeItem('user_id');
        navigate('/login');
    }

    const isApproved = (approval)=> approval===true?"Accepted":"Rejected"

    return (
        <>
            {flg? (
                    <Alert color="danger" className="pop">{mssg}</Alert>
                ):""}
            <hr/>
            <UncontrolledDropdown group>
                <Button color="warning">
                    Requests
                </Button>
                <DropdownToggle
                    caret
                    color="primary"
                />
                <DropdownMenu>
                    <DropdownItem onClick={()=>(navigate('/events'))}>
                        Add Subscription
                    </DropdownItem>
                    <DropdownItem onClick={()=>(navigate('/'))}>
                        Dashboard
                    </DropdownItem>
                    <DropdownItem onClick={()=>logoutHandler()}>
                        Log out
                    </DropdownItem>
                </DropdownMenu>
                </UncontrolledDropdown>
            <h1>My Registrations </h1> 
            <hr/>
            <ul className="events">
                { events.length<1?<h1>No Requests Found !!</h1>:
                <>{events.map(event=>{
                    return (
                        <li key={event._id}>
                            <div><strong>event.eventTitle</strong></div>
                            <div className="events-details">
                                <span>Subscription Data : {moment(event.eventDate).format('l')}</span>
                                <hr/>
                                <span>Subscription Price : ${parseFloat(event.eventPrice).toFixed(2)}</span>
                                <span>Subscription Email : {event.userEmail}</span>
                                <span>Status : {event.approval!=='undefined'?isApproved(event.approval):"Pending"}</span>
                            </div>
                            <ButtonGroup style={{marginLeft:"28%"}}>
                                    <Button
                                        className="filter-btn"
                                        color="success"
                                        outline
                                        onClick={()=> acceptEventHandler(event._id)}
                                        >
                                        Accept
                                    </Button>
                                    <Button
                                        className="filter-btn"
                                        color="danger"
                                        outline
                                        onClick={()=> rejectEventHandler(event._id)}
                                        >
                                        Reject
                                    </Button>
                            </ButtonGroup>
                        </li>
                    ) 
                })}
                </>}
            </ul>
        </>
    )
}

export default MyRegistration
