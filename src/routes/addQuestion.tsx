import React from 'react';
import axios from 'axios';
import { API_URL } from '../url';
import {Redirect} from 'react-router-dom'

interface Answer{
    title: string,
    isCorrect: boolean
}

interface Question{
    question: string,
    category: string,
    options: Answer[]
}


const AddNewQuestion = () => {
    const[ques,setQues] = React.useState<string>('');
    const[category,setCategory] = React.useState<string>('');
    const[ansArr,setAnsArr] = React.useState<Answer[]>([]);
    const[ans,setAns] =React.useState<string>('');
    const[response,setResponse] = React.useState<string>("")
    const [bool,setBool] = React.useState<boolean>(false)
    
    function typeQues(e:React.ChangeEvent<HTMLTextAreaElement>){
        setQues(e.target.value);
    }
    function typeAns(e:React.ChangeEvent<HTMLInputElement>){
        setAns(e.target.value);
    }
    function handleSelect(e: React.ChangeEvent<HTMLSelectElement>){
        setCategory(e.target.value);
    }
    function addAnswer(e:React.KeyboardEvent<HTMLInputElement>){
        if(e.key==='Enter' && ans!==''){
            e.preventDefault();
            const newAns = {
                title: ans,
                isCorrect: false
            }
            const tempArray: Answer[] = [...ansArr];
            tempArray.unshift(newAns);
            setAnsArr(tempArray);
            setAns('');
        }
    }
    function toggleCorrect(data: Answer){
        const index = ansArr.findIndex((answer)=>{return answer.title===data.title});
        const newAns:Answer = {
            title: data.title,
            isCorrect: !data.isCorrect
        }
        const toggledArray: Answer[] = Object.assign([], ansArr);
        toggledArray[index] = newAns;
        setAnsArr(toggledArray);
    }
    function resetPage(){
        setQues('');
        const resetArray: Answer[] = [];
        setAnsArr(resetArray);
        setAns('');
    }
    function submitQuestion(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setResponse("abc")
        if(ques!=='' && ansArr.length>0 && category!==''){
            const data: Question = {
                question: ques,
                category: category,
                options: ansArr
            };
            const token = localStorage.getItem("admintoken");
            axios.post(API_URL+'/auth/addNewQuestion', data,{headers: {gettoken: token}}).then((data)=>{
                if(data.data.message==='invalid token'){
                    localStorage.removeItem('admintoken')
                }
                else {
                    setResponse(data.data.message)
                    setBool(true)
                    resetPage();
                }
            }).catch((err) => {
                console.log(err)
            })
        }
        else{
            setResponse("All fields are required")
            setBool(true)
        }
    }
    function deleteAnswer(data: Answer){
        const freshArray: Answer[]= ansArr.filter((ans)=> {return ans.title!==data.title});
        setAnsArr(freshArray);
    }
    if(bool){
        setTimeout(()=>{
            setBool(false)
        },3500)
    }
    return localStorage.getItem('admintoken')?(
        <div className="add-question">
            <div className="add-question-heading">Add a Question</div>
            <form onSubmit={submitQuestion} className="add-question-form">
                <div className="ques-row">
                    <label htmlFor="ques" className="add-question-label">Question</label>
                    <textarea  rows={10} cols={60}
                        className="add-question-input" placeholder="Write your question here"
                        onChange={typeQues} 
                        value={ques} required/>
                    {/* <input type="text" name="ques" onChange={typeQues} value={ques} autoComplete='off' className="add-question-input" placeholder="Write your question here"/> */}
                </div>
                <div className="ques-row">
                    <select onChange={handleSelect} value={category}>
                        <option value="" disabled>Choose a Category</option>
                        <option value="HTML">HTML</option>
                        <option value="CSS">CSS</option>
                        <option value="JAVA">JAVA</option>
                        <option value="PYTHON">PYTHON</option>
                        <option value="C++">C++</option>
                        <option value="SQL">SQL</option>
                        <option value="C">C</option>
                        <option value="APTI">APTITUDE</option>
                    </select>
                </div>
                <div className="ques-row">
                    <label htmlFor="ans" className="add-question-label">Answer</label>
                    <input type="text" name="ans" onChange={typeAns} onKeyPress={addAnswer} value={ans} autoComplete='off' placeholder="Press enter to add an option" className="add-question-input"/>
                </div>
                <ul className="ques-row-list">
                    <AnswerList data={ansArr} change={toggleCorrect} del={deleteAnswer}/>
                </ul>
                <button className="ques-row add-question-button" type="submit">{response==='abc'?"Loading...":'Upload Question'}</button>
            </form>    
            {bool?response:null} 
        </div>
    ):<Redirect to='/logIn'/>
}

interface AnswerListProps{
    data: Answer[],
    change: (data: Answer)=> void;
    del: (data: Answer)=> void;
}

const AnswerList  = (props: AnswerListProps)=>{
    const pushedAnwser = props.data.map((answer)=><div key={answer.title} className="add-question-option-list">
        <div className="option-title-add"><input type="checkbox"  checked={answer.isCorrect} onChange={()=>props.change(answer)} className="add-question-option-list-input"/>{answer.title}</div>
        <div className="option-title-feature">
            <button className="trash-button" type="button" onClick={()=>props.del(answer)}><i className="fa fa-trash" aria-hidden="true"></i></button>
        </div>
    </div>)
    return(
        <div>
            {pushedAnwser}
        </div>
    )
}

export default AddNewQuestion;