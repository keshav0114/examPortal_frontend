import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import { API_URL } from '../url';
import '../css stylesheets/verify-email.css';


const VerifyEmail = () => {
    const [email, setMail] = React.useState<string>('');
    const [bool,setBool] = React.useState<boolean>(false)
    const[response,setResponse] = React.useState<string>("")
    const [redirect,setRedirect] = React.useState<boolean>(false)
    function handleMail(e: React.ChangeEvent<HTMLInputElement>){
        setMail(e.target.value)
    }
    function submitMail(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setResponse("abc")
        axios.post(API_URL+'/verifyEmail', {email: email}).then((data)=>{
            if(data.data.message==='OTP'){
                setResponse('An OTP has been sent to your email. You will be automatically redirected');
                setBool(true)
                setMail('');
            }
            else{
                setResponse(data.data.message)
                setBool(true)
            }
        }).catch((err)=>{
            console.log(err)
        })
    }
    if(bool){
        setTimeout(()=>{
            setBool(false)
            if(response==='An OTP has been sent to your email. You will be automatically redirected'){
                setRedirect(true)
            }
            setResponse("")
        },2000)
    }    
    return redirect?<Redirect to='signUp'/>:(
        <div id="main-container">
            {/* <div id="csi-header">
                <div id="csilogo"><img alt="logo" src={require('../assets/logo.png')}></img></div>
                <div id="csi">COMPUTER SOCIETY OF INDIA</div>
            </div> */}
            <form onSubmit={submitMail} className="form">
                <div className="verify-em">Verify your Email</div>
                <div className="label-transform">
                <input name="email" type="text" onChange={handleMail} value={email} autoComplete='off' className="input-box" required/>
                    <label htmlFor="rollno" className="label-name">
                        <span className="content-name">Email</span>
                    </label>           
                </div>
                <div id="login-button">
                    <button type="submit" className="submit-button">{response===''?'Verify':response==='abc'?"Loading...":response==="An OTP has been sent to your email. You will be automatically redirected"?"OTP SENT":response}</button>
                </div>
                <div className="verify-note">{response==="An OTP has been sent to your email. You will be automatically redirected"?"You will be automatically redirected":null}</div>
            </form>
        </div>
    )
}

export default VerifyEmail;