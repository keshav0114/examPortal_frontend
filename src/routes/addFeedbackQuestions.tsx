import React from 'react';
import axios from 'axios';
import { API_URL } from '../url';
import {Redirect} from 'react-router-dom'



const AddFeedbackQuestion = () => {
    const [ques,setQues] = React.useState<string>('');
    const [bool,setBool] = React.useState<boolean>(false)
    const[response,setResponse] = React.useState<string>("")
    function typeQues(e: React.ChangeEvent<HTMLInputElement>){
        setQues(e.target.value)
    }    
    function submitFeedback(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setResponse("abc")
        if(ques===''){
            setResponse('Question is required')
            setBool(true)
        }
        else{
            const data = {
                question: ques
            }
            const token = localStorage.getItem("admintoken");
            axios.post(API_URL+'/auth/addFeedbackQuestion', data,{headers: {gettoken: token}}).then((data)=>{
                if(data.data.message==='invalid token'){
                    localStorage.removeItem('admintoken')
                }
                else{
                    setResponse(data.data.message)
                    setBool(true)
                    setQues('');
                }
            }).catch((err)=>{
                console.log(err)
            })
        }
    }
    if(bool){
        setTimeout(()=>{
            setBool(false)
        },2500)
    }
    return localStorage.getItem('admintoken')?(
        <div id="add-feedback-question-block">
            <form onSubmit={submitFeedback}>
                <label className="feedback-label" htmlFor="ques">Write a feedback Question</label>
                <input className="feedback-input" type="text" name="ques" onChange={typeQues} value={ques} autoComplete='off' />
                <br/>
                <button className="feedback-button" type="submit">{response==='abc'?'Loading...':'Add'}</button>
                <div id="note-feedback">{bool?response:null} </div> 
            </form>  
        </div>
    ):<Redirect to='/logIn'/>
}


export default AddFeedbackQuestion;