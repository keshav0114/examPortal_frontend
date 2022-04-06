import React from 'react';
import axios from 'axios';
import { API_URL } from '../url';
import {Redirect} from 'react-router-dom';
import '../css stylesheets/dashboard.css';

interface Ques{
    _id: string,
    options: Array<Opt>,
    category: string,
    question: string
}

interface Opt{
    title: string,
    isCorrect: boolean
}

const GetQuestions: React.FC = () => {
    const [data,setData] = React.useState<Ques[]>([]);
    const [ques,setQues] = React.useState<Ques>();
    const [bool,setBool] = React.useState<boolean>(false)
    const [response, setResponse] = React.useState<string>("")
    function getAll(){
        const token = localStorage.getItem("admintoken");
        axios.get(API_URL+'/auth/getQuestions',{headers: {gettoken: token}})
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
    React.useEffect(getAll,[])
    
    function handleEdit(quest: Ques){
        setQues(quest)
        setBool(!bool)
    }
    
    function handleDelete(ques: Ques){
        const id = {
            _id: ques._id
        }
        const token = localStorage.getItem("admintoken");
        setResponse("abc")
        axios.post(API_URL+'/auth/deleteQuestion', id,{headers: {gettoken: token}})
        .then((result)=>{
            if(result.data.message==='invalid token'){
                localStorage.removeItem('admintoken')
            }
            else {
                setResponse("")
                getAll();
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    function toggle(){
        setBool(!bool)
        getAll();
    }
    function toggleCancel(){
        setBool(!bool)
    }

    

    return localStorage.getItem('admintoken')?(
        <React.Fragment>
            {bool?<EditQuestion 
            editThis={ques} 
            toggle={toggle}
            toggleCancel={toggleCancel}/>:<DisplayList data={data} edit={handleEdit} delete={handleDelete} response={response}/>}
        </React.Fragment>
    ):<Redirect to='/logIn'/>
}

const DisplayList = (props) => {
    const [text,setText] = React.useState<string>('')
    function handleInput(e: React.ChangeEvent<HTMLInputElement>){
        setText(e.target.value)
    }
    const filteredArray = props.data.filter((mappedObject)=>{
        return mappedObject.question.toLowerCase().includes(text.toLowerCase())
    })
    const filteredBlock = filteredArray.map((mappedObject)=>{
        return  <div key={mappedObject.question}>
            <QuestionBlock ques={mappedObject} edit={props.edit} delete={props.delete} response={props.response}/>
        </div>
    })
    const block = props.data.map((mappedObject)=>{
        return  <div key={mappedObject.question}>
            <QuestionBlock ques={mappedObject} edit={props.edit} delete={props.delete} response={props.response}/>
        </div>
    })
    return localStorage.getItem('admintoken')?(
        <div className="get-question-pad">
            <div className="top-heads">QUESTIONS</div>
            <input type='text' value={text} onChange={handleInput} placeholder='Search' className="get-question-input"/>
            {filteredArray.length===0&&props.data.length===0?<div className="miss-data-get-candidate">No Questions are currently present</div>:filteredArray.length>0?<div className="get-question-list">{filteredBlock}</div>:<div className="get-question-list">{block}</div>}
        </div>
    ):<Redirect to='/logIn'/>
}

interface QuestionBlockProps{
    ques: Ques,
    edit: (data: Ques) => void,
    delete: (data: Ques) => void,
    response: string
}

const QuestionBlock = (props: QuestionBlockProps) =>{
    const block= props.ques;
    const nestedBlock = block.options.map((choices)=>{
        return <div className="get-question-option-list" key={choices.title}><OptionBlock pick={choices}/></div>
    })
    return(
        <div className="each-question-block">
            <div>
                <div className="question-cred-row"><div className="question-cred-head-cat">Question</div><div className="question-data">{block.question}</div></div>
                <div className="question-cred-row"><span className="question-cred-head-cat">Category</span><span className="question-data">{block.category}</span></div>
                <div className="question-cred-row">{nestedBlock}</div>
            </div>
            <div className="question-cred-row-butts">
                <div className="edit-question feat-butts" onClick={()=>props.edit(block)}><i className="fa fa-pencil-square-o" aria-hidden="true"></i> Edit Question</div>
                <div className="delete-question feat-butts" onClick={()=>props.delete(block)}><i className={props.response==="abc"?"fa fa-spinner":"fa fa-trash"} aria-hidden="true"></i> Delete Question</div>
            </div>
        </div>
    )
}

interface OptionBlockProps{
    pick: Opt
}

const OptionBlock = (props: OptionBlockProps)=>{
    return(
        <div>
            <input type="checkbox" name="correctOption" checked={props.pick.isCorrect} readOnly className="get-question-option-status"/>
            {props.pick.title}
        </div>
    )
}

interface Question{
    _id: string,
    _v: string,
    question: string,
    category: string,
    options: Opt[]
}


const EditQuestion = (props) => {
    const data = props.editThis
    const[ques,setQues] = React.useState<string>(data.question);
    const[category,setCategory] = React.useState<string>(data.category);
    const[ansArr,setAnsArr] = React.useState<Opt[]>(data.options);
    const [response, setResponse] = React.useState<string>("")
    const[ans,setAns] =React.useState<string>('');
    
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
            const tempArray: Opt[] = [...ansArr];
            tempArray.unshift(newAns);
            setAnsArr(tempArray);
            setAns('');
        }
    }
    function toggleCorrect(data: Opt){
        const index = ansArr.findIndex((answer)=>{return answer.title===data.title});
        const newAns:Opt = {
            title: data.title,
            isCorrect: !data.isCorrect
        }
        const toggledArray: Opt[] = Object.assign([], ansArr);
        toggledArray[index] = newAns;
        setAnsArr(toggledArray);
    }
    function resetPage(){
        setQues('');
        const resetArray: Opt[] = [];
        setAnsArr(resetArray);
        setAns('');
    }
    function submitQuestion(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setResponse("abc")
        const editData = {
            _id: data._id,
            _v: data._v,
            question: ques,
            category: category,
            options: ansArr
        };
        if(ques!=='' && ansArr.length>0 && category!==''){
            const token = localStorage.getItem("admintoken");
            axios.post(API_URL+'/auth/updateQuestion', {
                _id: data._id,
                data: editData
            },{headers: {gettoken: token}})
            .then((data)=>{
                if(data.data.message==='invalid token'){
                    localStorage.removeItem('admintoken')
                }
                else {
                    setResponse("")
                    props.toggle();
                }
            }).catch((err) => {
                console.log(err)
            })
            resetPage();
        }
        else{
            props.toggleCancel()
        }
    }
    function deleteAnswer(data: Opt){
        const freshArray: Opt[]= ansArr.filter((ans)=> {return ans.title!==data.title});
        setAnsArr(freshArray);
    }
    return localStorage.getItem('admintoken')?(
        <div className="add-question">
            <div className="add-question-heading">Edit Question</div>
            <form onSubmit={submitQuestion} className="add-question-form">
                <div className="ques-row">
                    <label htmlFor="ques" className="add-question-label">Question</label>
                    <textarea  rows={10} cols={60}
                        className="add-question-input"
                        onChange={typeQues} 
                        value={ques} required/>
                    {/* <textarea type="text" name="ques" onChange={typeQues} value={ques} autoComplete='off' className="add-question-input"/> */}
                </div>
                <div className="ques-row">
                    <select required onChange={handleSelect} value={category}>
                        <option value=""disabled>Choose a Category</option>
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
                    <input className="add-question-input" type="text" name="ans" onChange={typeAns} onKeyPress={addAnswer} value={ans} autoComplete='off'/>
                </div>
                <ul className="ques-row-list">
                    <AnswerList data={ansArr} change={toggleCorrect} del={deleteAnswer}/>
                </ul>
                <button type="submit" className="ques-row add-question-button">{response==="abc"?"Loading":'Upload Question'}</button>
            </form>
            <button type="button" onClick={props.toggleCancel} className="question-edit-cancel">Cancel</button> 
        </div>
    ):<Redirect to='/logIn'/>
}

interface AnswerListProps{
    data: Opt[],
    change: (data: Opt)=> void;
    del: (data: Opt)=> void;
}

const AnswerList  = (props: AnswerListProps)=>{
    const pushedAnwser = props.data.map((answer)=><div key={answer.title} className="add-question-option-list">
        <div className="option-title-add"><input type="checkbox"  checked={answer.isCorrect} onChange={()=>props.change(answer)} className="add-question-option-list-input"/>{answer.title}</div>
        <div className="option-title-feature"><button className="trash-button" type="button" onClick={()=>props.del(answer)}><i className="fa fa-trash" aria-hidden="true"></i></button></div>
    </div>)
    return(
        <div>
            {pushedAnwser}
        </div>
    )
}

export default GetQuestions;