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
      header="ライセンス情報"
      size="large"
      id="LicensesModal"
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
        {licenses}
      </div>
    </Modal>
  );
};

export default LicensesModal;
