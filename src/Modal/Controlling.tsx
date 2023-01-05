import React from 'react';
import { Modal, Input, Toggle, Box, SpaceBetween, Button } from '@cloudscape-design/components';

export interface ControllingModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;

  // 初期値
  distanceBetweenWheels: number;
  stickyCameraJoyStick: boolean;
  thresholdAlertSensor: number;

  // コールバック引数
  setDistanceBetweenWheels: (distance: number) => void;
  setStickyCameraJoyStick: (sticky: boolean) => void;
  setThresholdAlertSensor: (threshold: number) => void;
}

const ControllingModal = (props: ControllingModalProps) => {
  const [distanceBetweenWheels, setDistanceBetweenWheels] = React.useState(props.distanceBetweenWheels);
  const [stickyCameraJoyStick, setStickyCameraJoyStick] = React.useState(props.stickyCameraJoyStick);
  const [thresholdAlertSensor, setThresholdAlertSensor] = React.useState(props.thresholdAlertSensor);

  const cancel = () => {
    props.setVisible(false);
  };

  const apply = () => {
    props.setDistanceBetweenWheels(distanceBetweenWheels);
    props.setStickyCameraJoyStick(stickyCameraJoyStick);
    props.setThresholdAlertSensor(thresholdAlertSensor);
    props.setVisible(false);
  };

  return (
    <Modal
      onDismiss={cancel}
      visible={props.visible}
      closeAriaLabel="閉じる"
      header="操縦"
      id="ControllingModal"
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
            value={props.distanceBetweenWheels.toString()}
            onChange={({ detail }) => { setDistanceBetweenWheels(Number(detail.value)) }}
          />
        </SpaceBetween>
        <SpaceBetween direction="vertical" size="xs">
          <Box variant="p">カメラ操縦ジョイスティックの位置保持</Box>
          <Toggle
            onChange={({ detail }) => setStickyCameraJoyStick(detail.checked)}
            checked={stickyCameraJoyStick}
          >
            {stickyCameraJoyStick ? "有効" : "無効"}
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
export default ControllingModal;
