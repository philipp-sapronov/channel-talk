export interface IMessage {
  type: string;
  payload: any;
}

export const ESTABLISH_CHANNEL = "establish-channel";
export const CHANNEL_ESTABLISHED = "channel-established";

export const DEFAULT_POLLING_INTERVAL = 1000;
export const DEFAULT_POLLING_TIMEOUT = 1000 * 10;
