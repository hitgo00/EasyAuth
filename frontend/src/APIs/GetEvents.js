
import {API_URL} from '../Constants';
import Axios from 'axios';

const GetEvents = async function (id_token){
    
    const headerAuth = {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${id_token}`
      }

    return( Axios.get(`${API_URL}/api/event-creator/events`,{
        headers: headerAuth
       })
    );
};

export default GetEvents;
