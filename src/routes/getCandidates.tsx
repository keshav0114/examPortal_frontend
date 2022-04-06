import React from 'react';
import axios from 'axios';
import { API_URL } from '../url';
import {Redirect} from 'react-router-dom'

interface Candidate{
    name: string,
    stdNumber: string,
    rollNumber: string,
    email: string,
    mobileNumber: string,
    year: string,
    branch: string,
    isHostler: boolean,
    _id: string,
    hasAppeared: boolean,
    date: Date,
    password: string,
    examStartTime: string
}

const GetCandidates: React.FC = () => {
    const [data,setData] = React.useState<Candidate[]>([])
    const [query,setQuery] = React.useState<string>('')
    const [filter,setFilter] = React.useState<string>('rollNumber')
    const [bool,setBool] = React.useState<boolean>(false)
    const [response, setResponse] = React.useState<string>("")
    function fetchAPI(){
        const token = localStorage.getItem("admintoken");
        axios.get(API_URL+'/auth/getCandidate',{headers: {gettoken: token}})
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
    React.useEffect(fetchAPI,[]);

    function handleQuery(e: React.ChangeEvent<HTMLInputElement>){
        setQuery(e.target.value)
    }

    function handleFilter(e: React.ChangeEvent<HTMLSelectElement>){
        setFilter(e.target.value)
    }

    function handleDelete(candidate: Candidate){
        const token = localStorage.getItem("admintoken");
        setResponse("abc")
        axios.post(API_URL+'/auth/removeCandidate', {
            _id: candidate._id,
            email: candidate.email
        },{headers: {gettoken: token}})
        .then((response)=>{
            if(response.data.message==='invalid token'){
                localStorage.removeItem('admintoken')
            }
            else {
                setResponse("")
                fetchAPI()
            }
        }).catch((err)=>{
            console.log(err)
        })
    }

    const filteredArray = data.filter((candidate)=>{
        if(filter==='name'){
            return candidate.name.toLowerCase().includes(query.toLowerCase())
        }
        else if(filter==='email'){
            return candidate.email.toLowerCase().includes(query.toLowerCase())
        }
        else if(filter==='mobileNumber'){
            return candidate.mobileNumber.toString().includes(query)
        }
        else if(filter==='studentNumber'){
            return candidate.stdNumber.toString().includes(query)
        }
        else{
            return candidate.rollNumber.toString().includes(query)
        }
        
    })

    function handleToggle(){
        setBool(!bool)
    }

    const filteredBlock = filteredArray.map((candidate)=>{
        return <div className="candidate-block" key={candidate.rollNumber}><Card creds={candidate} delete={handleDelete} response={response}/></div>
    })

    const block = data.map((candidate)=>{
        return <div className="candidate-block" key={candidate.rollNumber}><Card creds={candidate} delete={handleDelete} response={response}/></div>
    })

    return localStorage.getItem('admintoken')?(
        <div className="get-candidate-service">
            <div className="top-heads">CANDIDATES</div>
            <div className="feature-get-block">
                {bool?<div><div>
                    <select className="select-filter-get-student" name="branch" onChange={handleFilter} value={filter}>
                        <option value="rollNumber" selected>Roll Number</option>
                        <option value="studentNumber">Student Number</option>
                        <option value="mobileNumber">Mobile Number</option>
                        <option value="email">Email</option>
                        <option value="name">Name</option>
                    </select>
                </div>
                <div>
                    <input className="search-get-candidate" type='text' placeholder='Search A Candidate' onChange={handleQuery} value={query}/>
                </div></div>:<button type='button' className="get-candidate-searcj-button" onClick={handleToggle}>Search a Candidate</button>}
            </div>
            <div>
                {filteredArray.length===0&&data.length===0?<div className="miss-data-get-candidate">No Candidate has registered yet</div>:filteredArray.length>0?<div className="list-of-candidates">{filteredBlock}</div>:<div className="list-of-candidates">{block}</div>}
            </div>
        </div>
    ):<Redirect to='/logIn'/>
}

interface CardProps{
    creds: Candidate,
    delete: (data: Candidate) => void,
    response: string
}

const Card = (props: CardProps) => {
    const data = props.creds;
    const date =  new Date(data.date)
    return(
        <React.Fragment>
            <div className="candidate-get-details">
                <div className="candidate-cred-row"><span className="candidate-cred-head">Name</span><span className="candidate-data">{data.name}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Student Number</span><span className="candidate-data">{data.stdNumber}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Roll Number</span><span className="candidate-data">{data.rollNumber}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">E-mail</span><span className="candidate-data">{data.email}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Mobile Number</span><span className="candidate-data">{data.mobileNumber}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Branch</span><span className="candidate-data">{data.branch}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Residency</span><span className="candidate-data">{data.isHostler?'Hostler':'Day Scholar'}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Attended the Exam</span><span className="candidate-data">{data.hasAppeared?'YES':'NO'}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Time of Registration</span><span className="candidate-data">{date.toUTCString()}</span></div>
                <div className="candidate-cred-row"><span className="candidate-cred-head">Exam Start Time</span><span className="candidate-data">{new Date(data.examStartTime).toUTCString()}</span></div>
                <div className="remove-candidate-get" onClick={()=>props.delete(data)}>
                    {props.response==='abc'?'Loading...':<div><span id="delete-get-candidate">Delete Candidate</span><i className="fa fa-trash" aria-hidden="true"></i></div>}
                </div>
            </div>
            
        </React.Fragment>
    )
}

export default GetCandidates;