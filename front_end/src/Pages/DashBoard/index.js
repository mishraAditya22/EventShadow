import React ,{useState,useEffect,useMemo} from 'react';
import moment from 'moment';
import {UncontrolledDropdown,DropdownToggle,DropdownMenu,DropdownItem,Button,ButtonGroup,Alert} from 'reactstrap';
import api from '../../Services/api';
import '../DashBoard/dashboard.css';
import { useNavigate } from 'react-router';
import socketio from 'socket.io-client';


const DashBoard = ()=>{
    
    const [events,setEvents] = useState([]);
    const [Allevents,setAllEvents] = useState([]);
    const [EventsRequest,setEventsRequest] = useState([]);
    const [flg,setFlg] = useState(false);
    const [mssg,Setmssg] = useState("");
    const [location,setLocation] = useState("Dashboard");

    //user token hai generated waala
    const user = localStorage.getItem('user');
    //user_id _id hai user ki
    const user_id = localStorage.getItem('user_id');

    useEffect(()=>{
        fetchData();
        fetchAllData();
    },[])

    const socket = useMemo( ()=>
        socketio('http://localhost:8000/', {query : { user:user_id }}), [user_id]
    );

    useEffect(()=>{
        socket.on('registration_request', data=> (setEventsRequest([...EventsRequest,data])));
    },[EventsRequest,socket])

    const navigate = useNavigate();

    //yaha bhi user ka koi naata nahi hai api searching mein 
    //tokens ke liye bheja hai user ko headers mein 
    const fetchAllData = async()=>{
        try{
            const AllData = await api.get("/dashboard",{headers:{user:user , user_id:user_id}});
            setAllEvents(AllData.data);
        }
        catch(err){
            navigate('/login')
        }
    }
    //yahan pe user ko sirf bheja hai tokens ke liye 
    //api eorking mein use nhi ho rahein hai woh
    const fetchData = async(filter)=>{
        try{
            const url = filter? `/dashboard/${filter}` : "/dashboard";
            const Data = await api.get(url,{headers:{user:user , user_id : user_id}});
            setEvents(Data.data);
        }
        catch(err){
            navigate('/login')
        }
    }

    const filterHandler = (evt)=>{
        fetchData(evt);
    }

    const myEvent = async()=>{
        try{
            //yahan pe user_id ka use ho raha hai api mein 
            //events by id dhundhein mein
            const my = await api.get("/dashboard/myevent",{headers:{user_id:user_id,user:user}});
            // console.log(my.data);
            setEvents(my.data);
            fetchAllData();
        }
        catch(err){
            navigate('/login')
        }
    }

    const deleteEvent = async(evt)=>{
        try{
            const response = await api.delete(`event/${evt}`);
            // console.log(response);
            fetchAllData();
        }
        catch(err){
            navigate('/login');
        }
    }

    const request_event_handler = async(event)=>{
        // console.log(event);
        try{
            await api.post(`/registration/${event.id}`,{},{headers:{user_id}});
            console.log(`event subscription Request sucessfully sent for event_id : ${event.id}`);
            Setmssg(`Event subscription Request sucessfully sent for event_id : ${event.id}`);
            setFlg(true);
            setTimeout(()=>{
                Setmssg("");
                setFlg(false);
            },4000);
        }
        catch(err){
            console.log("error");
        }
    }


    const logoutHandler = async()=>{
        localStorage.removeItem('user');
        localStorage.removeItem('user_id');
        setLocation("");
        navigate('/login');
    }


    const acceptEventHandler = async(event)=>{
        try{
            await api.post(`/registration/${event}/approvals`,{},{headers:{user_id:user_id,user:user}});          
            console.log("Subscription accepted successfully !");
            Setmssg(`Subscription accepted successfully !`);
            setFlg(true);
            removeNotificationFromDashboard(event);
            setTimeout(()=>{
                Setmssg("");
                setFlg(false);
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
            Setmssg(`Subscription recjected successfully !`);
            setFlg(true);
            removeNotificationFromDashboard(event);
            setTimeout(()=>{
                Setmssg("");
                setFlg(false);
            },4000);
        }
        catch(err){
            console.log(err);
        }
    }

    const removeNotificationFromDashboard = (event)=>{
        const newEvents = EventsRequest.filter((x)=>x._id!==event);
        setEventsRequest(newEvents);
    }


    return (
        <>
            {/* <div className="pop"><strong>{mssg}</strong></div> */}
            {flg? (
                    <Alert color="danger" className="pop">{mssg}</Alert>
                ):""}
            <ul className="notification">
                {EventsRequest.map((x)=>{
                    return (
                        <li key={x._id}>
                            {console.log(x._id)}
                            {/* {x.user._id} */}
                            <div>
                                <strong>  {x.user.email}</strong> is requesting for you event 
                                <strong>  {x.event.title}</strong> with 
                                <strong>  price:- </strong>{x.event.price}
                                <ButtonGroup style={{marginLeft:"28%"}}>
                                    <Button
                                        className="filter-btn"
                                        color="success"
                                        outline
                                        onClick={()=> acceptEventHandler(x._id)}
                                        >
                                        Accept
                                    </Button>
                                    <Button
                                        className="filter-btn"
                                        color="danger"
                                        outline
                                        onClick={()=> rejectEventHandler(x._id)}
                                        >
                                        Reject
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </li>
                    )
                })}
            </ul>
            <hr/>
            <UncontrolledDropdown group>
                <Button color="warning">
                    {location}
                </Button>
                <DropdownToggle
                    caret
                    color="primary"
                />
                <DropdownMenu>
                    <DropdownItem onClick={()=>(setLocation("Requests") , navigate('/requests'))}>
                        Requests
                    </DropdownItem>
                    <DropdownItem onClick={()=>(setLocation("Add Events") , navigate('/events'))}>
                        Add More Subscription
                    </DropdownItem>
                    <DropdownItem onClick={()=>logoutHandler()}>
                        Log out
                    </DropdownItem>
                </DropdownMenu>
                </UncontrolledDropdown>
            <hr/>
            
            <h1>Filter By :</h1>
            <ButtonGroup>
                <Button
                    className="filter-btn"
                    color="primary"
                    outline
                    onClick={()=>filterHandler(null)}
                    >
                    All
                </Button>
            </ButtonGroup>
            <ButtonGroup>
                <Button
                    className="filter-btn"
                    color="primary"
                    outline
                    onClick={myEvent}
                    >
                    My Events
                </Button>
            </ButtonGroup>
            {Allevents.map((y)=>{
                return (
                    <ButtonGroup>
                        <Button
                            className="filter-btn"
                            color="primary"
                            outline
                            onClick={()=>filterHandler(y.sport)}
                            >
                                {y.sport}
                        </Button>
                    </ButtonGroup>
                )
            })}
            <hr/>
            <ul className="event-list">
                {events.map((x)=>{
                    return (
                        <li key={x._id}>
                            <header style={{backgroundImage: `url(${x.thumbnail_url})`}}>
                                <div>
                                    {x.user===user_id ? <Button color="danger" size="sm" onClick={()=>{deleteEvent(x._id)}}>Delete</Button> : ""}
                                </div>
                            </header>
                            <ul>
                                <li>Event Title : <strong>{x.title}</strong></li>
                                <li><span>Event Price : {x.price}</span></li>
                                <li><span>Event Description : {x.description}</span></li>
                                <li><span>Event Sport : {x.sport}</span></li>
                                <li><span>Event Date : {moment(x.date).format("DD/MM/YY")}</span></li>
                            </ul>
                            <hr/>
                            <button className="submit-btn" onClick={()=>request_event_handler(x)}>Subscribe </button>
                        </li>
                    )
                })}
            </ul>
        </>
    )
};

export default DashBoard;