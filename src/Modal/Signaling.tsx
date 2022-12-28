import React from 'react';
import InputEntry from './InputEntry';
import { Modal, Box, SpaceBetween, Button } from '@cloudscape-design/components';

export type SignalingModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  signalingUrl: string;
  signalingKey: string;
  roomId: string;
  onSignalingUrl: (value: string) => void;
  onSignalingKey: (value: string) => void;
  onRoomId: (value: string) => void;
};

// https://cloudscape.design/components/modal/?tabId=playground
const SignalingModal = (props: SignalingModalProps) => {
  const [signalingUrl, setSignalingUrl] = React.useState(props.signalingUrl);
  const [signalingKey, setSignalingkey] = React.useState(props.signalingKey);
  const [roomId, setRoomId] = React.useState(props.roomId);

  const cancel = () => {
    props.setVisible(false);
  };

  const apply = () => {
    props.onSignalingUrl(signalingUrl);
    props.onSignalingKey(signalingKey);
    props.onRoomId(roomId);
    props.setVisible(false);
  };

  return (
    <Modal
      onDismiss={cancel}
      visible={props.visible}
      closeAriaLabel="閉じる"
      footer={
        <SpaceBetween direction="vertical" size="m">
          <InputEntry
            title='シグナリングURL'
            value={signalingUrl}
            onChange={setSignalingUrl}
          />
          <InputEntry
            title='シグナリングキー'
            value={signalingKey}
            onChange={setSignalingkey}
          />
          <InputEntry
            title='ルームID'
            value={roomId}
            onChange={setRoomId}
          />
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
        </SpaceBetween>
      }
      header="シグナリング設定"
    />
  );
};

export default SignalingModal;
