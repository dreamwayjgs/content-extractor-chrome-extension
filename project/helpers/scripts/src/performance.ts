type Top = number
type Left = number
type Coord = [Left, Top]

const A: Coord[] = []
const B: Coord[] = []

const TL = 1000000

for (let i = 0; i < TL; i++) {
  const r = getRandomInt(0, 5)
  A.push([i, 100])
  B.push([i + 100, 100])
}

console.time("subtract")

for (let i = 0; i < TL; i++) {
  const aa = Math.abs(A[i][0] - B[i][0])
  console.assert(aa > 0, "hoho")
}

console.timeEnd("subtract")

console.time("dist")

for (let i = 0; i < TL; i++) {
  const aa = distanceBetweenCoords(A[i], B[i])
  console.assert(aa > 0, "hoho")
}

console.timeEnd("dist")

console.time("dist2")

for (let i = 0; i < TL; i++) {
  const aa = distanceBetweenCoords2(A[i], B[i])
  console.assert(aa > 0, "hoho")
}

console.timeEnd("dist2")

console.log(A[0], B[0])
console.log(Math.abs(A[0][0] - B[0][0]), distanceBetweenCoords(A[0], B[0]))

function distanceBetweenCoords(A: Coord, B: Coord) {
  const disX = A[0] - B[0]
  const disY = A[1] - B[1]
  return Math.sqrt(Math.abs(disX * disX) + Math.abs(disY * disY));
}

function distanceBetweenCoords2(A: Coord, B: Coord) {
  if (A[0] === B[0]) {
    // console.log("선분!", Math.abs(A[1] - B[1]))
    return Math.abs(A[1] - B[1]);
  }
  if (A[1] === B[1]) {
    // console.log("선분!", Math.abs(A[0] - B[0]))
    return Math.abs(A[0] - B[0]);
  }
  const disX = A[0] - B[0]
  const disY = A[1] - B[1]
  return Math.sqrt(Math.abs(disX * disX) + Math.abs(disY * disY));
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}