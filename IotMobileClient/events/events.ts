import GLOBAL from '../globals'
import {EventEmitter} from "events";

export const loginEmiter = new EventEmitter();

loginEmiter.addListener('logginStatusChanged', (status, userId) => {
  GLOBAL.app.setState({
    loggedIn: status,
    userId: userId,
  });
});
