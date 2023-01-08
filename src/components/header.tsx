import Logo from '../assets/logo.png'
import { TopNavigation, ButtonDropdownProps } from '@cloudscape-design/components';

export interface HeaderProps {
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
            },
            {
              id: "settings-licenses",
              text: "ライセンス情報"
            }
          ],
          onItemClick: ({ detail }) => { props.onDropdownMenuItem(detail); }
        }
      ]}
    />
  );
};

export { Header };
