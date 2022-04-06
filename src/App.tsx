import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import LogIn from './routes/logIn';
import SignUp from './routes/signUp';
import VerifyEmail from './routes/verifyEmail';
import SetAdmin from './routes/setAdmin';
import Dashboard from './routes/dashboard';
import Instructions from './routes/instructions';
import Exam from './routes/exam';
import Feedback from './routes/feedback';
import LogOut from './routes/logOut';



const App: React.FC = () => {
    return(
        <BrowserRouter>
            <Switch>    
                <Route path="/verifyEmail" exact component={VerifyEmail} />
                <Route path="/signUp" exact component={SignUp} />
                <Route path="/logIn" exact component={LogIn} /> 
                <Route path="/exam/instructions" exact component={Instructions} /> 
                <Route path="/exam/test" exact component={Exam} />
                <Route path="/exam/feedback" exact component={Feedback} />
                <Route path="/exam/loggedOut" exact component={LogOut} /> 
                <Route path="/admin/dashboard" exact component={Dashboard} />
                <Route path="/setAdmin" exact component={SetAdmin} />     
            </Switch>
        </BrowserRouter>
    )
};

 export default App;