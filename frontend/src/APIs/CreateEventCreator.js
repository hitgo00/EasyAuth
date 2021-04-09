
import {API_URL} from '../Constants';
import Axios from 'axios';

const CreateEventCreator = async function (id_token){
    
    const headerAuth = {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${id_token}`
      }

    const dummyData ={}

    return( Axios.post(`${API_URL}/api/event-creator/register`,dummyData,{
        headers: headerAuth
       })
    .then(resp=>{
        return resp;
    })
    .catch(err=>{
        return err;
    }));
};

export default CreateEventCreator;
