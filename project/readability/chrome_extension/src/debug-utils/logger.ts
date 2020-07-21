export function timestampedLog(...args: any[]) {
  console.log(new Date().toISOString(), ...args)
}

export function timestampedAssert(condition: boolean, ...args: any[]) {
  console.assert(condition, new Date().toISOString(), ...args)
}