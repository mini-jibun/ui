import { Modal, Box, Button, SpaceBetween } from '@cloudscape-design/components';
import licenses from '../assets/licenses.txt?raw';

export interface LicensesModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const LicensesModal = (props: LicensesModalProps) => {
  const close = () => {
    props.setVisible(false);
  };

  return (
    <Modal
      onDismiss={close}
      visible={props.visible}
      closeAriaLabel="閉じる"
      footer={
        <div style={{ whiteSpace: 'pre-wrap' }}>
          <SpaceBetween direction="vertical" size="m">
            {licenses}
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <Button
                  variant="primary"
                  onClick={close}
                >閉じる</Button>
              </SpaceBetween>
            </Box>
          </SpaceBetween>
        </div>
      }
      header="ライセンス情報"
    />
  );
};

export default LicensesModal;
