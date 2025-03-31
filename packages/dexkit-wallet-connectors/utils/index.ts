import { EventEmitter } from "events";

export function waitForEvent<T>(
  emitter: EventEmitter,
  event: string,
  rejectEvent: string
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    emitter.once(event, (args) => {
      resolve(args);
    });
    emitter.once(rejectEvent, () => reject("rejected by the user"));
    emitter.once("error", reject);
  });
}

/**
 * Returns true if the string is a RFC2397-compliant data URI
 * @see {@link https://www.rfc-editor.org/rfc/rfc2397}
 */
export default function isDataURI(uri: string): boolean {
  return /^data:(image\/[-+\w.]+)(;?\w+=[-\w]+)*(;base64)?,.*/.test(uri);
}
