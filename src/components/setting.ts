const defaultSetting = {
    // Ayame LaboのシグナリングURL
    signalingUrl: 'wss://ayame-labo.shiguredo.app/signaling',
    // Ayame Laboのシグナリングキー
    signalingKey: '',
    // Ayame LaboのルームID
    roomId: '',
    // 本体の車輪間の距離[mm]
    wheelDistance: 95,
    // カメラ角度を維持するかどうか
    cameraAngleSticky: true,
    // アラートを出すセンサしきい値
    sensorAlertThreshold: 10
};

export type Setting = typeof defaultSetting;
export type SettingState = React.Dispatch<React.SetStateAction<Setting>>;

export { defaultSetting };
