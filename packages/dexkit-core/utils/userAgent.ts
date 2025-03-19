import { UAParser } from "ua-parser-js";

let deviceType;
let windowParser;

if (typeof window !== "undefined") {
  const parser = new UAParser(window.navigator.userAgent);
  const { type } = parser.getDevice();
  deviceType = type;
  windowParser = parser;
}

export const isMobile = deviceType === "mobile" || deviceType === "tablet";
const platform = windowParser?.getOS().name;
export const isIOS = platform === "iOS";
export const isNonIOSPhone = !isIOS && deviceType === "mobile";
