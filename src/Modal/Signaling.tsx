import React from 'react';
import InputEntry from './InputEntry';
import { Modal, Box, SpaceBetween, Button } from '@cloudscape-design/components';


export type OnSignalingModal = (state: string) => void;
export type SignalingModalProps = {
  visible: boolean,
  signalingUrl: string,
  signalingKey?: string,
  roomId?: string,
  onSignalingUrl: OnSignalingModal,
  onSignalingKey: OnSignalingModal,
  onRoomId: OnSignalingModal
};

// https://cloudscape.design/components/modal/?tabId=playground
const SignalingModal = (props: SignalingModalProps) => {
  const [visible, setVisible] = React.useState(props.visible);
  const [signalingUrl, setSignalingUrl] = React.useState(props.signalingUrl || '');
  const [signalingKey, setSignalingkey] = React.useState(props.signalingKey || '');
  const [roomId, setRoomId] = React.useState(props.roomId || '');

  const closeModal = () => {
    setVisible(false);
  };

  const applySettings = () => {
    props.onSignalingUrl(signalingUrl);
    props.onSignalingKey(signalingKey);
    props.onRoomId(roomId);
    setVisible(false);
  };

  return (
    <Modal
      onDismiss={closeModal}
      visible={visible}
      closeAriaLabel="閉じる"
      footer={
        <>
          <SpaceBetween direction="vertical" size="m">
            <InputEntry
              title='シグナリングURL'
              initValue={signalingUrl}
              onChange={setSignalingUrl}
            />
            <InputEntry
              title='シグナリングキー'
              initValue={signalingKey}
              onChange={setSignalingkey}
            />
            <InputEntry
              title='ルームID'
              initValue={roomId}
              onChange={setRoomId}
            />
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <Button
                  variant="link"
                  onClick={closeModal}
                >キャンセル</Button>
                <Button
                  variant="primary"
                  onClick={applySettings}
                >適用</Button>
              </SpaceBetween>
            </Box>
          </SpaceBetween>
        </>
      }
      header="シグナリング設定"
    ></Modal>
  );
};

export default SignalingModal;
