import React , {useState} from 'react';
import { Button,Form,FormGroup,Input,Container,Alert } from 'reactstrap';
import {useNavigate} from 'react-router-dom';
import api from '../../Services/api';

const Register = ()=>{
    let navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [firstName,setFirstName] = useState("");
    const [lastName,setlastName] = useState("");
    const [message,setMessage] = useState("false");
    const [error,SetError] = useState(false)

    const handleEvent = async (event)=>{
        event.preventDefault();
        //console.log('result of the submit', email, password)
        //console.log(firstName , lastName);

        try{
            if(email==="" || password==="" || firstName==="" || lastName===""){
                SetError(true);
                setMessage("Required Fields Missing !");
                setTimeout(()=>{
                    SetError(false)
                       setMessage("")
                },4000);
            }
            else{
                const response = await api.post('/user/register', {firstName,lastName,email,password});
                const user = response.data.user || false;
                const user_id = response.data._id || false;
                console.log(response);
                try{
                    if(response.data._id || (user && user_id) ){
                        localStorage.setItem('user',user);
                        localStorage.setItem("user_id",user_id)
                        //usenavigate method instead
                        navigate("/login");
                    }
                    else{
                        const messg  = response.data.message;
                        console.log(messg);
                        SetError(true);
                        setMessage(messg);
                        setTimeout(()=>{
                            SetError(false)
                            setMessage("")
                        },4000);
                    }
                } catch(err){
                    SetError(true)
                    setMessage(err);
                }
            }
        } catch(err){
            console.log(err);
        } 
    }

    return (
        <>
            <Container>
                <h1>Register :- </h1>
                <p>Please <strong>Register</strong> your-self</p>
                <Form onSubmit={handleEvent}>
                    <FormGroup className="mb-2 me-sm-2 mb-sm-0 mt-3">
                        <Input
                        id="exampleEmail"
                        name="firstName"
                        placeholder="Enter Your First Name"
                        type="text"
                        onChange={evt=> setFirstName(evt.target.value)}
                        />
                    </FormGroup>
                    <FormGroup className="mb-2 me-sm-2 mb-sm-0 mt-3">
                        <Input
                        id="exampleEmail"
                        name="lastName"
                        placeholder="Enter Your Last Name"
                        type="text"
                        onChange={evt=> setlastName(evt.target.value)}
                        />
                    </FormGroup>
                    <FormGroup className="mb-2 me-sm-2 mb-sm-0 mt-3">
                        <Input
                        id="exampleEmail"
                        name="email"
                        placeholder="Enter Your Email"
                        type="email"
                        onChange={evt=> setEmail(evt.target.value)}
                        />
                    </FormGroup>
                    <FormGroup className="mb-2 me-sm-2 mb-sm-0 mt-3">
                        <Input
                        id="examplePassword"
                        name="password"
                        placeholder="Enter Your Password"
                        type="password"
                        onChange={evt=> setPassword(evt.target.value)}
                        />
                    </FormGroup>
                    <Button className="mt-3 submit-btn">
                        Submit
                    </Button>
                    <Button className="submit-btn" onClick={()=>{navigate("/login");}}>
                        Already have an Account 
                    </Button>
                </Form>
                {error? (
                    <Alert color="danger" className="mssg">{message}</Alert>
                ):""}
            </Container>
        </>
    )
}

export default Register;