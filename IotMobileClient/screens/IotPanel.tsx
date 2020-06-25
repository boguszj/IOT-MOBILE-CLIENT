import React from 'react';
import {ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import {FacebookLogin} from "./FacebookLogin";
import GLOBAL from '../globals'
import {apiCall} from "../utils/api-utils";


const BooleanIotDevice = (props: {
  device: SingleBooleanIotDeviceDesc;
  onToggle: () => void;
}) => {
  return (
    <View>
      <Text> {props.device.name} </Text>
      <Switch onValueChange={props.onToggle} value={props.device.state} />
    </View>
  );
};

export class IotPanel extends React.Component {
  private configIntervalId: number | undefined;

  state = {
    devicesList: [] as SingleBooleanIotDeviceDesc[],
  };

  constructor(props: any) {
    super(props);
    this.configIntervalId = undefined;
    this.config().then((id) => (this.configIntervalId = id));
  }

  componentDidUpdate() {
    if (this.configIntervalId && !!this.state.devicesList.length) {
      clearInterval(this.configIntervalId);
    }
  }

  async getDevicesList(): Promise<SingleBooleanIotDeviceDesc[]> {
    const response = await apiCall('GET', 'http://192.168.0.87:8000/api/device/');
    return response.status === 200 ? response.data : [];
  }

  async config(): Promise<number> {
    // @ts-ignore
    return setInterval(
      () =>
        this.getDevicesList()
          .then((devicesList) => {
            this.setState({
              devicesList: devicesList,
            });
          })
          .catch((e) => console.debug(e)),
      5000,
    );
  }

  async toggle(device_id: string) {
    const devicesList = await Promise.all(
      this.state.devicesList.map(async (device: SingleBooleanIotDeviceDesc) => {
        if (
          device.device_id !== device_id ||
          !(await this.switchDeviceState(device_id, device.state))
        ) {
          return device;
        }
        return {
          device_id: device.device_id,
          name: device.name,
          state: !device.state,
        };
      }),
    ).catch(() => this.state.devicesList);
    this.setState({
      devicesList,
    });
  }

  async switchDeviceState(device_id: string, state: boolean): Promise<boolean> {
    const response = await apiCall('PUT',
      `http://192.168.0.87:8000/api/device/${device_id}/update`,
      // @ts-ignore
      {state: !state},
    );
    return response.status === 202;
  }

  render(): React.ReactNode {
    return !!this.state.devicesList && !!this.state.devicesList.length ? (
      <View style={styles.appContainer}>
        <ScrollView contentContainerStyle={styles.centerdScrollView}>
          {this.state.devicesList.map((device) => (
            <BooleanIotDevice
              onToggle={async () => await this.toggle(device.device_id)}
              key={device.device_id}
              device={device}
            />
          ))}
        </ScrollView>
        <FacebookLogin />
      </View>
    ) : (
      <View style={styles.appContainer}>
        <Text>Waiting for device list</Text>
        <FacebookLogin />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerdScrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

interface SingleBooleanIotDeviceDesc {
  device_id: string;
  key: string;
  name: string;
  state: boolean;
}
