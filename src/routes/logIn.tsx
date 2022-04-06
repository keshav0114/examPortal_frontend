import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom'
import { API_URL } from '../url';
import '../css stylesheets/login.css';
import '../media-queries/low-resolution.css';

interface creds {
    rollNumber: string,
    password: string
}

const LogIn = () => {
    const [rollNumber, setRollNumber]=React.useState<string>('');
    const [notification, setNotification]=React.useState<string>('');
    const [password, setPassword]=React.useState<string>('');
    function handleRollNumber(e: React.ChangeEvent<HTMLInputElement>){
        setRollNumber(e.target.value)
    }
    function handlePassword(e: React.ChangeEvent<HTMLInputElement>){
        setPassword(e.target.value)
    }
    function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const dataLog : creds = {
            rollNumber: rollNumber,
            password: password
        }
        setNotification("abc")
        axios.post(API_URL+'/logIn', dataLog).then((result)=>{
            if(result.data.admintoken){
                const token: string = result.data.admintoken;
                localStorage.setItem("admintoken", token)
                setNotification('admin')
            }
            else if(result.data.authtoken){
                const token: string = result.data.authtoken;
                localStorage.setItem("authtoken", token)
                setNotification('participant')
            }
            else{
                setNotification(result.data.message)
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    
    if(notification!=='admin'&&notification!=='participant'&&notification!==''){
        setTimeout(()=>{setNotification('')},3000)
    }



    return localStorage.getItem("admintoken")&&localStorage.getItem("admintoken")!==null?
    <Redirect to='/admin/dashboard'/>:
    localStorage.getItem("authtoken")&&localStorage.getItem("authtoken")!==null?
    <Redirect to='/exam/instructions'/>:(
        <div>
            <div id="irresponsive">
                Display Size Incompatible<br/>Switch to a Desktop/Laptop
            </div>
            <div id="main-container">
                <div id="csi-header">
                    <div id="csilogo"><img alt="logo" src={require('../assets/logo.png')}></img></div>
                    <div id="csi">COMPUTER SOCIETY OF INDIA</div>
                </div>
                <form onSubmit={handleSubmit} className={notification!==''&&notification!=='admin'&&notification!=='abc'&&notification!=='participant'?'form-warn':'form'}>    
                    <h2>Log-In</h2>
                    <div className="label-transform">
                        <input name="rollno" type="text" autoComplete="off" onChange={handleRollNumber} value={rollNumber} className={notification!==''&&notification!=='abc'&&notification!=='admin'&&notification!=='participant'?'input-box-warn':'input-box'} required/>
                        <label htmlFor="rollno" className="label-name">
                            <span className="content-name">Roll Number</span>
                        </label>                          
                        <img className="icon" alt="icon" src={require('../assets/user.png')}></img>                      
                    </div>
                    <div className="label-transform">
                        <input name="password" onChange={handlePassword} value={password} type="password" className={notification!==''&&notification!=='abc'&&notification!=='admin'&&notification!=='participant'?'input-box-warn':'input-box'} required/>
                        <label htmlFor="password" className="label-name">
                            <span className="content-name">Password</span>
                        </label>   
                        <img className="icon" alt="icon" src={require('../assets/lock.png')}></img>
                    </div>
                    <div id="login-button">
                        <div id={notification==='admin'||notification==='participant'?'auth-success':'auth-failure'}><span className='suc-fail'>SUCCESS</span></div>
                        <button type="submit" className="submit-button">{notification==='abc'?'Loading...':'LOGIN'}</button>
                        <div id={notification!==''&&notification!=='abc'&&notification!=='admin'&&notification!=='participant'?'failure-active':'failure-inactive'}><span className='suc-fail'>{notification==="ALREADY APPEARED"?notification:"Incorrect Credentials"}</span></div>
                    </div>
                    {/* <div id="notregistered"><Link to='/verifyEmail'><span id="link">Not Registered Yet?</span></Link></div> */}
                </form>    
            </div>
        </div>
    )
}

export default LogIn;
