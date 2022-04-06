import React from 'react';
import axios from 'axios';
import { API_URL } from '../url';
import '../css stylesheets/signup.css';
import {Link} from 'react-router-dom';

interface postData{
    name: string,
    // stdNumber: string,
    rollNumber: string,
    email: string,
    mobileNumber: string,
    otp: string,
    year: string,
    branch: string,
    isHostler: boolean
}

const SignUp = () => {
    const [notification,setNotification] = React.useState<string>('')
    const [bool,setBool] = React.useState<boolean>(false)
    const [data,setData] = React.useState<postData>({
        name: '',
        // stdNumber: '',
        rollNumber: '',
        email: '',
        mobileNumber: '',
        otp: '',
        year: '',
        branch: '',
        isHostler: false
        });
    function handleData(e){
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }
    
    function handleResidency(e: React.ChangeEvent<HTMLInputElement>){
        if(e.target.value==='true'){
            setData({
                ...data,
                isHostler: true
            })
        }
        else{
            setData({
                ...data,
                isHostler: false
            })
        }
    }
    function resetFields(){
        setData({
            name: '',
            // stdNumber: '',
            rollNumber: '',
            email: '',
            mobileNumber: '',
            otp: '',
            year: '',
            branch: '',
            isHostler: false
        })
    }
    function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setNotification("abc")
        axios.post(API_URL+'/signUp', data).then((dataBack)=>{
            console.log(dataBack)
            setNotification(dataBack.data.message)
            setBool(true)
            if(notification==='You have been successfully Registered'){
                resetFields();
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    if(bool){
        setTimeout(()=>{
            setBool(false)
            setNotification("")
        },2000)
    } 
    return(
        <div id="signup-cont">
            {/* <div id="csi-header-sign">
                <div id="csilogo-sign"><img alt="logo" src={require('../assets/logo.png')}></img></div>
            </div> */}
            <form onSubmit={handleSubmit} className="form-sign">
                <div className="verify-em">Register</div>
                
                <div className="sign-row">
                    <div className="label-transform-sign">
                    <input name="name" type="text" onChange={handleData} value={data.name} autoComplete='off' className="input-box" required/>
                        <label htmlFor="name" className="label-name">
                            <span className="content-name">Name</span>
                        </label>           
                    </div>
                    <div className="label-transform-sign">
                    <input name="stdNumber" type="text" autoComplete='off' className="input-box" required/>
                        <label htmlFor="stdNumber" className="label-name">
                            <span className="content-name">Student Number</span>
                        </label>           
                    </div>
                </div>

                <div className="sign-row">
                    <div className="label-transform-sign">
                    <input name="rollNumber" type="text" onChange={handleData} value={data.rollNumber} autoComplete='off' className="input-box" required/>
                        <label htmlFor="rollNumber" className="label-name">
                            <span className="content-name">Roll Number</span>
                        </label>           
                    </div>
                    <div className="label-transform-sign">
                    <input name="email" type="text" onChange={handleData} value={data.email} autoComplete='off' className="input-box" required/>
                        <label htmlFor="email" className="label-name">
                            <span className="content-name">Email ID</span>
                        </label>           
                    </div>
                </div>

                <div className="sign-row">
                    <div className="label-transform-sign">
                    <input name="mobileNumber" type="text" onChange={handleData} value={data.mobileNumber} autoComplete='off' className="input-box" required/>
                        <label htmlFor="mobileNumber" className="label-name">
                            <span className="content-name">Mobile Number</span>
                        </label>           
                    </div>
                    <div className="label-transform-sign">
                    <input name="otp" type="text" onChange={handleData} value={data.otp} autoComplete='off' className="input-box" required/>
                        <label htmlFor="otp" className="label-name">
                            <span className="content-name">OTP</span>
                        </label>           
                    </div>
                </div>

                <div className="sign-row">
                    <select name="year" onChange={handleData} value={data.year} className="sign-select">
                        <option value="" disabled>Year</option>
                        <option value="2">2</option>
                    </select>
                    <select name="branch" onChange={handleData} value={data.branch} className="sign-select">
                        <option value='' disabled>Branch</option>
                        <option value="CS">CS</option>
                        <option value="CS-IT">CS-IT</option>
                        <option value="IT">IT</option>
                        <option value="CSE">CSE</option>
                        <option value="ECE">ECE</option>
                        <option value="ELECTRICAL">EN</option>
                    </select>
                </div>

                <div className="sign-row">
                    <label>
                    <input type="radio" name="isHostler" onChange={handleResidency} value="true" defaultChecked className="sign-radio"/>
                    Hostler</label> 
                    <label>
                    <input type="radio" name="isHostler" value="false" className="sign-radio"/>
                    Day Scholar</label>
                </div>

                <div id="login-button">
                    <button type="submit" className="submit-button">{notification===''?'Register':notification==='abc'?"Loading...":notification==="You have been successfully Registered"?"You have been successfully Registered":notification}</button>
                </div>
                    <div id="notregistered"><Link to='/logIn'><span id="link">Go to Login Page</span></Link></div>
            </form>
        </div>
    )
}

export default SignUp;