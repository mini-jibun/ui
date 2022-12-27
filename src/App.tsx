import React from 'react'
import Logo from './assets/logo.png'
import './App.css'
import { useSearchParams } from 'react-router-dom';
import Ayame from './Ayame';
import { TopNavigation, ButtonDropdownProps } from '@cloudscape-design/components';
import SignalingModal from './Modal/Signaling';

type HeaderProps = {
  signalingUrl: string;
  signalingKey?: string;
  roomId?: string;
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
          onItemClick: ({ detail }) => { props.onDropdownMenuItem(detail) }
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [signalingUrl, setSignalingUrl] = React.useState('wss://ayame-labo.shiguredo.app/signaling');
  const [query, setQuery] = React.useState(new Map(searchParams.entries()));
  const [visibleSignalingSetting, setVisibleSignalingSetting] = React.useState(false);

  const onSignalingUrl = (url: string) => {
    setSignalingUrl(url);
  };
  const onSignalingKey = (key: string) => {
    setQuery(query.set('signalingKey', key));
    setSearchParams(Object.fromEntries(query));
  };
  const onRoomId = (id: string) => {
    setQuery(query.set('roomId', id));
    setSearchParams(Object.fromEntries(query));
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
        signalingKey={query.get('signalingKey')}
        roomId={query.get('roomId')}
        onDropdownMenuItem={onDropdownMenuItem}
      />
      <SignalingModal
        visible={visibleSignalingSetting}
        setVisible={setVisibleSignalingSetting}
        signalingUrl={signalingUrl}
        signalingKey={query.get('signalingKey')}
        roomId={query.get('roomId')}
        onSignalingUrl={onSignalingUrl}
        onSignalingKey={onSignalingKey}
        onRoomId={onRoomId}
      />
      <Ayame
        signalingUrl={signalingUrl}
        signalingKey={query.get('signalingKey')!}
        roomId={query.get('roomId')!}
      />
    </div>
  );
};

export default App
