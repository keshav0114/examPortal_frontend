import React from 'react';
import axios from 'axios';
import { API_URL } from '../url';
import {Redirect} from 'react-router-dom'

interface FeedbackQuestion{
    _id: string,
    feedbackQuestion: string
}

const GetFeedbackQuestions: React.FC = ()=>{
    const [data,setData]= React.useState<FeedbackQuestion[]>([])
    const [bool,setBool] = React.useState<boolean>(false)
    const [edit, setEdit] = React.useState<any>();
    const [response, setResponse] = React.useState<string>("")

    function fetchAPI(){
        const token = localStorage.getItem("admintoken");
        axios.get(API_URL+'/auth/feedback',{headers: {gettoken: token}})
        .then((response)=>{
            const res = response.data.message;
            if(res==='invalid token'){
                localStorage.removeItem('admintoken')
            }
            else {
                setData(res)
            }
        }).catch((err)=>{
            console.log(err)
        })
    }

    React.useEffect(fetchAPI,[])

    function handleDelete(e: string){
        const token = localStorage.getItem("admintoken");
        setResponse("abc")
        axios.post(API_URL+'/auth/deleteFeedbackQuestion', {_id: e},{headers: {gettoken: token}})
        .then((result)=>{
            if(result.data.message==='invalid token'){
                localStorage.removeItem('admintoken')
            }
            else{
                setResponse("")
                fetchAPI();
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    function toggle(){
        setBool(!bool)
        fetchAPI();
    }
    function toggleCancel(){
        setBool(!bool)
    }

    function handleEdit(obj){
        setEdit(obj)
        setBool(!bool)
    }

    const ques = data.map((mappedObject:FeedbackQuestion)=>{
    return <div key={mappedObject._id}><Card obj={mappedObject} edit={handleEdit} delete={handleDelete} response={response}/></div>
    })

    return localStorage.getItem('admintoken')?(
        <div id="get-feedback-container">{bool?<EditQuestion 
            editThis={edit} 
            toggle={toggle}
            toggleCancel={toggleCancel}/>:data.length>0?<div>
            <div className="top-heads">FEEDBACK QUESTIONS</div><div id="feedback-question">{ques}</div></div>:<div className="miss-data-get-candidate">No Feedback Questions are currently present</div>}
        </div>
    ):<Redirect to='/logIn'/>
}

interface CardProps{
    obj: FeedbackQuestion,
    edit: (data: FeedbackQuestion)=> void,
    delete: (id: string)=>void,
    response: string
}

const Card = (props: CardProps) => {
    return(
        <div className="get-feedback-card">
            <div className="get-feedback-ques-title">{props.obj.feedbackQuestion}</div>
            <div className="get-feedback-features">
                <span className="get-feedback-edit" onClick={()=>props.edit(props.obj)}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></span>
                <span className="get-feedback-delete" onClick={()=>props.delete(props.obj._id)}><i className={props.response==="abc"?"fa fa-spinner":"fa fa-trash"} aria-hidden="true"></i></span>
            </div>
        </div>
    )
}

interface EditQuestionProps{
    editThis: FeedbackQuestion,
    toggle:()=> void,
    toggleCancel: ()=> void
}

const EditQuestion = (props: EditQuestionProps) => {
    const [ques,setQues] = React.useState<string>(props.editThis.feedbackQuestion);
    const [response, setResponse] = React.useState<string>("")
    function typeQues(e: React.ChangeEvent<HTMLInputElement>){
        setQues(e.target.value)
    }    
    function submitFeedback(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setResponse("abc")
        if(ques!=='' && props.editThis.feedbackQuestion!==ques){
            const token = localStorage.getItem("admintoken");
            axios.post(API_URL+'/auth/updateFeedbackQuestion', 
            {
                _id: props.editThis._id,
                question: ques
            },{headers: {gettoken: token}}).then((data)=>{
                if(data.data.message==='invalid token'){
                    localStorage.removeItem('admintoken')
                }
                else {
                    setResponse("")
                    props.toggle()
                }
            }).catch((err)=>{
                console.log(err)
            })
        }
        else{
            props.toggleCancel()
        }
    }
    return localStorage.getItem('admintoken')?(
        <div>
            <form onSubmit={submitFeedback}>
                <label className="feedback-label" htmlFor="ques">Edit feedback Question</label>
                <input className="feedback-input" type="text" name="ques" onChange={typeQues} value={ques} autoComplete='off'/>
                <br/>
                <button className="feedback-button" type="submit">{response==="abc"?'Loading...':'Update Question'}</button>
            </form>  
            <button type="button" onClick={props.toggleCancel} className="feedback-edit-cancel">Cancel</button>
        </div>
    ):<Redirect to='/logIn'/>
}



export default GetFeedbackQuestions