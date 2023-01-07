import React from 'react';
import { Modal, Input, Toggle, Box, SpaceBetween, Button } from '@cloudscape-design/components';

export interface ControlSettingProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;

  // 初期値
  wheelDistance: number;
  stickyCameraJoystick: boolean;
  thresholdAlertSensor: number;

  // コールバック引数
  setDistanceBetweenWheels: (distance: number) => void;
  setStickyCameraJoystick: (sticky: boolean) => void;
  setThresholdAlertSensor: (threshold: number) => void;
}

const ControlSetting = (props: ControlSettingProps) => {
  const [wheelDistance, setDistanceBetweenWheels] = React.useState(props.wheelDistance);
  const [stickyCameraJoystick, setStickyCameraJoystick] = React.useState(props.stickyCameraJoystick);
  const [thresholdAlertSensor, setThresholdAlertSensor] = React.useState(props.thresholdAlertSensor);

  const cancel = () => {
    props.setVisible(false);
  };

  const apply = () => {
    props.setDistanceBetweenWheels(wheelDistance);
    props.setStickyCameraJoystick(stickyCameraJoystick);
    props.setThresholdAlertSensor(thresholdAlertSensor);
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
            value={props.wheelDistance.toString()}
            onChange={({ detail }) => { setDistanceBetweenWheels(Number(detail.value)) }}
          />
        </SpaceBetween>
        <SpaceBetween direction="vertical" size="xs">
          <Box variant="p">カメラ操縦ジョイスティックの位置保持</Box>
          <Toggle
            onChange={({ detail }) => setStickyCameraJoystick(detail.checked)}
            checked={stickyCameraJoystick}
          >
            {stickyCameraJoystick ? "有効" : "無効"}
          </Toggle>
        </SpaceBetween>
        <SpaceBetween direction="vertical" size="xs">
          <Box variant="p">アラートを出すセンサしきい値</Box>
          <Input
            type="number"
            value={props.thresholdAlertSensor.toString()}
            onChange={({ detail }) => { setThresholdAlertSensor(Number(detail.value)) }}
          />
        </SpaceBetween>
      </SpaceBetween>
    </Modal>
  );
};
export default ControlSetting;
