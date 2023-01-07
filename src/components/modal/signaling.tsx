import React from 'react';
import { Modal, Box, SpaceBetween, Button, Input } from '@cloudscape-design/components';

export interface SignalingSettingProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;

  // 初期値
  signalingUrl: string;
  signalingKey: string;
  roomId: string;

  // コールバック引数
  setSignalingUrl: (value: string) => void;
  setSignalingKey: (value: string) => void;
  setRoomId: (value: string) => void;
}

const SignalingSetting = (props: SignalingSettingProps) => {
  // 入力中に一時的に保持する
  const [signalingUrl, setSignalingUrl] = React.useState(props.signalingUrl);
  const [signalingKey, setSignalingKey] = React.useState(props.signalingKey);
  const [roomId, setRoomId] = React.useState(props.roomId);

  const cancel = () => {
    props.setVisible(false);
  };

  // 入力完了時の状態を引数として引数のコールバック関数を呼ぶ
  const apply = () => {
    props.setSignalingUrl(signalingUrl);
    props.setSignalingKey(signalingKey);
    props.setRoomId(roomId);
    props.setVisible(false);
  };

  return (
    <Modal
      onDismiss={cancel}
      visible={props.visible}
      closeAriaLabel="閉じる"
      header="シグナリング設定"
      id="SignalingSetting"
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
          <Box variant="p">シグナリングURL</Box>
          <Input
            value={signalingUrl}
            onChange={({ detail }) => { setSignalingUrl(detail.value) }}
          />
        </SpaceBetween>
        <SpaceBetween direction="vertical" size="xs">
          <Box variant="p">シグナリングキー</Box>
          <Input
            value={signalingKey}
            onChange={({ detail }) => { setSignalingKey(detail.value) }}
          />
        </SpaceBetween>
        <SpaceBetween direction="vertical" size="xs">
          <Box variant="p">ルームID</Box>
          <Input
            value={roomId}
            onChange={({ detail }) => { setRoomId(detail.value) }}
          />
        </SpaceBetween>
      </SpaceBetween>
    </Modal>
  );
};

export default SignalingSetting;
