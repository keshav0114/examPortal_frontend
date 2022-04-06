import React from 'react';
import axios from 'axios';
import { API_URL } from '../url';
import {Redirect} from 'react-router-dom'

interface postData{
    name: string,
    // stdNumber: string,
    rollNumber: string,
    email: string,
    mobileNumber: string,
    year: string,
    branch: string,
    isHostler: boolean
}

const AddCandidate = () => {
    const [bool,setBool] = React.useState<boolean>(false)
    const[response,setResponse] = React.useState<string>("")
    const [data,setData] = React.useState<postData>({
        name: '',
        // stdNumber: '',
        rollNumber: '',
        email: '',
        mobileNumber: '',
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
            year: '',
            branch: '',
            isHostler: false
        })
    }
    function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setResponse("abc")
        if(data.name!=='' && data.rollNumber!=='' && data.email!==''
            && data.mobileNumber!=='' && data.year!=='' && data.branch!==''){
                const token = localStorage.getItem("admintoken");
                axios.post(API_URL+'/auth/addCandidate', data,{headers: {gettoken: token}})
                .then((data)=>{
                    if(data.data.message==='invalid token'){
                        localStorage.removeItem('admintoken')
                    }
                    else{
                        setResponse(data.data.message)
                        setBool(true)
                        resetFields();
                    }
                }).catch((err) => {
                    console.log(err)
                })
        }
    }
    if(bool){
        setTimeout(()=>{
            setBool(false)
        },2000)
    }
    return localStorage.getItem('admintoken')?(
        <div id="add-candidate-block">
            <div id="register">Register a candidate</div>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="name">Name</label>
                    <input className="add-candidate-input" name="name" type="text" onChange={handleData} value={data.name} autoComplete='off'/>
                </div>
                <div className="row">   
                    <label htmlFor="stdNumber">Student Number</label>
                    <input className="add-candidate-input" name="stdNumber" type="text" autoComplete='off'/>
                </div>
                <div className="row">
                    <label htmlFor="rollNumber">Roll Number</label>
                    <input className="add-candidate-input" name="rollNumber" type="text" onChange={handleData} value={data.rollNumber} autoComplete='off'/>
                </div>
                <div className="row">
                    <label htmlFor="email">Email-ID</label>
                    <input className="add-candidate-input" name="email" type="text" onChange={handleData} value={data.email} autoComplete='off'/>
                </div>
                <div className="row">   
                    <label htmlFor="mobileNumber">Mobile Number</label>
                    <input className="add-candidate-input" name="mobileNumber" type="text" onChange={handleData} value={data.mobileNumber} autoComplete='off'/>
                </div>
                <div className="row custom">
                    <select name="year" onChange={handleData} value={data.year}>
                        <option value=""disabled>Year</option>
                        <option value="2">2</option>
                    </select>
                    <select name="branch" onChange={handleData} value={data.branch}>
                        <option value='' disabled>Branch</option>
                        <option value="CS">CS</option>
                        <option value="CS-IT">CS-IT</option>
                        <option value="IT">IT</option>
                        <option value="CSE">CSE</option>
                        <option value="ECE">ECE</option>
                        <option value="ELECTRICAL">EN</option>
                    </select>
                </div>
                <div className="row custom">
                    <label>
                        <input className="add-candidate-radio" type="radio" name="isHostler" onChange={handleResidency} value="true" defaultChecked/>
                        Hostler
                    </label> 
                    <label>
                        <input className="add-candidate-radio" type="radio" name="isHostler" value="false"/>
                        Day Scholar
                    </label>
                </div>
                <div className="row custom">
                    <button id="register-button" type="submit">{response==='abc'?"Loading...":"Register"}</button>
                </div>
            </form>
            <div id="add-candidate-note">{bool?response:null}</div>
        </div>
    ):<Redirect to='/logIn'/>
}

export default AddCandidate;