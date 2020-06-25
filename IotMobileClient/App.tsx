import React from 'react';
import {FacebookLogin} from "./screens/FacebookLogin";
import {IotPanel} from "./screens/IotPanel";
import GLOBAL from './globals'
import {StyleSheet, View} from "react-native";

class App extends React.Component {

  state = {
    loggedIn: false,
    userId: undefined,
  }

  constructor(props: any) {
    super(props);
    GLOBAL.app = this;
  }

  render() {
    return this.state.loggedIn ?
      <IotPanel/> :
      (
        <View style = {styles.centerdView}>
          <FacebookLogin/>
        </View>
      );
  }
}

export default App;

const styles = StyleSheet.create({
  centerdView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#55A4FF',
  },
});
