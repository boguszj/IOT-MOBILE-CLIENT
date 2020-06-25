import React from 'react';
import {View} from 'react-native';
import {AccessToken, LoginButton} from 'react-native-fbsdk';
import {loginEmiter} from "../events/events";
import GLOBAL from '../globals'

export class FacebookLogin extends React.Component {

  state: {loggedIn: boolean, userId: string | undefined} = {
    loggedIn: false,
    userId: undefined,
  };

  constructor(props: any) {
    super(props);
    GLOBAL.auth = this;
    this.login();
  }

  login() {
    if (this.state.loggedIn) return;
    AccessToken.getCurrentAccessToken().then(response => {
      this.setState({
        userId: response?.userID,
        loggedIn: !!response?.userID,
      })
      loginEmiter.emit('logginStatusChanged', this.state.loggedIn, this.state.userId);
    })
  }

  logout() {
    if (!this.state.loggedIn) return;
    this.setState({
      userId: undefined,
      loggedIn: false,
      accessToken: undefined,
    })
    loginEmiter.emit('logginStatusChanged', false, undefined);
  }

  render(): React.ReactNode {
    return (
      <View>
        <LoginButton
          onLoginFinished={() => this.login()}
          onLogoutFinished={() => this.logout()} />
      </View>
    );
  }
}
