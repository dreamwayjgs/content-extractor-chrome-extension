export function timestampedLog(...args: any[]) {
  console.log(new Date().toISOString(), ...args)
}