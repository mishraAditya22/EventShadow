import React , {useState,useMemo} from 'react';
import api from '../../Services/api';
import { UncontrolledDropdown,DropdownToggle,DropdownMenu,DropdownItem ,Button,Form,FormGroup,Input,Container,Alert } from 'reactstrap';
import cameraPhoto from '../../assets/camera.png';
import './event.css';
import  {useNavigate} from 'react-router-dom';

const Events = ()=>{

    const navigate = useNavigate();

    const [ErrorMessage,setErrorMessage] = useState(false);
    const [sucessMessage,setSucessMessage] = useState(false);
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [price,setPrice] = useState("");
    const [thumbnail,setThumbnail] = useState(null);
    const [date,setDate] = useState("");
    const [sport,setSport] = useState("");
    const [location,setLocation] = useState("Add Subscription");

    const submitHandler = async(event)=>{
        event.preventDefault();
        const user_id = localStorage.getItem('user_id');
        const user = localStorage.getItem('user');
        const eventData = new FormData();

        eventData.append("thumbnail",thumbnail);
        eventData.append("title",title);
        eventData.append("sport",sport);
        eventData.append("price",price);
        eventData.append("description",description);
        eventData.append("date",date);

        try{
            if(title!=="" && thumbnail!==null && sport!=="" && price!=="" && description!=="" && date!==""){
                await api.post('/event',eventData,{headers:{user_id:user_id,user:user}});
                console.log("Event Sent Successfully");
                setSucessMessage(true)
                setTimeout(()=>{
                    setSucessMessage(false);
                },1000)
                setTimeout(()=>{
                    navigate("/");
                },1800);
            }
            else{
                setErrorMessage(true)
                setTimeout(()=>{
                    setErrorMessage(false);
                },5000)
                console.log("Missing Required Data");
            }
        } catch(err){
            navigate('/login');
        }
    }

    const logoutHandler = async()=>{
        localStorage.removeItem('user');
        localStorage.removeItem('user_id');
        setLocation("");
        navigate('/login');
    }

    const preview = useMemo(()=>{
        return thumbnail ? URL.createObjectURL(thumbnail) : null
    }, [thumbnail] )

    return (
        <>
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
                    <DropdownItem onClick={()=>(setLocation("Dashboard") , navigate('/'))}>
                        Dashboard
                    </DropdownItem>
                    <DropdownItem onClick={()=>logoutHandler()}>
                        Log out
                    </DropdownItem>
                </DropdownMenu>
                </UncontrolledDropdown>
            <hr/>
            <Container>
                <h1>Set up an Event  :- </h1>
                <p>Please <strong>create</strong> your Event</p>
                <Form onSubmit={submitHandler}>
                    <FormGroup>
                        <label>Upload Image </label>
                        <label id="thumbnail" style={{backgroundImage : `url(${preview})`}} className={thumbnail?'has-thumbnail':''} >
                            <input type="file" onChange={(evt)=> setThumbnail(evt.target.files[0])}/>
                            <img src={cameraPhoto} style={{maxWidth:"50px"}} alt=""/>
                        </label>
                    </FormGroup>
                    <FormGroup>
                        <Input
                        id="title"
                        name="title"
                        value={title}
                        placeholder="Enter Event title"
                        type="text"
                        onChange={evt=> setTitle(evt.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Input
                        id="sport"
                        name="sport"
                        value={sport}
                        placeholder="Enter type of Sport "
                        type="text"
                        onChange={evt=> setSport(evt.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Input
                        id="description"
                        name="decription"
                        value={description}
                        placeholder="Enter Event Description"
                        type="text"
                        onChange={evt=> setDescription(evt.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Input
                        id="price"
                        name="price"
                        value={price}
                        placeholder="Enter enter price "
                        type="text"
                        onChange={evt=> setPrice(evt.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Input
                        id="date"
                        name="date"
                        value={date}
                        placeholder="Enter Date for Event "
                        type="date"
                        onChange={evt=> setDate(evt.target.value)}
                        />
                    </FormGroup>
                    <Button className="mt-3 btn-success submit-btn">
                        Submit
                    </Button>
                    <Button className="submit-btn" onClick={()=>{navigate("/");}}>
                        Dashboard
                    </Button>
                </Form>
                {ErrorMessage? (
                    <Alert color="danger" className="mssg">Missing required imformation</Alert>
                ):""}
                {sucessMessage? (
                    <Alert color="sucess" className="mssg">Event Created Sucessfully !</Alert>
                ):""}
            </Container>
        </>
    )
};

export default Events;