import React, { useEffect } from 'react';
import * as AyameWebSdk from '@open-ayame/ayame-web-sdk';

export type Props = {
  signalingUrl: string;
  signalingKey: string;
  roomId: string;
}

// 参考にしました:
// OpenAyame/ayame-web-sdkのサンプル
// https://github.com/OpenAyame/ayame-web-sdk#%E5%8F%8C%E6%96%B9%E5%90%91%E9%80%81%E5%8F%97%E4%BF%A1%E6%8E%A5%E7%B6%9A%E3%81%99%E3%82%8B
// 非同期通信を用いたvideoエレメントの埋め込み (useEffect)
// https://qiita.com/sotabkw/items/028800170aa17789b26e
const Ayame = (props: Props) => {
  const streamRef = React.useRef<HTMLVideoElement>(null);
  const [serialDataChannel, setSerialDataChannel] = React.useState<RTCDataChannel | null>(null);
  const [servoDataChannel, setServoDataChannel] = React.useState<RTCDataChannel | null>(null);
  const [serialBody, setSerialBody] = React.useState<any>(null);

  useEffect(() => {
    (async () => {
      const conn = AyameWebSdk.connection(props.signalingUrl, props.roomId, Object.assign(AyameWebSdk.defaultOptions, { signalingKey: props.signalingKey }));
      conn.on('open', async (e: any) => {
        const serial = await conn.createDataChannel('serial');
        const servo = await conn.createDataChannel('servo');

        if (serial != null) {
          serial!.onmessage = (e) => {
            console.log(e);
          };
          setSerialDataChannel(serial);
        }

        if (servo != null) {
          setServoDataChannel(servo);
        }
      });
      conn.on('disconnect', (e: any) => {
        streamRef.current!.srcObject = null;
      });
      conn.on('addstream', async (e: any) => {
        streamRef.current!.srcObject = e.stream;
        await streamRef.current!.play();
      });

      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      conn.connect(mediaStream);
    })();
  }, []);

  return (
    <div className='Ayame'>
      <video
        ref={streamRef}
        autoPlay
        playsInline
      />
    </div>
  );
};
export default Ayame;
