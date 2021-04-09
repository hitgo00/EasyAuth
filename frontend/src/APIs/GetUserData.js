import { API_URL } from "../Constants";
import Axios from "axios";

const GetUserData = async function (id_token, eventId) {
  const headerAuth = {
    "Content-Type": "application/json",
    Authorization: `JWT ${id_token}`,
  };

  const eventData = {
    event_id: eventId,
  };

  return Axios.post(`${API_URL}/api/event-creator/getUserData`, eventData, {
    headers: headerAuth,
  })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      return err;
    });
};

export default GetUserData;
