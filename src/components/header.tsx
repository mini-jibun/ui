import Logo from '../assets/logo.png'
import { TopNavigation, ButtonDropdownProps } from '@cloudscape-design/components';
import { Setting } from './types';

export interface HeaderProps {
  setting: Setting;
  onDropdownMenuItem: (detail: ButtonDropdownProps.ItemClickDetails) => void;
}

const Header = (props: HeaderProps) => {
  const href = props.setting.signalingKey !== '' && props.setting.roomId !== '' ?
    `/?signalingKey=${props.setting.signalingKey}&roomId=${props.setting.roomId}` :
    '/';

  // 引用: https://developer.mozilla.org/ja/docs/Web/API/Fullscreen_API#%E5%85%A8%E7%94%BB%E9%9D%A2%E3%83%A2%E3%83%BC%E3%83%89%E3%81%AE%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <TopNavigation
      identity={{
        href: href,
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
          type: "button",
          iconName: "view-full",
          ariaLabel: "fullscreen",
          title: "fullscreen",
          onClick: toggleFullscreen
        },
        {
          type: "menu-dropdown",
          iconName: "settings",
          ariaLabel: "設定",
          title: "設定",
          items: [
            {
              id: "signaling",
              text: "シグナリング"
            },
            {
              id: "controlling",
              text: "操縦"
            },
            {
              id: "license",
              text: "ライセンス情報"
            }
          ],
          onItemClick: ({ detail }) => props.onDropdownMenuItem(detail)
        }
      ]}
    />
  );
};

export { Header };
