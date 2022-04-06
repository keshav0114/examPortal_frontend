import React from 'react';
import '../css stylesheets/logout.css';

const LogOut: React.FC = () => {
    return (
        <div className="log-out-block">
            <div className="thanks">Thank you for participating</div>
            <div className="logout-success">You have been successfully logged out</div>
            <div className="csi">Powered by CSI</div>
            <div className="motto">CREATE SHARE INNOVATE</div>
        </div>
    )
}


export default LogOut
