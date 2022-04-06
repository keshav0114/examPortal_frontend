import React from 'react';
import axios from 'axios';
import { API_URL } from '../url';
import {Redirect} from 'react-router-dom';
import '../css stylesheets/exam.css';

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

interface Data{
    html: Array<Ques>,
    css: Array<Ques>,
    sql: Array<Ques>,
    apti: Array<Ques>,
    selected: Array<Ques>
}

interface Submit {
    attemptedQuestion: string,
    isVariable: boolean, //isCorrect
    markedAnswer: string,
    isConstant: boolean //isSaved
}

const Exam : React.FC = () => {
    const [data,setData] = React.useState<Data>({
        html: [],
        css: [],
        sql: [],
        apti: [],
        selected: []
    });
    const [QuestionCount, setQuestionCount] = React.useState<number>(0)
    const [displayCategory, setDisplayCategory] = React.useState<Ques[]>([])
    const [lang,setLang] = React.useState<string>('--')
    const [warn,setWarn] = React.useState<boolean>(false)
    const [bool,setBool] = React.useState<boolean>(false)
    const [submitData, setSubmitData] = React.useState<Submit[]>([])
    const [response, setResponse] = React.useState<string>("")
    const [endTime,setEndTime] = React.useState<any>(0)
    const [startTime,setStartTime] = React.useState<any>(0)

    //fetching data
    React.useEffect(()=>{
        const token = localStorage.getItem("authtoken");
        axios.get(API_URL+'/auth/recruitmentExam2020',{headers: {gettoken: token}})
        .then((response)=>{
            const res = response.data.message;
            if(res==='invalid token'){
                localStorage.removeItem('authtoken')
                localStorage.removeItem("data");
                localStorage.removeItem("moment");
                localStorage.removeItem("credData");
            }
            else {
                setData({
                    html: res.html,
                    css: res.css,
                    sql: res.sql,
                    apti: res.apti,
                    selected: res.selected
                })
                setDisplayCategory(res.html)
                setLang(res.selected[0].category)
                if(localStorage.getItem("credData")){
                    const localStored = localStorage.getItem("credData");
                    if(localStored!==null){
                        const storedData = JSON.parse(localStored);
                        setSubmitData(storedData)
                    }
                }
                if(localStorage.getItem('data')&&localStorage.getItem('moment')){
                    const savedStartTime = localStorage.getItem('moment')
                    const savedEndTime = localStorage.getItem('data')
                    if(savedEndTime!==null&&savedStartTime!==null){
                        const endTime = JSON.parse(savedEndTime);
                        const startTime = JSON.parse(savedStartTime);
                        setEndTime(endTime)
                        setStartTime(startTime)
                    }
                }
                else{
                    const startTime = new Date().getTime()
                    const stringedStartTime = JSON.stringify(startTime)
                    localStorage.setItem('moment',stringedStartTime);
                    const endTime = new Date().getTime() + 3600000;
                    const stringedEndTime = JSON.stringify(endTime)
                    localStorage.setItem('data',stringedEndTime);
                    setEndTime(endTime);
                    setStartTime(startTime);
                }
            }
        }).catch((err)=>{
            console.log(err)
        })
    },[]);

    function passQuestion(qsubmit: Submit){
        if(submitData.length<=0){
            submitData.push(qsubmit)
            localStorage.setItem("credData", JSON.stringify(submitData));
        }
        else{
            const indexedObject: any = submitData.find((mappedObject)=>{
                return mappedObject.attemptedQuestion===qsubmit.attemptedQuestion
            })
            if(indexedObject){ 
                const index = submitData.indexOf(indexedObject)
                submitData[index] = qsubmit;
                localStorage.setItem("credData", JSON.stringify(submitData));
            }
            else{
                submitData.push(qsubmit)
                localStorage.setItem("credData", JSON.stringify(submitData));
            }  
        }
    }

    function markSaved(question: string){
        if(submitData.length>0){
            const indexedData: any = submitData.find((mappedObject)=>{
                return mappedObject.attemptedQuestion===question
            })
            const index = submitData.indexOf(indexedData);
            const submitAnswer: Submit = {
                ...indexedData,
                isConstant: true
            }
            submitData[index] = submitAnswer
            localStorage.setItem("credData", JSON.stringify(submitData));
            const find = displayCategory.find((mappedObject)=>{
                return mappedObject.question===question
            })
            if(find){
                const indexFound = displayCategory.indexOf(find)
                if(indexFound===displayCategory.length-1){
                    if(find.category==="HTML"){
                        setDisplayCategory(data.css)
                    }
                    else if(find.category==="CSS"){
                        setDisplayCategory(data.sql)
                    }
                    else if(find.category==="SQL"){
                        setDisplayCategory(data.apti)
                    }
                    else if(find.category==="APTI"){
                        setDisplayCategory(data.selected)
                    }
                    else if(find.category===lang){
                        setWarn(true)
                        setDisplayCategory(data.selected)
                    }
                    setQuestionCount(0)
                }
                else{
                    setQuestionCount(indexFound+1)
                }
            }
        }
    }

    function markForReview(ques: Ques){
        const indexCat = displayCategory.indexOf(ques);
        if(indexCat===displayCategory.length-1){
            if(ques.category==="HTML"){
                setDisplayCategory(data.css)
            }
            else if(ques.category==="CSS"){
                setDisplayCategory(data.sql)
            }
            else if(ques.category==="SQL"){
                setDisplayCategory(data.apti)
            }
            else if(ques.category==="APTI"){
                setDisplayCategory(data.selected)
            }
            else if(ques.category===lang){
                setWarn(true)
            }
            setQuestionCount(0)
        }
        else{
            setQuestionCount(indexCat+1)
        }
    }

    // rendering question index buttons
    const index = displayCategory.map((count)=>{
        //changing question on clicking question number
        function changeQuestion(quesNo){
            setQuestionCount(quesNo)
        }
        return(
            <span key={displayCategory.indexOf(count)}>
                <IndexButton 
                nos={displayCategory.indexOf(count)} 
                goToQuestion={changeQuestion} 
                question={count} 
                submitData={submitData}
                questionCount={QuestionCount}
                displayCategory={displayCategory}/>
            </span>
        )
    })


    //end Exam
    function submitExam(){
        setResponse("abc")
        const correctAnswer = submitData.filter((mappedData)=> mappedData.isVariable===true)
        const token = localStorage.getItem("authtoken");
        const upload = {
            response: submitData,
            score: correctAnswer.length
        }
        axios.post(API_URL+'/auth/recruitmentExam2020', upload,{headers: {gettoken: token}}).then((result)=>{
            if(result.data.message===''){
                localStorage.removeItem('authtoken')
            }
            else {
                setBool(true)
                localStorage.removeItem('credData');
                // localStorage.removeItem("data");
                // localStorage.removeItem("moment");
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    return bool?<Redirect to='/exam/feedback'/>:localStorage.getItem("authtoken")?(
            <div id="main-container-exam">
            <div id="warn">
                {warn?<Warn 
                    submit={submitExam} 
                    cancelSubmission={()=>setWarn(false)}
                    toggle={warn}
                    response={response}
                />:null}
            </div>
            <div id="navbar">
                <div id="nav-left">
                    <img id="logo-exam" alt="logo" src={require('../assets/exam-logo.png')}/>
                </div>
                <div id="exam-h2">
                    <h2>CINE</h2>
                </div>
                <div id="exam-timer">
                    <span>Time Left</span>
                    {<Timer endExam={submitExam} data={displayCategory} endTime={endTime} startTime={startTime}/>}
                </div>
                <div id="exam-submit">
                    <input type='button' value="SUBMIT" onClick={()=>setWarn(true)}/>
                </div>
            </div>

            <div id="sub-body">
                <div id="sub-body-left-part">
                    <div id="cat-box">
                        <input type="button" onClick={()=>{
                        setDisplayCategory(data.html)
                        setQuestionCount(0)}
                        } value="HTML" 
                        className={displayCategory===data.html?"cat-active":"cat-inactive"}/>

                        <input type="button" onClick={()=>{
                            setDisplayCategory(data.css)
                            setQuestionCount(0)}} value="CSS"
                            className={displayCategory===data.css?"cat-active":"cat-inactive"}/>

                        <input type="button" onClick={()=>{
                            setDisplayCategory(data.sql)
                            setQuestionCount(0)}} value="SQL"
                            className={displayCategory===data.sql?"cat-active":"cat-inactive"}/>

                        <input type="button" onClick={()=>{
                            setDisplayCategory(data.apti)
                            setQuestionCount(0)}} value="APTITUDE"
                            className={displayCategory===data.apti?"cat-active":"cat-inactive"}/>

                        <input type="button" onClick={()=>{
                            setDisplayCategory(data.selected)
                            setQuestionCount(0)}} value={lang}
                            className={displayCategory===data.selected?"cat-active":"cat-inactive"}/>
                    </div>
                    <div id="question-block">
                        {displayCategory.length>0?
                        <QuestionBlock
                        ques={displayCategory[QuestionCount]}
                        passQuestion={passQuestion}
                        submittedQuestions={submitData}
                        markForReview={markForReview}
                        saveAnswer={markSaved}/>: null}
                    </div>
                </div>
                <div id="sub-body-right-part">
                    <div id="sub-body-right-part-top">
                        {index}
                    </div>
                    <div id="sub-body-right-part-bottom">
                        <div className="legend">
                            <div id="did-not-attempt" className="color-box"></div>
                            <div className="content">Did Not Attempt</div>
                        </div>
                        <div className="legend">
                            <div id="saved" className="color-box"></div>
                            <div className="content">Saved</div>
                        </div>
                        <div className="legend">
                            <div id="marked-for-review" className="color-box"></div>
                            <div className="content">Marked For Review</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ):<Redirect to='/logIn'/>
}

interface Warn{
    submit: (e: React.MouseEvent<HTMLInputElement>)=> void,
    cancelSubmission: (e: boolean) => void;
    toggle: boolean;
    response: string
}

const Warn = (props: Warn) => {
    return(
        <div id={props.toggle?"warn-active":"warn-inactive"}>
            <div id="warn-heads">
                <div id="heading">CINE 2021</div>
                <div id="description">Are you sure you want to end the exam?</div>
            </div>
            <div id="warn-buttons">
                <input id="no-button" type='button' value="NO" onClick={()=>props.cancelSubmission(false)}/>
                <input id="yes-button" type='button' value={props.response==='abc'?"Loading...":'YES'} onClick={props.submit}/>
            </div>
        </div>
    )
}


//other components
interface QuestionBlockProps{
    ques: Ques,
    passQuestion: (qsubmit: Submit) => void,
    submittedQuestions : Submit[],
    markForReview: (ques: Ques) => void,
    saveAnswer: (ques: string) => void
}

const QuestionBlock = (props: QuestionBlockProps) =>{
    const [submit, setSubmit] = React.useState<Submit>();
    const block= props.ques;
    const submittedQuestions = props.submittedQuestions;
    const submitEntry = submittedQuestions.find((mappedObject)=>{
        return mappedObject.attemptedQuestion===block.question
    })
    function markAnswer(choiceMade: string, check: boolean){
        const data:Submit = {
            attemptedQuestion: block.question,
            isVariable: check,
            markedAnswer: choiceMade,
            isConstant: false
        }
        setSubmit(data)
        props.passQuestion(data)  
    }
    function passSaved(){
        if(submit?.markedAnswer!==''){
            props.saveAnswer(block.question)
        }
        else{
            props.markForReview(block)
        }
    }
    const nestedBlock = block.options.map((choices)=>{
        return <div id="option" key={choices.title}><OptionBlock pick={choices} markAnswer={markAnswer} submittedChoices={submitEntry}/></div>
    })
    return(
        <React.Fragment>
            <div className="q-block-hold">
                <div id="q-block">
                        <pre id="question">{block.question}</pre>
                        <div id="options">{nestedBlock}</div>
                </div>
                    <div id="q-block-bottom">
                        <div id="mark-button" onClick={()=>{props.markForReview(block)}}>
                            <span>Mark for Review</span>
                        </div>
                        <div id="save-button" onClick={()=>{passSaved()}}>
                            <span>Save</span>
                        </div> 
                    </div>
            </div>
        </React.Fragment>
    )
}

interface OptionBlockProps{
    pick: Opt,
    markAnswer: (ans: string, valid: boolean) => void,
    submittedChoices?: Submit
}



const OptionBlock = (props: OptionBlockProps)=>{
    const submittedChoices = props.submittedChoices;
    return(
        <React.Fragment>
            <input type="radio" name="correctOption" 
            onChange={()=>{
                props.markAnswer(props.pick.title,props.pick.isCorrect)
            }}
            defaultChecked={submittedChoices?.markedAnswer===props.pick.title?true:undefined} className="exam-input"/>
            <span>{props.pick.title}</span>
        </React.Fragment>
    )
}

interface IndexButtonProps{
    goToQuestion : (data: number) => void;
    nos: number;
    question: Ques;
    submitData: Submit[];
    questionCount: number;
    displayCategory: Ques[];
}

const IndexButton = (props: IndexButtonProps) => {
    const questionFound = props.submitData.find((object)=>{
        return object.attemptedQuestion===props.question.question
    })
    const presentQuestion = props.displayCategory.indexOf(props.question);
    if(questionFound&&questionFound.isConstant){
        return(
            <span>
                <input 
                    type="button" 
                    value={props.nos+1} 
                    onClick={()=>props.goToQuestion(props.nos)}
                    // className="index-button-save"
                    className={presentQuestion===props.questionCount?"index-button-save-focus":"index-button-save"}
                    />
            </span>
        )
    }
    else if(questionFound&&!questionFound.isConstant){
        return(
            <span>
                <input 
                    type="button" 
                    value={props.nos+1} 
                    onClick={()=>props.goToQuestion(props.nos)}
                    // className="index-button-marked-for-review"
                    className={presentQuestion===props.questionCount?"index-button-marked-for-review-focus":"index-button-marked-for-review"}
                    />
            </span>
        )
    }
    else{  
        return(
            <span>
                <input 
                    type="button" 
                    value={props.nos+1} 
                    onClick={()=>props.goToQuestion(props.nos)}
                    className={presentQuestion===props.questionCount?"index-button-focus":"index-button"}
                    />
            </span>
        )
    }
}

interface Timer{
    endExam: ()=>void;
    data: Ques[];
    endTime: number;
    startTime: number;
}

const Timer = (props: Timer) => {
    const [hours,setHours] = React.useState<number>(0)
    const [minutes,setMinutes] = React.useState<number>(0)
    const [seconds,setSeconds] = React.useState<number>(0)

    if(props.data.length>0&&props.endTime>0){
        const endTime = props.endTime;
        const startTime = props.startTime;
        setTimeout(()=>{
            const currentTime = new Date().getTime();
            const leftTime = endTime-currentTime;
            setHours(Math.floor((leftTime / (1000 * 60 * 60)) % 24))
            setMinutes(Math.floor((leftTime / 1000 / 60) % 60));
            setSeconds(Math.floor((leftTime / 1000) % 60));
            const apxTime = Math.floor((leftTime / 1000))
            if(apxTime<=1){
                props.endExam()
            }
            if(currentTime<startTime){
                localStorage.removeItem("data");
                localStorage.removeItem("moment");
                localStorage.removeItem("credData");
                localStorage.removeItem("authtoken");
                alert('Malicious activity has been detected. You are hence disqualified.');
                props.endExam()
            }
        },1000);
    }

    return(
        <div id="exam-timer-timer">
            {hours/10<1?'0'+hours:hours}:{minutes/10<1?'0'+minutes:minutes}:{seconds/10<1?'0'+seconds:seconds}
        </div>
    )
}

export default Exam;
