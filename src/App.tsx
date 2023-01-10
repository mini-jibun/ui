import React from 'react'
import { useSearchParams } from "react-router-dom";
import { ButtonDropdownProps } from '@cloudscape-design/components';
import { Header } from './components/header';
import { Modal } from './components/modal/modal';
import Minime from './components/minime';
import { defaultSetting, defaultVisible } from './components/types';
import './App.css'

const App = () => {
  const [searchParams, _] = useSearchParams();

  const [setting, setSetting] = React.useState({
    ...defaultSetting,
    signalingKey: searchParams.get('signalingKey') || '',
    roomId: searchParams.get('roomId') || ''
  });

  const [modalVisible, setModalVisible] = React.useState({
    ...defaultVisible,
    signaling: setting.signalingKey === '' || setting.roomId === ''
  });

  const onDropdownMenuItem = (detail: ButtonDropdownProps.ItemClickDetails) => {
    if (Object.keys(defaultVisible).includes(detail.id)) {
      setModalVisible({ ...modalVisible, [detail.id]: true });
    }
  };

  return (
    <div className="App">
      <Header
        setting={setting}
        onDropdownMenuItem={onDropdownMenuItem}
      />
      <Modal
        visible={modalVisible}
        setVisible={setModalVisible}
        setting={setting}
        setSetting={setSetting}
      />
      <Minime
        ready={setting.signalingKey !== '' && setting.roomId !== ''}
        onFailed={() => setModalVisible({ ...modalVisible, signaling: true })}
        setting={setting}
      />
    </div>
  );
};

export default App;
