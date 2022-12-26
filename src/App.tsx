import React from 'react'
import Logo from './assets/logo.png'
import './App.css'
import { useSearchParams } from 'react-router-dom';
import Ayame from './Ayame';
import { TopNavigation } from '@cloudscape-design/components';
import SignalingModal from './Modal/Signaling';
import { onInputEntryChange } from './Modal/InputEntry';

type HeaderProps = {
  signalingUrl: string;
  signalingKey?: string;
  roomId?: string;
  onSignalingUrl: onInputEntryChange;
  onSignalingKey: onInputEntryChange;
  onRoomId: onInputEntryChange;
};

const Header = (props: HeaderProps) => {
  const [isSignalingSetting, setIsSignalingSetting] = React.useState(false);

  const handleDropdownMenu = (id: string) => {
    console.log(id);
    if (id == "signaling") setIsSignalingSetting(true);
  };

  return (
    <>
      <TopNavigation
        identity={{
          href: `/?signalingKey=${props.signalingKey}&roomId=${props.roomId}`,
          title: "mini-me ui",
          logo: {
            src: Logo,
            alt: "mini-me ui"
          }
        }}
        i18nStrings={{
          overflowMenuTriggerText: "More",
          overflowMenuTitleText: "All"
        }}
      />
    </>
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

  return (
    <div className="App">
      <Header
        signalingUrl={signalingUrl}
        signalingKey={query.get('signalingKey')}
        roomId={query.get('roomId')}
        onSignalingUrl={onSignalingUrl}
        onSignalingKey={onSignalingKey}
        onRoomId={onRoomId}
      />
      <SignalingModal
        visible={query.get('signalingKey') === undefined || query.get('roomId') === undefined}
        signalingUrl={signalingUrl}
        signalingKey={query.get('signalingKey')}
        roomId={query.get('roomId')}
        onSignalingUrl={onSignalingUrl}
        onSignalingKey={onSignalingKey}
        onRoomId={onRoomId}
      ></SignalingModal>
      <Ayame
        signalingUrl={signalingUrl}
        signalingKey={query.get('signalingKey')!}
        roomId={query.get('roomId')!}
      />
    </div>
  );
};

export default App
