// https://www.arduino.cc/reference/en/language/functions/math/map/
const radius = 100;

const map = (value: number, in_min: number, in_max: number, out_min: number, out_max: number) => Math.trunc((value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);

const toWheelDuty = (wheelDistance: number, x: number, y: number, duty_max: number) => {
  const d = wheelDistance / 2; // 車輪間の距離を2で割った値
  const velocity = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  const radian = Math.acos(x / velocity);
  const _left = isNaN(radian) ? 0 : Math.sign(y) * (velocity + d * (Math.PI / 2 - radian));
  const _right = isNaN(radian) ? 0 : Math.sign(y) * (velocity - d * (Math.PI / 2 - radian));

  const coord_max = radius + d * Math.PI / 2;

  const left = map(_left, -coord_max, coord_max, -duty_max, duty_max);
  const right = map(_right, -coord_max, coord_max, -duty_max, duty_max);

  return { left, right };
};

const toCameraAngle = (x: number, y: number) => {
  const roll = 180 - map(y, -radius, radius, 0, 180);
  const pitch = 180 - map(x, -radius, radius, 0, 180);

  return { roll, pitch };
};

const roundCircle = (x: number, y: number) => {
  const slope = y / x;
  const maxX = Math.sqrt(Math.pow(radius + slope, 2) / (Math.pow(slope, 2) + 1));
  const maxY = Math.sqrt(Math.pow(radius + slope, 2) / (Math.pow(slope, 2) + 1));
  const roundX = isNaN(maxX) ? x : Math.sign(x) * Math.min(Math.abs(x), maxX);
  const roundY = isNaN(maxY) ? y : Math.sign(y) * Math.min(Math.abs(y), maxY);

  return { x: roundX, y: roundY };
};

export { toWheelDuty, toCameraAngle, roundCircle };
