import React from 'react';
import axios from 'axios';
import { API_URL } from '../url';
import {Redirect} from 'react-router-dom';
import '../css stylesheets/feedback.css';

const Feedback: React.FC = ()=>{
    const [data,setData]= React.useState<[]>([])
    const [suggestions,setSuggestions] = React.useState<string>('');
    const [bool,setBool] = React.useState<boolean>(false)
    const [Feedbacks,setFeedbacks] = React.useState<feedbacks[]>([]);
    const [response, setResponse] = React.useState<string>("")
    React.useEffect(()=>{
        const token = localStorage.getItem("authtoken");
        axios.get(API_URL+'/auth/feedback',{headers: {gettoken: token}})
        .then((response)=>{
            const res = response.data.message;
            if(res==='invalid token'){
                localStorage.removeItem('authtoken')
            }
            else {
                setData(res)
            }
        }).catch((err)=>{
            console.log(err)
            setFeedbacks([])
        })
    },[])


    function addFeedback(feedback: feedbacks){
        if(Feedbacks.length<=0){
            Feedbacks.push(feedback)
        }
        else{
            const findFeedback = Feedbacks.find((mappedFeedback)=>{
                return mappedFeedback.ques===feedback.ques
            })
            if(findFeedback){
                const index: number = Feedbacks.indexOf(feedback);
                Feedbacks[index]=feedback
            }
            else{
                Feedbacks.push(feedback)
            }
        }
    }

    function handleSuggestion(e: React.ChangeEvent<HTMLTextAreaElement>){
        setSuggestions(e.target.value)
    }

    function submitFeedbacks(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setResponse("abc")
        if(Feedbacks.length===data.length && suggestions!==''){
            const data = {
                response: Feedbacks,
                suggestion: suggestions
            }
            const token = localStorage.getItem("admintoken")||localStorage.getItem("authtoken");
            axios.post(API_URL+'/auth/feedback', data,{headers: {gettoken: token}}).then((result)=>{
                setBool(true)
                localStorage.removeItem('authtoken')
                localStorage.removeItem("moment")
                localStorage.removeItem("data")
            }).catch((err) => {
                console.log(err)
            })
        }
        else{
            alert('Empty Fields')
        }
    }

    const ques = data.map((mappedObject:any)=>{
        return <RatingQues ques={mappedObject} passFeedback={addFeedback} key={mappedObject._id}/>
    })

    return bool?<Redirect to='/exam/loggedOut'/>:localStorage.getItem("authtoken")?(
        <div>
            <div id="navbar-feed">
                <div className="cont">
                    {/* <div className="feed-logo">
                        <img id="logo-exam-feed" alt="logo" src={require('../assets/exam-logo.png')}/>
                    </div> */}
                    <div className="feeed-head">
                        <span className="sub-feed-head">Feedback</span>
                    </div>
                </div>
            </div>
            <div id="filler-feed"></div>
            <form onSubmit={submitFeedbacks} className="feedback-form">
                <div className="feed-serve-up">FEEDBACK</div>
                <div className="rating-area">{data.length>0?ques:null}</div>
                <div className="rating-ques-row txt-ar">
                    <div className="raing-ques sug">
                        Your suggestions matters, drop us one!
                    </div>
                    <textarea  rows={10} cols={60}
                        placeholder='Any Suggestions' 
                        onChange={handleSuggestion} 
                        value={suggestions} required/>
                </div>
                <button className="get-candidate-searcj-button txt-ar" type="submit">{response==='abc'?"Loading...":'FINISH'}</button>
            </form>
        </div>
    ):<Redirect to='/logIn'/>
}

interface RatingQuesProps{
    ques: any,
    passFeedback: (feedback: feedbacks) => void
}

interface feedbacks{
    ques: string,
    rating: number
}

const RatingQues = (props: RatingQuesProps) => {
    function passRating(e){
       const feedback: feedbacks = {
           ques: props.ques.feedbackQuestion,
           rating: e.target.value
       }
       props.passFeedback(feedback)
    }
    return(
        <div className="rating-ques-row">
            <div className="raing-ques">
                {props.ques.feedbackQuestion}
            </div>
            <div className="rates">
                <span className="a-rate">
                    <input type='radio' name={props.ques.feedbackQuestion} value={1} onClick={passRating} required className="rate-input"/>
                    <label className="rate-label">1</label>
                </span>
                <span className="a-rate">
                    <input className="rate-input" type='radio' name={props.ques.feedbackQuestion} value={2} onClick={passRating} required/>
                    <label className="rate-label">2</label>
                </span>
                <span className="a-rate">
                    <input className="rate-input" type='radio' name={props.ques.feedbackQuestion} value={3} onClick={passRating} required/>
                    <label className="rate-label">3</label>
                </span>
                <span className="a-rate">
                    <input className="rate-input" type='radio' name={props.ques.feedbackQuestion} value={4} onClick={passRating} required/>
                    <label className="rate-label">4</label>
                </span>
                <span className="a-rate">
                    <input className="rate-input" type='radio' name={props.ques.feedbackQuestion} value={5} onClick={passRating} required/>
                    <label className="rate-label">5</label>
                </span>
            </div>    
        </div>
    )
}

export default Feedback