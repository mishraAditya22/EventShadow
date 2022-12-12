import React , {useState} from 'react';
import { Button,Form,FormGroup,Input,Alert } from 'reactstrap';
import {useNavigate} from 'react-router-dom';
import api from '../../Services/api';
import {Container} from 'reactstrap';

const Login = ()=>{
    let navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const [message,setMessage] = useState("false");
    const [error,SetError] = useState(false)

    const handleEvent = async (event)=>{
        event.preventDefault();

        const response = await api.post('/login', {email,password});
        const user_id = response.data.user_id || false;
        const user = response.data.user || false
        try{
            if(user && user_id){
                localStorage.setItem('user',user);
                localStorage.setItem('user_id',user_id);
                //usenavigate method instead
                navigate("/");
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
            setMessage(err);
        }
    }

    return (
        <>
            <Container>
                <h1>Login :- </h1>
                <p>Please <strong>Login</strong> to your Account</p>
                <Form onSubmit={handleEvent}>
                    <FormGroup className="mb-2 me-sm-2 mb-sm-0">
                        <Input
                        id="exampleEmail"
                        name="email"
                        placeholder="Enter Your Email"
                        type="email"
                        onChange={evt=> setEmail(evt.target.value)}
                        />
                    </FormGroup>
                    <FormGroup className="mb-2 me-sm-2 mb-sm-0">
                        <Input
                        id="examplePassword"
                        name="password"
                        placeholder="Enter Your Password"
                        type="password"
                        onChange={evt=> setPassword(evt.target.value)}
                        />
                    </FormGroup>
                    <Button className="submit-btn">
                        Submit
                    </Button>
                    <Button className="submit-btn" onClick={()=>{navigate("/register");}}>
                        New Account 
                    </Button>
                </Form>
                {error? (
                    <Alert color="danger" className="mssg">{message}</Alert>
                ):""}
            </Container>
        </>
    )
}

export default Login;