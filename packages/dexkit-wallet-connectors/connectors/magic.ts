import { EventEmitter } from "events";

import { waitForEvent } from "../utils";

export const MAGIC_EVENT_EXECUTE = "execute";
export const MAGIC_EVENT_REQUEST = "request";
export const MAGIC_EVENT_CANCEL = "cancel";

export interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

export type MagicConnectOptions = {
  apiKey: string;
};

export class ProviderWrapper {
  public provider: any;
  public eventEmitter: EventEmitter;

  constructor(provider: any, eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
    this.provider = provider;
  }

  async request(args: RequestArguments) {
    if (
      args.method === "eth_sendTransaction" ||
      args.method === "eth_sendRawTransaction"
    ) {
      this.eventEmitter.emit(MAGIC_EVENT_REQUEST, args);

      const newArgs = await waitForEvent(
        this.eventEmitter,
        "execute",
        "cancel",
      );

      return this.provider.request(newArgs);
    } else if (args.method === "personal_sign") {
      this.eventEmitter?.emit("sign", args);

      await waitForEvent(this.eventEmitter, "sign.confirm", "sign.cancel");

      return this.provider.request(args);
    }

    return this.provider.request(args);
  }
}

export type MagicLoginType = "email" | "google" | "twitter" | "discord";
