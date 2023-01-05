import React from 'react'
import { useSearchParams } from "react-router-dom";
import { TopNavigation, ButtonDropdownProps } from '@cloudscape-design/components';
import SignalingModal from './Modal/Signaling';
import MiniMe from './MiniMe/MiniMe';
import Logo from './assets/logo.png'
import './App.css'
import ControllingModal from './Modal/Controlling';

interface HeaderProps {
  signalingUrl: string;
  signalingKey: string;
  roomId: string;
  onDropdownMenuItem: (detail: ButtonDropdownProps.ItemClickDetails) => void;
}

const Header = (props: HeaderProps) => {
  return (
    <TopNavigation
      identity={{
        href: `/?signalingKey=${props.signalingKey}&roomId=${props.roomId}`,
        title: "mini-me",
        logo: {
          src: Logo,
          alt: "mini-me"
        }
      }}
      i18nStrings={{
        overflowMenuTriggerText: "More",
        overflowMenuTitleText: "All"
      }}
      utilities={[
        {
          type: "menu-dropdown",
          iconName: "settings",
          ariaLabel: "設定",
          title: "設定",
          items: [
            {
              id: "settings-signaling",
              text: "シグナリング"
            },
            {
              id: "settings-controling",
              text: "操縦"
            }
          ],
          onItemClick: ({ detail }) => { props.onDropdownMenuItem(detail); }
        }
      ]}
    />
  );
};

const App = () => {
  const [searchParams, _] = useSearchParams();

  // シグナリング初期値
  const [signalingUrl, setSignalingUrl] = React.useState('wss://ayame-labo.shiguredo.app/signaling');
  const [signalingKey, setSignalingKey] = React.useState(searchParams.get('signalingKey') || '');
  const [roomId, setRoomId] = React.useState(searchParams.get('roomId') || '');

  // 車輪制御初期値
  const [distanceBetweenWheels, setDistanceBetweenWheels] = React.useState(95);
  const [stickyCameraJoyStick, setStickyCameraJoyStick] = React.useState(true);
  const [thresholdAlertSensor, setThresholdAlertSensor] = React.useState(10);

  // モーダル表示状態
  const [visibleSignalingSetting, setVisibleSignalingSetting] = React.useState(false);
  const [visibleControllingSetting, setVisibleControllingSetting] = React.useState(false);

  const onDropdownMenuItem = (detail: ButtonDropdownProps.ItemClickDetails) => {
    switch (detail.id) {
      case "settings-signaling":
        setVisibleSignalingSetting(true);
        break;
      case "settings-controling":
        setVisibleControllingSetting(true);
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
      <SignalingModal
        visible={visibleSignalingSetting || !isReady()}
        setVisible={setVisibleSignalingSetting}
        signalingUrl={signalingUrl}
        signalingKey={signalingKey}
        roomId={roomId}
        setSignalingUrl={setSignalingUrl}
        setSignalingKey={setSignalingKey}
        setRoomId={setRoomId}
      />
      <ControllingModal
        visible={visibleControllingSetting}
        setVisible={setVisibleControllingSetting}
        distanceBetweenWheels={distanceBetweenWheels}
        stickyCameraJoyStick={stickyCameraJoyStick}
        thresholdAlertSensor={thresholdAlertSensor}
        setDistanceBetweenWheels={setDistanceBetweenWheels}
        setStickyCameraJoyStick={setStickyCameraJoyStick}
        setThresholdAlertSensor={setThresholdAlertSensor}
      />
      <MiniMe
        onMessage={() => { }}
        onFailed={() => { setVisibleSignalingSetting(true) }}
        isReady={isReady()}
        distanceBetweenWheels={distanceBetweenWheels}
        stickyCameraJoyStick={stickyCameraJoyStick}
        thresholdAlertSensor={thresholdAlertSensor}
        signalingUrl={signalingUrl}
        signalingKey={signalingKey}
        roomId={roomId}
      />
    </div>
  );
};

export default App;
