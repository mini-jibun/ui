import React from 'react';
import { Modal, Input, Toggle, Box, SpaceBetween, Button } from '@cloudscape-design/components';
import { Setting, SettingState } from '../types';

export interface ControlSettingProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setting: Setting;
  setSetting: SettingState;
}

const ControlSetting = (props: ControlSettingProps) => {
  const [wheelDistance, setDistanceBetweenWheels] = React.useState(props.setting.wheelDistance);
  const [cameraAngleSticky, setCameraAngleSticky] = React.useState(props.setting.cameraAngleSticky);
  const [sensorAlertThreshold, setThresholdAlertSensor] = React.useState(props.setting.sensorAlertThreshold);

  const cancel = () => {
    props.setVisible(false);
  };

  const apply = () => {
    props.setSetting({
      ...props.setting,
      wheelDistance, cameraAngleSticky, sensorAlertThreshold
    });
    props.setVisible(false);
  };

  return (
    <Modal
      onDismiss={cancel}
      visible={props.visible}
      closeAriaLabel="閉じる"
      header="操縦"
      id="ControlSetting"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button
              variant="link"
              onClick={cancel}
            >キャンセル</Button>
            <Button
              variant="primary"
              onClick={apply}
            >適用</Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween direction="vertical" size="m">
        <SpaceBetween direction="vertical" size="xs">
          <Box variant="p">車輪間の距離(mm)</Box>
          <Input
            type="number"
            value={props.setting.wheelDistance.toString()}
            onChange={({ detail }) => { setDistanceBetweenWheels(Number(detail.value)) }}
          />
        </SpaceBetween>
        <SpaceBetween direction="vertical" size="xs">
          <Box variant="p">カメラ操縦ジョイスティックの位置保持</Box>
          <Toggle
            onChange={({ detail }) => setCameraAngleSticky(detail.checked)}
            checked={cameraAngleSticky}
          >
            {cameraAngleSticky ? "有効" : "無効"}
          </Toggle>
        </SpaceBetween>
        <SpaceBetween direction="vertical" size="xs">
          <Box variant="p">アラートを出すセンサしきい値</Box>
          <Input
            type="number"
            value={props.setting.sensorAlertThreshold.toString()}
            onChange={({ detail }) => { setThresholdAlertSensor(Number(detail.value)) }}
          />
        </SpaceBetween>
      </SpaceBetween>
    </Modal>
  );
};
export default ControlSetting;
