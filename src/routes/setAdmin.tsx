import React from 'react';
import axios from 'axios';
import { API_URL } from '../url';


const SetAdmin = () => {
    const [retrivedData, setData] = React.useState<string>('');
    axios.get(API_URL+'/csiAkgecAdminRegister').then((data)=>{
        setData(data.data.message)
    }).catch((err)=>{
        console.log(err);
    })
    return(
        <div>
            {retrivedData!==''?retrivedData:'Loading'}
        </div>
    )
}

export default SetAdmin;