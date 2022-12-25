import React, { useEffect } from 'react';
import AyameWebSdk from '@open-ayame/ayame-web-sdk';

export type Props = {
    signalingKey: string;
    roomId: string;
}

// 参考にしました:
// OpenAyame/ayame-web-sdkのサンプル
// https://github.com/OpenAyame/ayame-web-sdk#%E5%8F%8C%E6%96%B9%E5%90%91%E9%80%81%E5%8F%97%E4%BF%A1%E6%8E%A5%E7%B6%9A%E3%81%99%E3%82%8B
// 非同期通信を用いた描画
// https://qiita.com/apollo_program/items/01fa3c4621155f64f930
// videoタグにMediaStreamオブジェクトを渡す
// https://zenn.dev/k_takahashi23/scraps/38f5d59c37445c
const Ayame = (props: Props) => {
    const [streamState, setStreamState] = React.useState(null);
    useEffect(() => {
        (async () => {
            const conn = AyameWebSdk.connection('wss://ayame-labo.shiguredo.app/signaling', props.roomId, Object.assign(AyameWebSdk.defaultOptions, { signalingKey: props.signalingKey }));
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
            await conn.connect(mediaStream);
            conn.on('disconnect', console.log);
            conn.on('addstream', (e: any) => {
                setStreamState(e.stream);
            });
        })();
    }, []);

    return (
        <div className='Ayame'>
            <video
                ref={streamState}
                autoPlay
                muted
                playsInline
            />
        </div>
    );
};
export default Ayame;
