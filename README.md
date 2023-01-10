# mini-me control ui

mini-me 画面

## Requirements

node: `19.3.0`

npm: `9.2.0`

```bash
npm install -g yarn
```

## Setup
```bash
git clone git@github.com:mini-jibun/ui
cd ui
yarn
```

## References

|種別|URL|
|:-|:-|
|ビルドツール|[Vite.js](https://ja.vitejs.dev/guide/)|
|状態管理|[React Router](https://reactrouter.com/en/main/start/tutorial)|
|コンポーネント|[Cloudscape Design](https://cloudscape.design/)|
|Joystickコンポーネント|[react-joystick-component](https://github.com/elmarti/react-joystick-component)|
|Gamepad API Reactラッパー|[react-gamepads](https://github.com/whoisryosuke/react-gamepads)|

cloudscape-design
  - [TopNavigation](https://cloudscape.design/components/top-navigation/?tabId=playground)
  - [Modal](https://cloudscape.design/components/modal/?tabId=playground)

クエリパラメータからキーに対応した値を取得
  - https://reactrouter.com/en/main/hooks/use-search-params

Ayame
  - ソースコードでコールバック関数を呼ぶ箇所
    - https://github.com/OpenAyame/ayame-web-sdk/blob/develop/src/connection/base.ts
  - TypeScriptで交差型を定義する
    - https://js.studio-kingdom.com/typescript/handbook/advanced_types
  - OpenAyame/ayame-web-sdkのサンプル
    - https://github.com/OpenAyame/ayame-web-sdk#%E5%8F%8C%E6%96%B9%E5%90%91%E9%80%81%E5%8F%97%E4%BF%A1%E6%8E%A5%E7%B6%9A%E3%81%99%E3%82%8B
  - ビデオをウインドウ幅でセンタリング
    - https://localhost8888.net/css/260/

useEffectを用いて非同期通信後にvideoエレメントに埋め込む
  - https://qiita.com/sotabkw/items/028800170aa17789b26e
  - https://b.0218.jp/202207202243.html

特定の値の範囲にマップする
  - https://www.arduino.cc/reference/en/language/functions/math/map/

車輪の角度制御
  - https://www.mech.tohoku-gakuin.ac.jp/rde/contents/course/robotics/wheelrobot.html

TypeScript
 - https://typescriptbook.jp/tips/generates-type-from-object-key

その他MDNなど
 - 全画面モード
  - https://developer.mozilla.org/ja/docs/Web/API/Fullscreen_API#%E5%85%A8%E7%94%BB%E9%9D%A2%E3%83%A2%E3%83%BC%E3%83%89%E3%81%AE%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88
