import React from 'react';
import axios from 'axios';
import { API_URL } from '../url';
import {Redirect} from 'react-router-dom';

const LeaderBoard : React.FC = () => {
    const [users,setUsers] = React.useState<[]>();
    const [isEmpty,setIsEmpty] = React.useState<boolean>(false)
    const [service,setService] = React.useState<string>('')
    const [data,setData] = React.useState<any>()
    const [response, setResponse] = React.useState<string>("")

    React.useEffect(fetchAPI,[])

    function fetchAPI(){
        const token = localStorage.getItem("admintoken");
        setResponse("abc")
        axios.get(API_URL+'/auth/leaderboard',{headers: {gettoken: token}})
        .then((response)=>{
            const res = response.data.message;
            if(res==='invalid token'){
                localStorage.removeItem('admintoken')
            }
            else{
                setResponse("")
                setUsers(res)
                setIsEmpty(true)
            }
        }).catch((err)=>{
            console.log(err)
        })
    }

    function getRollNumberAndFetchDetails(newRollNumber){
        const token = localStorage.getItem("admintoken");
        setResponse("abc")
        axios.get(API_URL+'/auth/fetchDetails?rollNumber='+newRollNumber,{headers: {gettoken: token}})
        .then((response)=>{
            const res = response.data.message;
            if(res==='invalid token'){
                localStorage.removeItem('admintoken')
            }
            else{
                setResponse("")
                setData(res)
                setService('details')
            }
        }).catch((err)=>{
            console.log(err)
        })
    }

    function getRollNumberAndFetchFeedbacks(newRollNumber){
        const token = localStorage.getItem("admintoken");
        setResponse("abc")
        axios.get(API_URL+'/auth/fetchFeedbacks?rollNumber='+newRollNumber,{headers: {gettoken: token}})
        .then((response)=>{
            const res = response.data.message;
            if(res==='invalid token'){
                localStorage.removeItem('admintoken')
            }
            else{
                setResponse("")
                setService('feedback')
                setData(res)
            }
        }).catch((err)=>{
            console.log(err)
        })
    }

    function getRollNumberAndFetchAnswers(newRollNumber){
        const token = localStorage.getItem("admintoken");
        setResponse("abc")
        axios.get(API_URL+'/auth/fetchAnswers?rollNumber='+newRollNumber,{headers: {gettoken: token}})
        .then((response)=>{
            const res = response.data.message;
            if(res==='invalid token'){
                localStorage.removeItem('admintoken')
            }
            else{
                setResponse("")
                setData(res)
                setService('answers')
            }
        }).catch((err)=>{
            console.log(err)
        })
    }

    function returnToLeaderboard(){
        setService('')
    }
    
    return localStorage.getItem('admintoken')?(
        <div className="get-leaderboard-service">
        <div className="top-heads">LEADERBOARD</div>
        {isEmpty&&service==='details'&&data?
            <UserDetails fetchedData={data} 
            getRollNumberAndFetchFeedbacks={getRollNumberAndFetchFeedbacks}
            getRollNumberAndFetchAnswers={getRollNumberAndFetchAnswers}
            returnToLeaderboard={returnToLeaderboard}
            response={response}/>:
        isEmpty&&service==='feedback'&&data?
            <UserFeedback fetchedData={data}
            getRollNumberAndFetchDetails={getRollNumberAndFetchDetails}
            getRollNumberAndFetchAnswers={getRollNumberAndFetchAnswers}
            returnToLeaderboard={returnToLeaderboard}
            response={response}/>:
        isEmpty&&service==='answers'&&data?
            <UserAnswers fetchedData={data}
            getRollNumberAndFetchDetails={getRollNumberAndFetchDetails}
            getRollNumberAndFetchFeedbacks={getRollNumberAndFetchFeedbacks}
            returnToLeaderboard={returnToLeaderboard}
            response={response}/>: 
        isEmpty&&service===''?
            <DisplayList users={users} 
            getRollNumberAndFetchDetails={getRollNumberAndFetchDetails}
            getRollNumberAndFetchFeedbacks={getRollNumberAndFetchFeedbacks}
            getRollNumberAndFetchAnswers={getRollNumberAndFetchAnswers}
            response={response}/>:
        'No Student has attended'}
        </div>
    ):<Redirect to='/logIn'/>
}

const DisplayList = (props) => {
    const [query,setQuery] = React.useState<string>('')
    const [filter,setFilter] = React.useState<string>('rollNumber');
    const [bool,setBool] = React.useState<boolean>(false)

    function handleQuery(e: React.ChangeEvent<HTMLInputElement>){
        setQuery(e.target.value)
    }

    function handleFilter(e: React.ChangeEvent<HTMLSelectElement>){
        setFilter(e.target.value)
    }

    function handleToggle(){
        setBool(!bool)
    }

    const sortedUsers = props.users.sort(function sort(a,b){
        if(a.score>b.score){return -1}
        else if(a.score<b.score){return 1}
        else{return 0}
    })   

    const filteredArray = sortedUsers.filter((ranker)=>{
        if(filter==='name'){
            return ranker.name.toLowerCase().includes(query.toLowerCase())
        }
        else if(filter==='email'){
            return ranker.email.toLowerCase().includes(query.toLowerCase())
        }
        else if(filter==='mobileNumber'){
            return ranker.mobileNumber.toString().includes(query)
        }
        else if(filter==='studentNumber'){
            return ranker.stdNumber.toString().includes(query)
        }
        else{
            return ranker.rollNumber.toString().includes(query)
        }
    })

    
    const filtered = filteredArray.map((ranker)=>{
        return  <div className="candidate-block" key={ranker.rollNumber}>
            <RankerBlock info={ranker} 
            getRollNumberAndFetchDetails={props.getRollNumberAndFetchDetails}
            getRollNumberAndFetchFeedbacks={props.getRollNumberAndFetchFeedbacks}
            getRollNumberAndFetchAnswers={props.getRollNumberAndFetchAnswers}
            response={props.response}/>
        </div>
    })

    const block = sortedUsers.map((sortedData)=>{
        return <div className="candidate-block" key={sortedData.rollNumber}>
            <RankerBlock info={sortedData}
             getRollNumberAndFetchDetails={props.getRollNumberAndFetchDetails}
             getRollNumberAndFetchFeedbacks={props.getRollNumberAndFetchFeedbacks}
             getRollNumberAndFetchAnswers={props.getRollNumberAndFetchAnswers}
             response={props.response}/>
        </div>
    })
    
    return(
        <div>
            <div className="feature-get-block">
                {bool?<div><div>
                    <select className="select-filter-get-student" name="branch" onChange={handleFilter} value={filter}>
                        <option value="rollNumber" selected>Roll Number</option>
                        <option value="studentNumber">Student Number</option>
                        <option value="mobileNumber">MobileNumber</option>
                        <option value="email">Email</option>
                        <option value="name">Name</option>
                    </select>
                </div>
                <div>
                    <input className="search-get-candidate" type='text' placeholder='Search A Candidate' onChange={handleQuery} value={query}/>
                </div></div>:<button className="get-candidate-searcj-button" type='button' onClick={handleToggle}>Search</button>}
            </div>
            {filteredArray.length===0&&sortedUsers.length===0?<div className="miss-data-get-candidate">Exam yet to be finished</div>:filteredArray.length>0?<div className="list-of-candidates">{filtered}</div>:<div className="list-of-candidates">{block}</div>}
        </div>
    )
}

const RankerBlock = (props) => {
    const data = props.info
    function getRollNumberAndFetchDetails(){
        props.getRollNumberAndFetchDetails(data.rollNumber)
    }

    function getRollNumberAndFetchFeedbacks(){
        props.getRollNumberAndFetchFeedbacks(data.rollNumber)
    }

    function getRollNumberAndFetchAnswers(){
        props.getRollNumberAndFetchAnswers(data.rollNumber)
    }
    
    return(
        <div className="candidate-get-details">   
            {data?<div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Name</span><span className="candidate-data">{data.name}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Roll Number</span><span className="candidate-data">{data.rollNumber}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Branch</span><span className="candidate-data">{data.branch}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Score</span><span className="candidate-data">{data.score}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Language</span><span className="candidate-data">{data.preferredLanguage}</span></div>
            </div>:null}
            <div className="candidate-cred-row ld-ex">
                <button className="fetch" type='button' onClick={getRollNumberAndFetchDetails}><i className={props.response==="abc"?"fa fa-spinner":"fa fa-user-circle"} aria-hidden="true"></i>{props.response==='abc'?" Loading":' Fetch Details'}</button>
                <button className="fetch" type='button' onClick={getRollNumberAndFetchFeedbacks}><i className={props.response==="abc"?"fa fa-spinner":"fa fa-commenting-o"} aria-hidden="true"></i>{props.response==='abc'?" Loading":' Fetch Feedback'}</button>
                <button className="fetch" type='button' onClick={getRollNumberAndFetchAnswers}><i className={props.response==="abc"?"fa fa-spinner":"fa fa-book"} aria-hidden="true"></i>{props.response==='abc'?" Loading":' Fetch Answers'}</button>
            </div>
        </div>
    )
}

const UserDetails = (props) => {
    const data = props.fetchedData
    function getRollNumberAndFetchFeedbacks(){
        props.getRollNumberAndFetchFeedbacks(data.rollNumber)
    }

    function getRollNumberAndFetchAnswers(){
        props.getRollNumberAndFetchAnswers(data.rollNumber)
    }

    function returnToLeaderboard(){
        props.returnToLeaderboard()
    }
    
    return(
        <div className="candidate-block fetch-details">
            {data?<div className="candidate-get-details">
                <div className="candidate-cred-row"><span className="candidate-cred-head">Name</span><span className="candidate-data">{data.name}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Student Number</span><span className="candidate-data">{data.stdNumber}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Roll Number</span><span className="candidate-data">{data.rollNumber}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">E-mail</span><span className="candidate-data">{data.email}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Mobile Number</span><span className="candidate-data">{data.mobileNumber}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Branch</span><span className="candidate-data">{data.branch}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Residency</span><span className="candidate-data">{data.isHostler?'Hostler':'Day Scholar'}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Score</span><span className="candidate-data">{data.score}</span></div>
            </div>:null}
            <div className="candidate-cred-row ld-ex">
                <button className="fetch" type='button' onClick={getRollNumberAndFetchFeedbacks}><i className={props.response==="abc"?"fa fa-spinner":"fa fa-commenting-o"} aria-hidden="true"></i>{props.response==='abc'?" Loading":' Fetch Feedback'}</button>
                <button className="fetch" type='button' onClick={getRollNumberAndFetchAnswers}><i className={props.response==="abc"?"fa fa-spinner":"fa fa-book"} aria-hidden="true"></i>{props.response==='abc'?" Loading":' Fetch Answers'}</button>
                <button className="fetch" type='button' onClick={returnToLeaderboard}>{props.response==='abc'?"Loading...":'Back to LeaderBoard'}</button>
            </div>
        </div>
    )
}

const UserFeedback = (props) => {
    const data = props.fetchedData
    function getRollNumberAndFetchAnswers(){
        props.getRollNumberAndFetchAnswers(data.userData.rollNumber)
    }
    function getRollNumberAndFetchDetails(){
        props.getRollNumberAndFetchDetails(data.userData.rollNumber)
    }
    function returnToLeaderboard(){
        props.returnToLeaderboard()
    }
    const list = data.userFeedback&&data.userFeedback.response?data.userFeedback.response.map((feedbackQuestion)=>{
        return <div key={feedbackQuestion._id} className="add-question-option-list">
                <div className="candidate-cred-row"><span className="candidate-cred-head">{feedbackQuestion.ques}</span><span className="candidate-data">{feedbackQuestion.rating}</span></div>
            </div>
    }): 'The student has not submitted any feedback'
    return(
        <div className="candidate-block fetch-details">
            {data.userData?<div className="candidate-get-details">
                <div className="candidate-cred-row"><span className="candidate-cred-head">Name</span><span className="candidate-data">{data.userData.name}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Roll Number</span><span className="candidate-data">{data.userData.rollNumber}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Branch</span><span className="candidate-data">{data.userData.branch}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Score</span><span className="candidate-data">{data.userData.score}</span></div>
            </div>:null}
            <div className="candidate-cred-row feed-resp">Feedback Responses</div>
            {data.userFeedback?<div>
                <div>{list}</div>
                <div className="question-cred-row"><span className="question-cred-head-cat feed-resp">Suggestion:</span><span className="question-data feed-resp-data">{data.userFeedback.suggestion}</span></div>
            </div>:<div className="no-feeback candidate-cred-row">No feedback has been submitted</div>}
            <div className="candidate-cred-row ld-ex">
                <button className="fetch" type='button' onClick={getRollNumberAndFetchDetails}><i className={props.response==="abc"?"fa fa-spinner":"fa fa-user-circle"} aria-hidden="true"></i>{props.response==='abc'?" Loading":' Fetch Details'}</button>
                <button className="fetch" type='button' onClick={getRollNumberAndFetchAnswers}><i className={props.response==="abc"?"fa fa-spinner":"fa fa-book"} aria-hidden="true"></i>{props.response==='abc'?" Loading":' Fetch Answers'}</button>
                <button className="fetch" type='button' onClick={returnToLeaderboard}>{props.response==='abc'?"Loading...":'Back to LeaderBoard'}</button>
            </div>
        </div>
    )
}

const UserAnswers = (props) => {
    const answers = props.fetchedData
    const data = props.fetchedData.userData

    function getRollNumberAndFetchFeedbacks(){
        props.getRollNumberAndFetchFeedbacks(data.rollNumber)
    }
    
    function getRollNumberAndFetchDetails(){
        props.getRollNumberAndFetchDetails(data.rollNumber)
    }
    function returnToLeaderboard(){
        props.returnToLeaderboard()
    }
    const list = answers.userAnswer&&answers.userAnswer.response?answers.userAnswer.response.map((answer)=>{
        return <div key={answer.attemptedQuestion} className="resp-question-option-list">
            <div className="question-cred-row"><span className="feed-resp-label">Question:</span><span className="question-data feed-resp-data">{answer.attemptedQuestion}</span></div>
            <div className="question-cred-row"><span className="feed-resp-label">Answer:</span><span className="question-data feed-resp-data">{answer.markedAnswer}</span></div>
            <div className="question-cred-row"><span className="feed-resp-label">Correct:</span><span className={answer.isVariable?"question-data feed-resp-data correct-answer":"question-data feed-resp-data wrong-answer"}>{answer.isVariable?'Yes':'No'}</span></div>
            <div className="question-cred-row"><span className="feed-resp-label">Status:</span><span className="question-data feed-resp-data">{answer.isConstant?'Saved':'Marked For Review'}</span></div>
        </div>
    }):'No Answers were marked'

    return(
        <div className="candidate-block fetch-details">
            {data?<div className="candidate-get-details">
                <div className="candidate-cred-row"><span className="candidate-cred-head">Name</span><span className="candidate-data">{data.name}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Roll Number</span><span className="candidate-data">{data.rollNumber}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Branch</span><span className="candidate-data">{data.branch}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Score</span><span className="candidate-data">{data.score}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Exam Start Time</span><span className="candidate-data">{new Date(data.examStartTime).toUTCString()}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Exam End Time</span><span className="candidate-data">{new Date(answers.userAnswer.date).toUTCString()}</span></div>
            </div>:null}
            <div className="candidate-cred-row feed-resp">Responses</div>
            <div>
                {props.fetchedData.userAnswer!==null?<div>{list}</div>:<div className="no-feeback candidate-cred-row">No answers were marked</div>}
            </div>
            <div className="candidate-cred-row ld-ex">
                <button className="fetch" type='button' onClick={getRollNumberAndFetchDetails}><i className={props.response==="abc"?"fa fa-spinner":"fa fa-user-circle"} aria-hidden="true"></i>{props.response==='abc'?" Loading":' Fetch Details'}</button>
                <button className="fetch" type='button' onClick={getRollNumberAndFetchFeedbacks}><i className={props.response==="abc"?"fa fa-spinner":"fa fa-commenting-o"} aria-hidden="true"></i>{props.response==='abc'?" Loading":' Fetch Feedback'}</button>
                <button className="fetch" type='button' onClick={returnToLeaderboard}>{props.response==='abc'?"Loading...":'Back to LeaderBoard'}</button>
            </div>
        </div>
    )
}

export default LeaderBoard