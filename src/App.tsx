import React from 'react'
import { useSearchParams } from "react-router-dom";
import { TopNavigation, ButtonDropdownProps } from '@cloudscape-design/components';
import { Header } from './components/header';
import SignalingSetting from './components/modal/signaling';
import ControlSetting from './components/modal/control';
import License from './components/modal/license';
import Minime from './components/minime/minime';
import './App.css'

const App = () => {
  const [searchParams, _] = useSearchParams();

  // シグナリング初期値
  const [signalingUrl, setSignalingUrl] = React.useState('wss://ayame-labo.shiguredo.app/signaling');
  const [signalingKey, setSignalingKey] = React.useState(searchParams.get('signalingKey') || '');
  const [roomId, setRoomId] = React.useState(searchParams.get('roomId') || '');

  // 車輪制御初期値
  const [wheelDistance, setDistanceBetweenWheels] = React.useState(95);
  const [stickyCameraJoystick, setStickyCameraJoystick] = React.useState(true);
  const [thresholdAlertSensor, setThresholdAlertSensor] = React.useState(10);

  // モーダル表示状態
  const [visibleSignalingSetting, setVisibleSignalingSetting] = React.useState(false);
  const [visibleControllingSetting, setVisibleControllingSetting] = React.useState(false);
  const [visibleLicense, setVisibleLicense] = React.useState(false);

  const onDropdownMenuItem = (detail: ButtonDropdownProps.ItemClickDetails) => {
    switch (detail.id) {
      case "settings-signaling":
        setVisibleSignalingSetting(true);
        break;
      case "settings-controling":
        setVisibleControllingSetting(true);
        break;
      case "settings-licenses":
        setVisibleLicense(true);
        break;
      default:
        console.error(`DropdownMenu is not implemented yet!: ${detail.id}`);
    }
  };

  const isReady = () => {
    return signalingKey !== '' && roomId !== '';
  };

  return (
    <div className="App">
      <Header
        signalingUrl={signalingUrl}
        signalingKey={signalingKey}
        roomId={roomId}
        onDropdownMenuItem={onDropdownMenuItem}
      />
      <SignalingSetting
        visible={visibleSignalingSetting || !isReady()}
        setVisible={setVisibleSignalingSetting}
        signalingUrl={signalingUrl}
        signalingKey={signalingKey}
        roomId={roomId}
        setSignalingUrl={setSignalingUrl}
        setSignalingKey={setSignalingKey}
        setRoomId={setRoomId}
      />
      <ControlSetting
        visible={visibleControllingSetting}
        setVisible={setVisibleControllingSetting}
        wheelDistance={wheelDistance}
        stickyCameraJoystick={stickyCameraJoystick}
        thresholdAlertSensor={thresholdAlertSensor}
        setDistanceBetweenWheels={setDistanceBetweenWheels}
        setStickyCameraJoystick={setStickyCameraJoystick}
        setThresholdAlertSensor={setThresholdAlertSensor}
      />
      <License
        visible={visibleLicense}
        setVisible={setVisibleLicense}
      />
      <Minime
        onMessage={() => { }}
        onFailed={() => { setVisibleSignalingSetting(true) }}
        isReady={isReady()}
        wheelDistance={wheelDistance}
        stickyCameraJoystick={stickyCameraJoystick}
        thresholdAlertSensor={thresholdAlertSensor}
        signalingUrl={signalingUrl}
        signalingKey={signalingKey}
        roomId={roomId}
      />
    </div>
  );
};

export default App;
