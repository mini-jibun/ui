import React from 'react';
import * as Ayame from '@open-ayame/ayame-web-sdk';
import { Joystick } from 'react-joystick-component';
import { useGamepads } from 'react-gamepads';
import './MiniMe.css';

export interface Props {
  ready: boolean;
  signalingUrl: string;
  signalingKey: string;
  roomId: string;
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
  const isConnectingRef = React.useRef<boolean>(false);
  const [serial, setSerial] = React.useState<RTCDataChannel | null>(null);
  const [servo, setServo] = React.useState<RTCDataChannel | null>(null);
  const [gamepads, setGamepads] = React.useState<any>({});
  useGamepads((pads) => setGamepads(pads));

  // 参考にしました:
  // 特定の範囲を特定の範囲に変換する処理
  // https://www.arduino.cc/reference/en/language/functions/math/map/
  const map = (value: number, in_min: number, in_max: number, out_min: number, out_max: number) => Math.trunc((value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);

  const onSerialJoyStick = (x: number, y: number) => {
    if (serial === null) return;

    // 参考にしました:
    // 2輪ロボットの数学的モデル
    // https://www.mech.tohoku-gakuin.ac.jp/rde/contents/course/robotics/wheelrobot.html
    const d = 47.5; // 車輪間の距離を2で割った値
    const velocity = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    const radian = Math.acos(x / velocity);
    const _left = isNaN(radian) ? 0 : Math.sign(y) * (velocity + d * (Math.PI / 2 - radian));
    const _right = isNaN(radian) ? 0 : Math.sign(y) * (velocity - d * (Math.PI / 2 - radian));

    const left = map(_left, -180, 180, -255, 255);
    const right = map(_right, -180, 180, -255, 255);

    serial.send(new TextEncoder().encode(`${left},${right}$`));
  };

  const onServoJoyStick = (_x: number, _y: number) => {
    if (servo === null) return;

    const x = map(_x, -100, 100, 0, 180);
    const y = map(_y, -100, 100, 0, 180);

    servo.send(new TextEncoder().encode(`${x},${y}`));
  };


  // 参考にしました:
  // https://github.com/whoisryosuke/react-gamepads
  React.useEffect(() => {
    if (gamepads[0] === undefined) return;
    if (gamepads[0].axes == undefined) return;

    const axes = {
      left: {
        x: Math.trunc(gamepads[0].axes[0] * 100),
        y: Math.trunc(gamepads[0].axes[1] * 100)
      },
      right: {
        x: Math.trunc(gamepads[0].axes[2] * 100),
        y: Math.trunc(gamepads[0].axes[3] * 100)
      }
    };

    if (serial !== null) {
      const slope = axes.left.y / axes.left.x;
      const xMax = Math.sqrt(10000 / (Math.pow(slope, 2) + 1));
      const yMax = Math.sqrt((10000 * Math.pow(slope, 2)) / (Math.pow(slope, 2) + 1));
      const x = isNaN(xMax) ? axes.left.x : Math.sign(axes.left.x) * Math.min(Math.abs(axes.left.x), xMax);
      const y = isNaN(yMax) ? axes.left.y : Math.sign(axes.left.y) * Math.min(Math.abs(axes.left.y), yMax);
      onSerialJoyStick(x, y);
    }

    if (servo !== null) {
      onServoJoyStick(axes.right.x, axes.right.y);
    }
  }, [gamepads[0]]);

  // 参考にしました:
  // useEffectが2回実行される対策
  // https://b.0218.jp/202207202243.html
  React.useEffect(() => {
    (async () => {
      if (!props.ready || isConnectingRef.current) return;
      isConnectingRef.current = true;
      try {
        const opt = Object.assign(Ayame.defaultOptions, { signalingKey: props.signalingKey });
        const conn = Ayame.connection(props.signalingUrl, props.roomId, opt);

        conn.on('open', async (e: AyameOpenEvent) => {
          setSerial(await conn.createDataChannel('serial'));
          setServo(await conn.createDataChannel('servo'));
          console.log('opened!');
        });
        conn.on('addstream', async (e: AyameRTCTrackEvent) => {
          streamRef.current!.srcObject = e.stream;
          await streamRef.current!.play();
          console.log('stream is added!');
        });
        conn.on('disconnect', (e: AyameDisconnectEvent) => {
          isConnectingRef.current = false;
          console.log('disconnected!');
        });

        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        await conn.connect(mediaStream);
      } catch (e) {
        isConnectingRef.current = false;
        props.onFailed();
        throw e;
      }
    })();
  }, [props]);

  return (
    <div className='MiniMeConnection'>
      <video
        ref={streamRef}
        autoPlay
        playsInline
      />
      <div className='SerialJoyStick'>
        <Joystick size={125} move={({ x, y }) => { onSerialJoyStick(x! * 100, y! * 100) }} stop={({ x, y }) => { onSerialJoyStick(x! * 100, y! * 100) }} />
      </div>
      <div className='ServoJoyStick'>
        <Joystick size={125} move={({ x, y }) => { onServoJoyStick(x! * 100, y! * 100) }} stop={({ x, y }) => { onServoJoyStick(x! * 100, y! * 100) }} />
      </div>
    </div>
  );
};
export default MiniMe;
