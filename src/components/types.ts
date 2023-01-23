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
    // 落下防止停止を有効にするかどうか
    safety: true
};

export type Setting = typeof defaultSetting;
export type SettingState = React.Dispatch<React.SetStateAction<Setting>>;

const defaultVisible = {
    signaling: false,
    controlling: false,
    license: false
};

export type TopNavigationVisible = typeof defaultVisible;
export type TopNavigationVisibleState = React.Dispatch<React.SetStateAction<TopNavigationVisible>>;

export { defaultSetting, defaultVisible };
