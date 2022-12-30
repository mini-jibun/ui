import React from 'react'
import Logo from './assets/logo.png'
import './App.css'
import { useSearchParams } from 'react-router-dom';
import MiniMe from './MiniMe/MiniMe';
import { TopNavigation, ButtonDropdownProps } from '@cloudscape-design/components';
import SignalingModal from './Modal/Signaling';

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
              text: "シグナリング設定"
            }
          ],
          onItemClick: ({ detail }) => { props.onDropdownMenuItem(detail); }
        }
      ]}
    />
  );
};

// クエリパラメータからキーに対応した値を取得する
// https://reactrouter.com/en/main/hooks/use-search-params
// TopNavigation
// https://cloudscape.design/components/top-navigation/?tabId=playground
const App = () => {
  const [searchParams, _] = useSearchParams();
  const [signalingUrl, setSignalingUrl] = React.useState('wss://ayame-labo.shiguredo.app/signaling');
  const [signalingKey, setSignalingKey] = React.useState(searchParams.get('signalingKey') || '');
  const [roomId, setRoomId] = React.useState(searchParams.get('roomId') || '');
  const [visibleSignalingSetting, setVisibleSignalingSetting] = React.useState(false);

  const onSignalingUrl = (url: string) => {
    setSignalingUrl(url);
  };
  const onSignalingKey = (key: string) => {
    setSignalingKey(key);
  };
  const onRoomId = (id: string) => {
    setRoomId(id);
  };

  const isReady = () => {
    return signalingKey !== '' && roomId !== '';
  };

  const onDropdownMenuItem = (detail: ButtonDropdownProps.ItemClickDetails) => {
    switch (detail.id) {
      case "settings-signaling":
        setVisibleSignalingSetting(true);
        break;
      default:
        console.error(`${detail.id} in DropdownMenu is not implemented yet!`);
    }
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
        onSignalingUrl={onSignalingUrl}
        onSignalingKey={onSignalingKey}
        onRoomId={onRoomId}
      />
      <MiniMe
        onMessage={() => { }}
        onFailed={() => { setVisibleSignalingSetting(true) }}
        isReady={isReady()}
        isStickyServo={true}
        signalingUrl={signalingUrl}
        signalingKey={signalingKey}
        roomId={roomId}
      />
    </div>
  );
};

export default App;
