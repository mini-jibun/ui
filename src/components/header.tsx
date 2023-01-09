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
