// Allow the shell to render while the network adapter starts. Requests still
// pass through Axios/MSW; none can escape to the static host before it is ready.
let readiness: Promise<unknown> = Promise.resolve();
export function setApiReadiness(promise: Promise<unknown>) {
  readiness = promise;
}
export function waitForApi() {
  return readiness;
}
