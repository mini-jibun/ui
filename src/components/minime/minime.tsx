import React from 'react';
import * as Ayame from '@open-ayame/ayame-web-sdk';
import { Joystick, JoystickShape } from 'react-joystick-component';
import { useGamepads } from 'react-gamepads';
import './minime.css';
import { roundCircle, toCameraAngle, toWheelDuty } from '../../lib/coord';

export interface Props {
  isReady: boolean;

  wheelDistance: number;
  stickyCameraJoystick: boolean;
  thresholdAlertSensor: number;

  // 接続情報
  signalingUrl: string;
  signalingKey: string;
  roomId: string;

  // 接続時のコールバック
  onFailed: () => void;
  onMessage: (data: string) => void;
}

const Minime = (props: Props) => {
  const streamRef = React.useRef<HTMLVideoElement | null>(null);
  const isConnectingRef = React.useRef<boolean>(false);
  const [serial, setSerial] = React.useState<RTCDataChannel | null>(null);
  const [servo, setServo] = React.useState<RTCDataChannel | null>(null);
  const [gamepads, setGamepads] = React.useState<any>({});
  useGamepads((pads) => setGamepads(pads));

  const sendWheel = (left: number, right: number) => {
    if (serial?.readyState !== 'open') return;
    console.log(left, right);
    serial?.send(new TextEncoder().encode(`${left},${right}$`));
  };
  const onWheelJoystick = (x: number | null, y: number | null) => {
    if (x === null || y === null) return;
    const { left, right } = toWheelDuty(props.wheelDistance, x * 100, y * 100, 255);
    sendWheel(left, right);
  };

  const sendCameraAngle = (roll: number, pitch: number) => {
    if (servo?.readyState !== 'open') return;
    console.log(roll, pitch);
    servo?.send(new TextEncoder().encode(`${roll},${pitch}`));
  };
  const onCameraJoystick = (x: number | null, y: number | null) => {
    if (x === null || y === null) return;
    const { roll, pitch } = toCameraAngle(x * 100, y * 100);
    sendCameraAngle(roll, pitch);
  };

  React.useEffect(() => {
    (async () => {
      if (!props.isReady || isConnectingRef.current) return;
      isConnectingRef.current = true;
      try {
        let gamepadInterval = 0;
        const opt = Object.assign(Ayame.defaultOptions, { signalingKey: props.signalingKey });
        const conn = Ayame.connection(props.signalingUrl, props.roomId, opt);

        conn.on('open', async () => {
          setSerial(await conn.createDataChannel('serial'));
          setServo(await conn.createDataChannel('servo'));
          console.log('opened!');

          // gamepad
          gamepadInterval = setInterval(() => {
            if (gamepads[0] === undefined || gamepads[0].axes === undefined) return;
            const axis = gamepads[0].axes.map((ax: number) => Math.trunc(ax * 100));

            const { x, y } = roundCircle(axis[0], -axis[1]); // x, y
            const { left, right } = toWheelDuty(props.wheelDistance, x * 100, y * 100, 255);
            sendWheel(left, right);
            const { roll, pitch } = toCameraAngle(axis[2], -axis[3]); // x, y
            sendCameraAngle(roll, pitch);
          }, 50);
        });
        conn.on('addstream', async (e: { stream: MediaStream } & RTCTrackEvent) => {
          streamRef.current!.srcObject = e.stream;
          await streamRef.current!.play();
          console.log('stream is added!');
        });
        conn.on('disconnect', (e: { reason: string }) => {
          isConnectingRef.current = false;
          if (gamepadInterval !== 0) clearInterval(gamepadInterval);
          console.log('disconnected!', e.reason);
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
    <div className='MinimeConnection'>
      <video
        ref={streamRef}
        autoPlay
        playsInline
      />
      <div className='WheelJoystick'>
        <Joystick size={125} throttle={50} move={({ x, y }) => { onWheelJoystick(x, y) }} stop={() => { onWheelJoystick(0, 0) }} />
      </div>
      <div className='CameraJoystick'>
        <Joystick sticky={props.stickyCameraJoystick} controlPlaneShape={JoystickShape.Square} size={125} throttle={50} move={({ x, y }) => { onCameraJoystick(x, y) }} stop={props.stickyCameraJoystick ? () => { } : () => { onCameraJoystick(0, 0) }} />
      </div>
    </div>
  );
};
export default Minime;
