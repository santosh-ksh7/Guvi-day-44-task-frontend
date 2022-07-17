import './App.css';
import { useFormik } from 'formik';
import * as yup from "yup";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {Routes, Route, Link, useNavigate} from "react-router-dom"
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function App() {
  return (
    <div className="App">

      <nav style={{display: "flex", justifyContent: "space-around", backgroundColor: "wheat", padding: "10px" }}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/reset">Reset</Link>
      </nav>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<RegisterForm />} />
        <Route path='/reset' element={<ResetForm />} />
        <Route path='/reset1' element={<ResetForm1 />} />
        <Route path='/reset2' element={<ResetForm2 />} />
        <Route path='/login' element={<LoginForm />} />
      </Routes>

    </div>
  );
}

export default App;

const base_url = "https://password-reset-flow-1.herokuapp.com"


function Home(){
  return(
    <div>
      <h2>Welcome to the application.</h2>
      <h4>The purpose of this application is to let users login, register new users, resest their password.</h4>
      <h4>In order to test the flow & functionality make sure check the following requirements to: -</h4>
      <li>Use the top navbar for quick links</li>
      <li>Register to create an account with a valid gmail</li>
      <li>Log-in in using your email id & password</li>
      <li>Hit the reset link in the navigation bar. This will send you a mail with a :- random string & a link to reset the password.</li>
      <li>Copy the random string from the mail. Hit the link sent to you via the mail enter the random string & resest the password</li>
      <li>After successfully resetting you will be redirected to login page</li>
      <li>Then cross-verify by logging-in with the updated password</li>
    </div>
  )
}


function ResetForm(){

  const formschema = yup.object({
    email: yup.string().required().email()
  })

  const formik= useFormik({
    initialValues: {email:""},
    onSubmit: (values) => {
      fetch(`${base_url}/reset`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "content-type" : "application/json"
        }
      }).then((data)=>data.json()).then((data)=>{
        alert(data.msg)
      })
    },
    validationSchema: formschema,
  })

  return(
    <div>
      <h3>Reset password page</h3>
      <p>Enter your registered e-mail to reset the password</p>
      <form onSubmit={formik.handleSubmit} style={{display: "flex", flexDirection: "column", gap: "20px", width: "400px"}} className='reset-form'>
        <TextField
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="email"
          error={formik.touched.email && formik.errors.email}
          id="standard-error-helper-text"
          label="Enter your e-mail"
          helperText={formik.touched.email && formik.errors.email ? formik.errors.email : null}
          variant="standard"
        />
        <Button type='submit' variant="outlined">Submit</Button>
      </form>
    </div>
  )
}


function ResetForm1(){

  const navigate = useNavigate();

  const formschema = yup.object({
    random_string: yup.string().required()
  })

  const formik= useFormik({
    initialValues: {random_string:""},
    onSubmit: (values) =>{
      fetch(`${base_url}/reset1`, {
        method: "POST",
        body: JSON.stringify(values),
        headers:{
          "content-type":"application/json"
        }
      }).then((data)=>data.json()).then((data)=> {
        console.log(data);
        let dd = data.msg;
        if(dd==="Random string matched"){
          console.log(dd);
          localStorage.setItem("random_string", formik.values.random_string)
          navigate("/reset2")
        }else{
          console.log(data.msg);
          alert(data.msg)
        }
      })
    },
    validationSchema: formschema,
  })

  return(
    <div>
      <h3>Enter the random_string sent by the mail</h3>
      <form onSubmit={formik.handleSubmit} style={{display: "flex", flexDirection: "column", gap: "20px", width: "400px"}} className='reset-form'>
        <TextField
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="random_string"
          error={formik.touched.random_string && formik.errors.random_string}
          id="standard-error-helper-text"
          label="Enter random_string"
          helperText={formik.touched.random_string && formik.errors.random_string ? formik.errors.random_string : null}
          variant="standard"
        />
        <Button type='submit' variant="outlined">Verify</Button>
      </form>
    </div>
  )
}


function ResetForm2(){

  const[show, setShow] =useState(true);

  const navigate = useNavigate();

  const formschema = yup.object({
    password1: yup.string().required().min(8),
    password2: yup.string().required().min(8),
  })

  const random_string = localStorage.getItem("random_string");

  const formik= useFormik({
    initialValues: {password1:"", password2:""},
    onSubmit: (values) =>{
      fetch(`${base_url}/reset2`, {
        method: "POST",
        body: JSON.stringify({...values, random_string}),
        headers:{
          "content-type":"application/json"
        }
      }).then((data)=>data.json()).then((data)=> {
        let xxx = data.msg;
        if(xxx=== "Password succesfully updated"){
          alert(xxx);
          navigate("/login");
        }else{
          alert(xxx);
        }
      })
    },
    validationSchema: formschema,
  })

  return(
    <div>
      <h3>Enter the new password to reset the existing one</h3>
      <form onSubmit={formik.handleSubmit} style={{display: "flex", flexDirection: "column", gap: "20px", width: "400px"}} className='reset-form'>
        <div>
          <TextField
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="password1"
            error={formik.touched.password1 && formik.errors.password1}
            id="standard-password-input"
            label="Enter new password"
            helperText={formik.touched.password1 && formik.errors.password1 ? formik.errors.password1 : null}
            variant="standard"
            type= {show ? "password" : null}
          />
          <IconButton onClick={()=> setShow(!show)}>
            {show ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </IconButton>
        </div>
        <div>
          <TextField
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="password2"
            error={formik.touched.password2 && formik.errors.password2}
            id="standard-password-input"
            label="Re-enter new password"
            helperText={formik.touched.password2 && formik.errors.password2 ? formik.errors.password2 : null}
            variant="standard"
            type= {show ? "password" : null}
          />
          <IconButton onClick={()=> setShow(!show)}>
            {show ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </IconButton>
        </div>
        <Button type='submit' variant="outlined">Reset</Button>
      </form>
    </div>
  )
}


function RegisterForm(){

  const[show, setShow] =useState(true);

  const formschema = yup.object({
    email: yup.string().required().email(),
    password: yup.string().required().min(8)
  })

  const formik= useFormik({
    initialValues: {email:"", password:""},
    onSubmit: (values) => {
      try{
        fetch(`${base_url}/register`, {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "content-type" : "application/json",
          }
        }).then((data)=>data.json()).then((data)=> alert(data.msg))
      }catch(err){
        alert(err)
      }
    // console.log(values)
    },
    validationSchema: formschema,
  })

  return(
    <div>
      <h3>Register to the Application</h3>
      <h5 style={{color: "green"}}>Make sure to use a valid gmail id</h5>
      <form onSubmit={formik.handleSubmit} style={{display: "flex", flexDirection: "column", gap: "20px", width: "400px"}} className='reset-form'>
        <TextField
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="email"
          error={formik.touched.email && formik.errors.email}
          id="standard-error-helper-text"
          label="Enter your e-mail"
          helperText={formik.touched.email && formik.errors.email ? formik.errors.email : null}
          variant="standard"
        />
        <div>
          <TextField
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="password"
            error={formik.touched.password && formik.errors.password}
            id="standard-password-input"
            label="Password"
            helperText={formik.touched.password && formik.errors.password ? formik.errors.password : null}
            type= {show ? "password" : null}
            variant="standard"
          />
          <IconButton onClick={()=> setShow(!show)}>
            {show ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </IconButton>
        </div>
        <Button type='submit' variant="outlined">Register</Button>
      </form>
    </div>
  )
}


function LoginForm(){

  const[msg1, setMsg1] =useState(null);

  const[show, setShow] =useState(true);

  const formschema = yup.object({
    email: yup.string().required().email(),
    password: yup.string().required().min(8)
  })

  const formik= useFormik({
    initialValues: {email:"", password:""},
    validationSchema: formschema,
    onSubmit: (values) => {
      fetch(`${base_url}/login`,{
        method:"POST",
        body: JSON.stringify(values),
        headers: {
          "content-type": "application/json"
        }
      }).then((data)=>data.json()).then((data)=> {alert(data.msg);console.log(data);
        let xxx = data.msg;
        if(xxx==="Invalid credentials"){
          setMsg1(null)
        }else{
          setMsg1("You are viewing this message only because you are successfully logged in. If the credentials were inavlid this message won't display")
        }}
        )
    }
  })

  return(
    <div>
      <h3>Login to the Application</h3>
      <form onSubmit={formik.handleSubmit} style={{display: "flex", flexDirection: "column", gap: "20px", width: "400px"}} className='reset-form'>
        <TextField
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="email"
          error={formik.touched.email && formik.errors.email}
          id="standard-error-helper-text"
          label="Enter your e-mail"
          helperText={formik.touched.email && formik.errors.email ? formik.errors.email : null}
          variant="standard"
        />
        <div>
          <TextField
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="password"
            error={formik.touched.password && formik.errors.password}
            id="standard-password-input"
            label="Password"
            helperText={formik.touched.password && formik.errors.password ? formik.errors.password : null}
            type= {show ? "password" : null}
            variant="standard"
          />
          <IconButton onClick={()=> setShow(!show)}>
            {show ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </IconButton>
        </div>
        <Button type='submit' variant="outlined">Login</Button>
      </form>
      {msg1 ? <p>{msg1}</p> : null}
    </div>
  )
}