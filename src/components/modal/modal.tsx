import { Setting, SettingState, Visible, VisibleState } from "../types";
import SignalingSetting from './signaling';
import ControlSetting from './control';
import License from './license';

interface SettingProps {
  visible: Visible;
  setVisible: VisibleState;
  setting: Setting;
  setSetting: SettingState;
}

const Modal = (props: SettingProps) => {
  return (
    <>
      <SignalingSetting
        visible={props.visible.signaling}
        setVisible={(visible) => props.setVisible({ ...props.visible, signaling: visible })}
        setting={props.setting}
        setSetting={props.setSetting}
      />
      <ControlSetting
        visible={props.visible.controlling}
        setVisible={(visible) => props.setVisible({ ...props.visible, controlling: visible })}
        setting={props.setting}
        setSetting={props.setSetting}
      />
      <License
        visible={props.visible.license}
        setVisible={(visible) => props.setVisible({ ...props.visible, license: visible })}
      />
    </>
  );
};

export { Modal };
