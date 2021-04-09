import { API_URL } from "../Constants";
import Axios from "axios";

const CreateEvent = async function (id_token, eventName) {
  const headerAuth = {
    "Content-Type": "application/json",
    Authorization: `JWT ${id_token}`,
  };

  const eventData = {
    event_name: eventName,
  };

  return Axios.post(`${API_URL}/api/event-creator/create-event`, eventData, {
    headers: headerAuth,
  })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err;
    });
};

export default CreateEvent;
