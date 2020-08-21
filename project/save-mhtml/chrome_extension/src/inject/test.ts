import TestBoundary from './overlay/boundary-test'

export function runTest() {
  console.log("Run TEST")
  const testBoundary = new TestBoundary()
  testBoundary.testHeron([300, 150])
  testBoundary.testHeron([300, 180])
  testBoundary.testHeron([150, 150])
  testBoundary.testHeron([180, 190])
  testBoundary.testHeron([340, 330])
}
