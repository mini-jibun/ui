import React from 'react';
import * as Ayame from '@open-ayame/ayame-web-sdk';
import { Joystick, JoystickShape } from 'react-joystick-component';
import { useGamepads } from 'react-gamepads';
import { AlertObjs, Alert, AlertType } from './alert';
import { roundCircle, toCameraAngle, toWheelDuty } from '../lib/coord';
import { Setting } from './types';

export interface Props {
  ready: boolean;
  setting: Setting;
  onFailed: () => void;
  onMessage: (data: string) => void;
}

const Minime = (props: Props) => {
  const [alertObjs, setAlertObjs] = React.useState<AlertObjs>([]);
  const alert = (type: AlertType, title: string, content: string) => {
    setAlertObjs([...alertObjs, { key: Date.now().toString(), title, content, type }]);
  }

  const alertClearIntervalRef = React.useRef(0);
  const streamRef = React.useRef<HTMLVideoElement | null>(null);
  const isConnectingRef = React.useRef<boolean>(false);
  const [serial, setSerial] = React.useState<RTCDataChannel | null>(null);
  const [servo, setServo] = React.useState<RTCDataChannel | null>(null);

  const sendWheel = (left: number, right: number) => {
    if (serial?.readyState !== 'open') return;
    serial?.send(new TextEncoder().encode(`${left},${right}$`));
  };
  const sendCameraAngle = (roll: number, pitch: number) => {
    if (servo?.readyState !== 'open') return;
    servo?.send(new TextEncoder().encode(`${roll},${pitch}`));
  };

  const serialMessageCallback = (e: MessageEvent) => {
    const sensors = new TextDecoder().decode(e.data).split(',');
    const sensorArrange = ['前', '左', '右', '後'];
    sensors.map((str) => parseInt(str)).map((sensor: number, index: number) => {
      if (sensor <= props.setting.sensorAlertThreshold) alert('warning', `${sensorArrange[index]}の落下防止センサーが反応しています`, `安全な方向に移動してください`);
    });
  };

  useGamepads((pads) => {
    // gamepad
    if (pads[0] === undefined || pads[0].axes === undefined) return;
    const axis = pads[0].axes.map((ax: number) => Math.trunc(ax * 100));

    const { x, y } = roundCircle(axis[0], -axis[1]); // x, y
    const { left, right } = toWheelDuty(props.setting.wheelDistance, x, y, 255);
    sendWheel(left, right);
    const { roll, pitch } = toCameraAngle(axis[2], -axis[3]); // x, y
    sendCameraAngle(roll, pitch);
  });

  React.useEffect(() => {
    if (alertClearIntervalRef.current !== 0) return;
    alertClearIntervalRef.current = setInterval(() => {
      setAlertObjs((objs: AlertObjs) => {
        console.log('alertClear', objs);
        return objs.slice(1);
      });
    }, 5000);
  }, []);

  React.useEffect(() => {
    (async () => {
      if (!props.ready) {
        alert('warning', '接続設定を行ってください', '');
        return;
      }
      if (isConnectingRef.current) return;
      isConnectingRef.current = true;
      try {
        const opt = { ...Ayame.defaultOptions, signalingKey: props.setting.signalingKey };
        const conn = Ayame.connection(props.setting.signalingUrl, props.setting.roomId, opt);

        conn.on('open', async () => {
          let channel = null;
          channel = await conn.createDataChannel('serial')
          if (channel !== null) {
            channel.onmessage = serialMessageCallback;
            setSerial(channel);
          }
          channel = await conn.createDataChannel('servo');
          if (channel !== null) setServo(channel);
          alert('success', 'シグナリングサーバと接続しました', '');
          console.log('opened!');
        });
        conn.on('datachannel', (channel: RTCDataChannel) => {
          if (channel.label === 'serial') {
            channel.onmessage = serialMessageCallback;
            setSerial(channel);
          }
          if (channel.label === 'servo') setServo(channel);
        });
        conn.on('addstream', async (e: { stream: MediaStream } & RTCTrackEvent) => {
          streamRef.current!.srcObject = e.stream;
          alert('success', 'mini-meと接続しました', '');
          console.log('stream is added!');
        });
        conn.on('disconnect', (e: { reason: string }) => {
          isConnectingRef.current = false;
          streamRef.current!.srcObject = null;
          alert('warning', 'mini-meから切断されました', '再接続するには､左上のアイコンをクリックしてください');
          console.log('disconnected!', e.reason);
        });

        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        await conn.connect(mediaStream);
      } catch (e) {
        isConnectingRef.current = false;
        alert('error', 'シグナリングサーバへの接続に失敗しました', '');
        props.onFailed();
        throw e;
      }
    })();
  }, [props.setting.signalingUrl, props.setting.signalingKey, props.setting.roomId]);

  const onWheelJoystick = (x: number | null, y: number | null) => {
    if (x === null || y === null) return;
    const { left, right } = toWheelDuty(props.setting.wheelDistance, x * 100, y * 100, 255);
    sendWheel(left, right);
  };
  const onCameraJoystick = (x: number | null, y: number | null) => {
    if (x === null || y === null) return;
    const { roll, pitch } = toCameraAngle(x * 100, y * 100);
    sendCameraAngle(roll, pitch);
  };

  return (
    <div className='MinimeConnection'>
      <video
        ref={streamRef}
        autoPlay
        playsInline
      />
      <div className='WheelJoystick'>
        <Joystick size={125} throttle={50} move={({ x, y }) => onWheelJoystick(x, y)} stop={() => onWheelJoystick(0, 0)} />
      </div>
      <div className='CameraJoystick'>
        <Joystick sticky={props.setting.cameraAngleSticky} controlPlaneShape={JoystickShape.Square} size={125} throttle={50} move={({ x, y }) => onCameraJoystick(x, y)} stop={props.setting.cameraAngleSticky ? () => { } : () => onCameraJoystick(0, 0)} />
      </div>
      <div className='MinimeAlert'>
        <Alert
          objs={alertObjs}
        />
      </div>
    </div >
  );
};
export default Minime;