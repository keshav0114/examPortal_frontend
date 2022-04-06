import React from 'react';
import axios from 'axios';
import AddQuestion from './addQuestion';
import AddFeedbackQuestion from './addFeedbackQuestions';
import AddCandidate from './addCandidate';
import GetQuestions from './getQuestions';
import GetFeedbackQuestions from './getFeedbackQuestions';
import GetCandidates from './getCandidates';
import LeaderBoard from './leaderboard';
import { API_URL } from '../url';
import {Redirect} from 'react-router-dom';
import '../css stylesheets/dashboard.css';

interface data{
    registered: number,
    attended: number,
    questions: number,
    feedbackQuestions: number
}


const Dashboard: React.FC = () => {
    const [bool,setBool] = React.useState<boolean>(false)
    const [service, setService] = React.useState<string>('')
    function handleCall(e: string){
        setService(e)
    }
    function logOut(){
        localStorage.removeItem('admintoken')
        setBool(true)
    }
    return bool?<Redirect to='/logIn'/>:localStorage.getItem('admintoken')?(
        <div id="main-dashboard">
            <div id="top-nav">
                <div id="navbar-dashboard"><NavBar call={handleCall}/></div>
                <div className="shut-down" onClick={logOut}><i className="fa fa-power-off" aria-hidden="true"></i></div>
            </div>
            <div id="service-container">
                    {service==='addQuestion'?<AddQuestion/>: null}
                    {service==='addFeedback'?<AddFeedbackQuestion/>: null}
                    {service==='addCandidate'?<AddCandidate/>: null}
                    {service==='getQuestions'?<GetQuestions/>: null}
                    {service==='getFeedBackQuestions'?<GetFeedbackQuestions/>: null}
                    {service==='getCandidates'?<GetCandidates/>: null}
                    {service==='leaderboard'?<LeaderBoard/>: null}
                    {service===''?<Summary/>: null}
                </div>
        </div>
    ):<Redirect to='/logIn'/>
}

interface NavbarProps{
    call: (name: string) => void
}

const NavBar = (props: NavbarProps) => {
    const [add,setAdd] = React.useState<boolean>(false)
    const [get,setGet] = React.useState<boolean>(false)
    return(
        <React.Fragment>
            <div id="cine-head" onClick={()=>props.call('')}>
                {/* <span><img id="logo-exam-dashboard" alt="logo" src={require('../assets/exam-logo.png')}/></span> */}
                <span id="cine">ADMIN</span>
            </div>
            <div id="navbar-right-contents">
                <div id="leaderboard" className="nav-links" onClick={()=>{
                    props.call('leaderboard')
                    setAdd(false)
                    setGet(false)
                    }}>
                    <span className="content-link">LEADERBOARD</span>
                </div>
                <div id="add-dropdown-head" className="nav-links" onClick={()=>{
                        setAdd(!add)
                        setGet(false)
                        }}>
                    <span className="content-link">ADD</span>
                    <div id="add-dropdown-contents">
                    <ul id="add-table">
                    <li onClick={()=>{
                        props.call('addQuestion');
                        setAdd(!add)
                    }}>Add A Question</li>
                    <li onClick={()=>{
                        props.call('addFeedback');
                        setAdd(!add)
                    }}>Add A Feedback Question</li>
                    <li onClick={()=>{
                        props.call('addCandidate')
                        setAdd(!add)
                        }}>Add A Candidate</li>
                    </ul>
                </div>
                </div>
                <div id="get-dropdown-head" className="nav-links" onClick={()=>{
                        setGet(!get)
                        setAdd(false)
                    }}>
                    <span className="content-link">GET</span>
                    <div id="get-dropdown-contents">
                    <ul id="get-table">
                    <li onClick={()=>{
                        props.call('getQuestions')
                        setGet(!get)
                        }}>Get Questions</li>
                    <li onClick={()=>{
                        props.call('getFeedBackQuestions')
                        setGet(!get)
                        }}>Get Feedback Questions</li>
                    <li onClick={()=>{
                        props.call('getCandidates')
                        setGet(!get)
                        }}>Get Candidates</li>
                    </ul>
                </div>
                </div>
            </div>
        </React.Fragment>
    )
}


const Summary = () => {
    const [data,setData] = React.useState<data>();

    function fetchAPI(){
        const token = localStorage.getItem("admintoken");
        axios.get(API_URL+'/auth/dashboard',{headers: {gettoken: token}})
        .then((response)=>{
            const res = response.data.message;
            if(res==='invalid token'){
                localStorage.removeItem('admintoken')
            }
            else{
                setData(res)
            }
        }).catch((err)=>{
            console.log(err)
        })
    }

    React.useEffect(fetchAPI,[])
    return localStorage.getItem('admintoken')?(
        <div id="summary-box">
            <div className="list-div-summary"><span className="summary-headings">Total Registrations</span><span className="summary-data">{data?data.registered:'NA'}</span></div>
            <div className="list-div-summary"><span className="summary-headings">Total Attendees</span><span className="summary-data">{data?data.attended:'NA'}</span></div>
            <div className="list-div-summary"><span className="summary-headings">Total Questions Uploaded</span><span className="summary-data">{data?data.questions:'NA'}</span></div>
            <div className="list-div-summary"><span className="summary-headings">Total feedback Questions Uploaded</span><span className="summary-data">{data?data.feedbackQuestions:'NA'}</span></div>
        </div>
    ):<Redirect to='/logIn'/>
}

export default Dashboard;