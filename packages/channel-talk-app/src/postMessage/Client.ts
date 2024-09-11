import { CHANNEL_ESTABLISHED, ESTABLISH_CHANNEL, IMessage } from "./defs";

/**
 * The `Client` class establishes and manages a communication channel
 * with a host using the `MessageChannel` API. It provides methods to connect,
 * send notifications, and handle messages received from the host.
 *
 * TODO: Logger for logging errors and messages.
 */
export class Client extends EventTarget {
  /**
   * The communication port for sending and receiving messages.
   * Initialized to `null` and set during the connection process.
   */
  private port: MessagePort | null = null;

  /**
   * The window object used for listening to messages. Defaults to the current window.
   */
  private window: Window = window;

  /**
   * Initiates the connection to the host by listening for messages
   * on the specified or default window. Establishes the communication channel
   * when the correct message is received.
   *
   * @param params - Optional parameters for establishing the connection.
   * @param params.origin - The expected origin of the host messages for security checks.
   * @param params.window - The window object to listen to. Defaults to the current window.
   * @param params.onReady - Optional callback to be called when the connection is established.
   */
  connect(params?: {
    origin?: string;
    window?: Window;
    onReady?: () => void;
  }): void {
    const onMessage = (event: MessageEvent) => {
      if (!event.source) return;

      if (params?.origin && event.origin !== params.origin) {
        console.error("unexpected origin:", event.origin);
        return;
      }

      if (event.data.type === ESTABLISH_CHANNEL && event.ports[0]) {
        this.setPort(event.ports[0]);
        this.listen();
        this.notify(CHANNEL_ESTABLISHED);

        /** Removes the message event listener once the connection is established. */
        this.window.removeEventListener("message", onMessage);
        params?.onReady?.();
      }
    };

    if (params?.window) {
      this.window = params.window;
    }

    this.window.addEventListener("message", onMessage);
  }

  /**
   * Sends a notification message through the established port.
   *
   * @param type - The type of the message to be sent.
   * @param payload - Optional payload of the message.
   */
  notify<T>(type: string, payload?: T): void {
    if (!this.port) {
      console.error("port is missing");
      return;
    }

    this.port.postMessage({ type, payload });
  }

  /**
   * Closes the communication channel and resets the port.
   */
  close(): void {
    if (!this.port) {
      console.error("port is missing");
      return;
    }

    this.port.close();
    this.setPort(null);
  }

  /**
   * Sets the port for communication or resets it to null.
   *
   * @param port - The `MessagePort` object to be used for communication or `null` to reset.
   */
  private setPort(port: MessagePort | null): void {
    this.port = port;
  }

  /**
   * Starts listening to messages on the established port.
   * Initializes the message handling and starts the port.
   */
  private listen(): void {
    if (!this.port) {
      console.error("port is missing");
      return;
    }

    this.port.onmessage = (event) => {
      this.handleMessage(event);
    };

    this.port.start();
  }

  /**
   * Handles incoming messages and dispatches events based on the message type.
   *
   * @param event - The message event containing the data.
   */
  private handleMessage<T extends IMessage>(event: MessageEvent<T>): void {
    const { data } = event;

    if (typeof data.type !== "string") {
      console.error("unexpected message type:", data);
      return;
    }

    this.dispatchEvent(
      new CustomEvent(data.type, {
        detail: data.payload,
      })
    );
  }
}
