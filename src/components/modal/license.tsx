import React from 'react';
import { Modal, Box, Button, SpaceBetween } from '@cloudscape-design/components';
import licenses from '../../assets/licenses.txt';

export interface LicenseProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const License = (props: LicenseProps) => {
  const [content, setContent] = React.useState('');

  const close = () => {
    props.setVisible(false);
  };

  fetch(licenses).then((response) => response.text()).then((text) => {
    setContent(text);
  });

  return (
    <Modal
      onDismiss={close}
      visible={props.visible}
      closeAriaLabel="閉じる"
      header="ライセンス情報"
      size="large"
      id="License"
      footer={
        <SpaceBetween direction="vertical" size="m">
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="primary"
                onClick={close}
              >閉じる</Button>
            </SpaceBetween>
          </Box>
        </SpaceBetween>
      }
    >
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {content}
      </div>
    </Modal>
  );
};

export default License;
