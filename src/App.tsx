import React from 'react'
import Logo from './assets/logo.png'
import './App.css'
import { useLocation, useSearchParams } from 'react-router-dom';
import Ayame from './Ayame';
import { Alert, TopNavigation } from '@cloudscape-design/components';

// クエリパラメータからキーに対応した値を取得する
// https://reactrouter.com/en/main/hooks/use-search-params
function App() {
  const [searchParams] = useSearchParams();
  const signalingKey = searchParams.get('signalingKey');
  const roomId = searchParams.get('roomId');

  return (
    <div className="App">
      <TopNavigation
        identity={{
          href: `/?signalingKey=${signalingKey}&roomId=${roomId}`,
          title: "mini-me ui",
          logo: {
            src: Logo,
            alt: "mini-me ui"
          }
        }}
        utilities={[
          {
            type: "menu-dropdown",
            iconName: "settings",
            ariaLabel: "Settings",
            title: "Settings",
            items: [
              {
                id: "settings-org",
                text: "Organizational settings"
              },
              {
                id: "settings-project",
                text: "Project settings"
              }
            ]
          }
        ]}
        i18nStrings={{
          overflowMenuTriggerText: "More",
          overflowMenuTitleText: "All"
        }}
      />
    </div>
  );
}

export default App
