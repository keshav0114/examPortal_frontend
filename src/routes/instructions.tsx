import React from 'react';
import axios from 'axios';
import { API_URL } from '../url';
import {Redirect} from 'react-router-dom';
import '../css stylesheets/instruct.css';


const Instructions = () => {
    const[language, setLanguage]= React.useState<string>('')
    const [response, setResponse] = React.useState<string>("")
    const [bool,setBool] = React.useState<boolean>(false)

    function handleSelect(e: React.ChangeEvent<HTMLSelectElement>){
        setLanguage(e.target.value)
    }
    function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const token = localStorage.getItem("authtoken");
        const data = {
            language: language
        }
        setResponse("abc")
        axios.post(API_URL+'/auth/instructions', data,{headers: {gettoken: token}}).then((result)=>{
            if(result.data.message==='invalid token'){
                localStorage.removeItem('authtoken')
            }
            else{
                setResponse("")
                setBool(true)
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    return bool?<Redirect to='/exam/test'/>:localStorage.getItem("authtoken")?(
        <div>
            <div id="ins-part">
                <div id="ins-head">CINE'21</div>
                <div id="ins-head-2">Instructions</div>
                <div id="ins">
                    <div id="ins-ol">
                        <div className="ins-li">1. &nbsp;&nbsp;This exam contains 4 mandatory categories namely as
                        HTML, CSS, APTITUDE and SQL.</div>
                        <div className="ins-li">2. &nbsp;&nbsp;However, the candidate can select a choice of language (category) from the dropdown below.</div>
                        <div className="ins-li">3. &nbsp;&nbsp;This exam will be of 60 minutes in duration. When you submit the test/run out of time all of your marked responses whether saved or not will be submitted.</div>
                        <div className="ins-li">4. &nbsp;&nbsp;For every correct answer the candidate will be awarded 1 mark.</div>
                        <div className="ins-li">5. &nbsp;&nbsp;For every question, you can either SAVE or MARK FOR REVIEW for the response.</div>
                        <div className="ins-li">6. &nbsp;&nbsp;A question once attempted cannot be left unanswered as there is <b>NO NEGATIVE MARKING</b> in this test.</div>
                        <div className="ins-li">7. &nbsp;&nbsp;You can end the test anytime by clicking on the submit button. Make sure you submit only when you are done.</div>
                        <div className="ins-li">8. &nbsp;&nbsp;Once done submitting the test you'll be redirected to a feedback form. 
                        Your participation will only be considered once you submit your feedback form.</div>
                        <div className="ins-li">9. &nbsp;&nbsp;<b>If the candidate tries to do any malicious activity, he/she shall be automatically disqualified.</b></div>
                        <div className="ins-li">10. &nbsp;&nbsp;Before starting the test please make sure you have a stable internet connection.</div>
                        <div className="ins-li">11. &nbsp;&nbsp;<b>Kindly take note that this test allows only a single login for a user, so any kind of disconnection or reloading of the page might log you out of the test.</b></div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="choose-cat">
                    <div id="cat-label">Choose a language according to your preference</div>
                    <div id="sele-ca">
                        <select className="select-cat" onChange={handleSelect} value={language} required>
                            <option selected disabled value="">----</option>
                            <option value="C">C</option>
                            <option value="C++">C++</option>
                            <option value="JAVA">JAVA</option>
                            <option value="PYTHON">PYTHON</option>
                        </select>
                    </div>
                    <button className="get-candidate-searcj-button txt-ar" type="submit">{response==="abc"?"Loading...":'START THE EXAM'}</button>
                </form>
            </div>
        </div>
    ):<Redirect to='/logIn'/>
}

export default Instructions;
