import React from 'react';
import * as Ayame from '@open-ayame/ayame-web-sdk';
import { Joystick, JoystickShape } from 'react-joystick-component';
import { useGamepads } from 'react-gamepads';
import './MiniMe.css';

export interface Props {
  isReady: boolean;

  distanceBetweenWheels: number;
  stickyCameraJoyStick: boolean;
  thresholdAlertSensor: number;

  // 接続情報
  signalingUrl: string;
  signalingKey: string;
  roomId: string;

  // 接続時のコールバック
  onFailed: () => void;
  onMessage: (data: string) => void;
}

interface AyameDisconnectEvent { reason: string }
interface AyameOpenEvent { authzMetaData: any }
type AyameRTCTrackEvent = { stream: MediaStream } & RTCTrackEvent;

const MiniMe = (props: Props) => {
  const streamRef = React.useRef<HTMLVideoElement | null>(null);
  const isConnectingRef = React.useRef<boolean>(false);
  const [serial, setSerial] = React.useState<RTCDataChannel | null>(null);
  const [servo, setServo] = React.useState<RTCDataChannel | null>(null);
  const [gamepads, setGamepads] = React.useState<any>({});
  useGamepads((pads) => setGamepads(pads));

  // https://www.arduino.cc/reference/en/language/functions/math/map/
  const map = (value: number, in_min: number, in_max: number, out_min: number, out_max: number) => Math.trunc((value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);

  const onSerialJoyStick = (x: number, y: number) => {
    if (serial === null || serial.readyState !== 'open') return;

    const d = props.distanceBetweenWheels / 2; // 車輪間の距離を2で割った値
    const velocity = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    const radian = Math.acos(x / velocity);
    const _left = isNaN(radian) ? 0 : Math.sign(y) * (velocity + d * (Math.PI / 2 - radian));
    const _right = isNaN(radian) ? 0 : Math.sign(y) * (velocity - d * (Math.PI / 2 - radian));

    const max = 100 + d * Math.PI / 2;

    const left = map(_left, -max, max, -255, 255);
    const right = map(_right, -max, max, -255, 255);

    serial.send(new TextEncoder().encode(`${left},${right}$`));
  };

  const onServoJoyStick = (x: number, y: number) => {
    if (servo === null || servo.readyState !== 'open') return;

    const roll = 180 - map(y, -100, 100, 0, 180);
    const pitch = 180 - map(x, -100, 100, 0, 180);

    servo.send(new TextEncoder().encode(`${roll},${pitch}`));
  };

  React.useEffect(() => {
    if (gamepads[0] === undefined) return;
    if (gamepads[0].axes == undefined) return;

    const axes = {
      left: {
        x: Math.trunc(gamepads[0].axes[0] * 100),
        y: -Math.trunc(gamepads[0].axes[1] * 100)
      },
      right: {
        x: Math.trunc(gamepads[0].axes[2] * 100),
        y: -Math.trunc(gamepads[0].axes[3] * 100)
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

  React.useEffect(() => {
    (async () => {
      if (!props.isReady || isConnectingRef.current) return;
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
        <Joystick size={125} throttle={50} move={({ x, y }) => { onSerialJoyStick(x! * 100, y! * 100) }} stop={({ x, y }) => { onSerialJoyStick(x! * 100, y! * 100) }} />
      </div>
      <div className='ServoJoyStick'>
        <Joystick sticky={props.stickyCameraJoyStick} controlPlaneShape={JoystickShape.Square} size={125} throttle={50} move={({ x, y }) => { onServoJoyStick(x! * 100, y! * 100) }} stop={props.stickyCameraJoyStick ? () => { } : ({ x, y }) => { onServoJoyStick(x! * 100, y! * 100) }} />
      </div>
    </div>
  );
};
export default MiniMe;
