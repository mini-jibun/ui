import React from 'react';
import { Joystick } from 'react-joystick-component';
import * as Ayame from '@open-ayame/ayame-web-sdk';
import './MiniMe.css';
import { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick';

export type Props = {
  ready: boolean;
  signalingUrl: string;
  signalingKey: string;
  roomId: string;
  onConnected: () => void;
  onFailed: () => void;
  onMessage: (data: string) => void;
}

// 参考にしました:
// コールバック関数の引数の型(this._callbacks.*を呼び出す箇所)
// https://github.com/OpenAyame/ayame-web-sdk/blob/develop/src/connection/base.ts
// TypeScriptで交差型を定義する方法
// https://js.studio-kingdom.com/typescript/handbook/advanced_types
type AyameDisconnectEvent = { reason: string };
type AyameOpenEvent = { authzMetaData: any };
type AyameRTCTrackEvent = { stream: MediaStream } & RTCTrackEvent;

// 参考にしました:
// OpenAyame/ayame-web-sdkのサンプル
// https://github.com/OpenAyame/ayame-web-sdk#%E5%8F%8C%E6%96%B9%E5%90%91%E9%80%81%E5%8F%97%E4%BF%A1%E6%8E%A5%E7%B6%9A%E3%81%99%E3%82%8B
// 非同期通信を用いたvideoエレメントの埋め込み (useEffect)
// https://qiita.com/sotabkw/items/028800170aa17789b26e
const MiniMe = (props: Props) => {
  const streamRef = React.useRef<HTMLVideoElement>(null);
  const [serialDataChannel, setSerialDataChannel] = React.useState<RTCDataChannel | null>(null);
  const [servoDataChannel, setServoDataChannel] = React.useState<RTCDataChannel | null>(null);

  // 参考にしました:
  // 特定の範囲を特定の範囲に変換する処理
  // https://www.arduino.cc/reference/en/language/functions/math/map/
  const map = (value: number, in_min: number, in_max: number, out_min: number, out_max: number) => Math.trunc((value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);


  const onSerialJoyStick = (event: IJoystickUpdateEvent) => {
    if (serialDataChannel === null) return;

    // 参考にしました:
    // 2輪ロボットの数学的モデル
    // https://www.mech.tohoku-gakuin.ac.jp/rde/contents/course/robotics/wheelrobot.html
    const d = 47.5; // 車輪間の距離を2で割った値
    const x = event.x! * 100;
    const y = event.y! * 100;

    const velocity = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    const radian = Math.acos(x / velocity);
    const degree = radian * (180 / Math.PI);
    const dutyLeft = isNaN(radian) ? 0 : Math.sign(y) * (velocity + d * (Math.PI / 2 - radian));
    const dutyRight = isNaN(radian) ? 0 : Math.sign(y) * (velocity - d * (Math.PI / 2 - radian));

    const actualDutyLeft = map(dutyLeft, -180, 180, -255, 255);
    const actualDutyRight = map(dutyRight, -180, 180, -255, 255);

    console.log('serial: ', x, ',', y);
    console.log('serial(duty):', dutyLeft, ',', dutyRight);
    console.log('serial(actualDuty):', actualDutyLeft, ',', actualDutyRight);

    serialDataChannel.send(new TextEncoder().encode(`${actualDutyLeft},${actualDutyRight}$`));
  };

  const onServoJoyStick = (event: IJoystickUpdateEvent) => {
    if (servoDataChannel === null) return;

    const x = event.x! * 100;
    const y = event.y! * 100;

    const actualX = map(x, -180, 180, 0, 180);
    const actualY = map(y, -180, 180, 0, 180);

    console.log('servo: ', x, ',', y);
    console.log('servo(actual):', actualX, ',', actualY);

    servoDataChannel.send(new TextEncoder().encode(`${actualX},${actualY}`));
  };

  React.useEffect(() => {
    (async () => {
      if (!props.ready) return;
      try {
        const conn = Ayame.connection(props.signalingUrl, props.roomId, Object.assign(Ayame.defaultOptions, { signalingKey: props.signalingKey }));
        conn.on('open', async (e: AyameOpenEvent) => {
          const serial = await conn.createDataChannel('serial');
          const servo = await conn.createDataChannel('servo');

          if (serial != null) {
            setSerialDataChannel(serial);
          }
          if (servo != null) {
            setServoDataChannel(servo);
          }
        });
        conn.on('disconnect', (e: AyameDisconnectEvent) => {
          streamRef.current!.srcObject = null;
        });
        conn.on('addstream', async (e: AyameRTCTrackEvent) => {
          streamRef.current!.srcObject = e.stream;
          await streamRef.current!.play();
        });

        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        conn.connect(mediaStream);
        props.onConnected();
      } catch (_) {
        props.onFailed();
      }
    })();
  }, [props.ready]);

  return (
    <div className='MiniMeConnection'>
      <video
        ref={streamRef}
        autoPlay
        playsInline
      />
      <div className='SerialJoyStick'>
        <Joystick move={onSerialJoyStick} stop={onSerialJoyStick} />
      </div>
      <div className='ServoJoyStick'>
        <Joystick move={onServoJoyStick} stop={onServoJoyStick} />
      </div>
    </div>
  );
};
export default MiniMe;
