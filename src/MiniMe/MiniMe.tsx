import React from 'react';
import * as Ayame from '@open-ayame/ayame-web-sdk';
import Connection from '@open-ayame/ayame-web-sdk/dist/connection';
import { Joystick } from 'react-joystick-component';
import { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick';
import './MiniMe.css';

export interface Props {
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
interface AyameDisconnectEvent { reason: string }
interface AyameOpenEvent { authzMetaData: any }
type AyameRTCTrackEvent = { stream: MediaStream } & RTCTrackEvent;

// 参考にしました:
// OpenAyame/ayame-web-sdkのサンプル
// https://github.com/OpenAyame/ayame-web-sdk#%E5%8F%8C%E6%96%B9%E5%90%91%E9%80%81%E5%8F%97%E4%BF%A1%E6%8E%A5%E7%B6%9A%E3%81%99%E3%82%8B
// 非同期通信を用いたvideoエレメントの埋め込み (useEffect)
// https://qiita.com/sotabkw/items/028800170aa17789b26e
const MiniMe = (props: Props) => {
  const streamRef = React.useRef<HTMLVideoElement | null>(null);
  const connectionRef = React.useRef<Connection | null>(null);
  const serialDataChannelRef = React.useRef<RTCDataChannel | null>(null);
  const servoDataChannelRef = React.useRef<RTCDataChannel | null>(null);

  // 参考にしました:
  // 特定の範囲を特定の範囲に変換する処理
  // https://www.arduino.cc/reference/en/language/functions/math/map/
  const map = (value: number, in_min: number, in_max: number, out_min: number, out_max: number) => Math.trunc((value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);

  const onSerialJoyStick = (event: IJoystickUpdateEvent) => {
    if (serialDataChannelRef.current === null) return;

    // 参考にしました:
    // 2輪ロボットの数学的モデル
    // https://www.mech.tohoku-gakuin.ac.jp/rde/contents/course/robotics/wheelrobot.html
    const d = 47.5; // 車輪間の距離を2で割った値
    const x = event.x! * 100;
    const y = event.y! * 100;

    const velocity = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    const radian = Math.acos(x / velocity);
    const _left = isNaN(radian) ? 0 : Math.sign(y) * (velocity + d * (Math.PI / 2 - radian));
    const _right = isNaN(radian) ? 0 : Math.sign(y) * (velocity - d * (Math.PI / 2 - radian));

    const left = map(_left, -180, 180, -255, 255);
    const right = map(_right, -180, 180, -255, 255);

    serialDataChannelRef.current.send(new TextEncoder().encode(`${left},${right}$`));
  };

  const onServoJoyStick = (event: IJoystickUpdateEvent) => {
    if (servoDataChannelRef.current === null) return;

    const x = map(event.x! * 100, -100, 100, 0, 180);
    const y = map(event.y! * 100, -100, 100, 0, 180);

    servoDataChannelRef.current.send(new TextEncoder().encode(`${x},${y}`));
  };

  // 参考にしました:
  // useEffectが2回実行される対策
  // https://b.0218.jp/202207202243.html
  React.useEffect(() => {
    (async () => {
      if (!props.ready || connectionRef.current !== null) return;
      try {
        const opt = Object.assign(Ayame.defaultOptions, { signalingKey: props.signalingKey });
        connectionRef.current = Ayame.connection(props.signalingUrl, props.roomId, opt);

        connectionRef.current.on('open', async (e: AyameOpenEvent) => {
          serialDataChannelRef.current = await connectionRef.current!.createDataChannel('serial');
          servoDataChannelRef.current = await connectionRef.current!.createDataChannel('servo');
          console.log('opened!');
        });
        connectionRef.current.on('addstream', async (e: AyameRTCTrackEvent) => {
          streamRef.current!.srcObject = e.stream;
          await streamRef.current!.play();
          console.log('stream is added!');
        });
        connectionRef.current.on('disconnect', (e: AyameDisconnectEvent) => {
          streamRef.current!.srcObject = null;
          connectionRef.current = null;
          console.log('disconnected!');
        });

        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        connectionRef.current.connect(mediaStream);
        props.onConnected();
      } catch (e) {
        connectionRef.current = null;
        props.onFailed();
        throw e;
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
        <Joystick size={125} move={onSerialJoyStick} stop={onSerialJoyStick} />
      </div>
      <div className='ServoJoyStick'>
        <Joystick size={125} move={onServoJoyStick} stop={onServoJoyStick} />
      </div>
    </div>
  );
};
export default MiniMe;
