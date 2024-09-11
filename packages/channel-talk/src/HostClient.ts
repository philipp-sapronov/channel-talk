import {
  CHANNEL_ESTABLISHED,
  DEFAULT_POLLING_INTERVAL,
  DEFAULT_POLLING_TIMEOUT,
  ESTABLISH_CHANNEL,
  IMessage,
} from "./defs";

/**
 * The `HostClient` class establishes and manages a communication channel
 * between the host and a client using the `MessageChannel` API. It provides
 * methods to connect, send messages, and handle connection status.
 *
 * TODO: Logger for logging errors and messages.
 */
export class HostClient extends EventTarget {
  /**
   * The communication port for sending and receiving messages.
   * Initialized to `null` and set during the connection process.
   */
  private port: MessagePort | null = null;

  /**
   * The interval identifier for the polling process.
   * Used to repeatedly attempt establishing the communication channel.
   */
  private pollingInterval: number | null = null;

  /**
   * The timeout identifier for the polling process.
   * Used to stop polling if the connection is not established within a given time.
   */
  private pollingTimeout: number | null = null;

  /**
   * Callback function that is called when the connection is successfully established.
   */
  onReady: () => void = () => {};

  /**
   * Callback function that is called when an error occurs during the connection process.
   * @param error - The error object containing details about the error.
   */
  onError: (error: Error) => void = () => {};

  /**
   * Initiates the connection to the client by creating a message channel and
   * starts polling until the connection is established or a timeout occurs.
   *
   * @param params - The parameters for establishing the connection.
   * @param params.clientOrigin - The origin of the client for security checks.
   * @param params.clientWindow - The window object of the client. Defaults to the current window.
   * @param params.pollingTimeout - Timeout duration for the polling process. Defaults to `DEFAULT_POLLING_TIMEOUT`.
   * @param params.pollingInterval - Interval duration for the polling process. Defaults to `DEFAULT_POLLING_INTERVAL`.
   * @param params.onReady - Optional callback to be called when the connection is established.
   * @param params.onError - Optional callback to be called when an error occurs.
   */
  connect(params: {
    clientOrigin: string;
    clientWindow?: Window;
    pollingTimeout?: number;
    pollingInterval?: number;
    onReady?: () => void;
    onError?: (error: Error) => void;
  }): void {
    const {
      clientOrigin,
      pollingInterval = DEFAULT_POLLING_INTERVAL,
      pollingTimeout = DEFAULT_POLLING_TIMEOUT,
      clientWindow,
      onReady,
      onError,
    } = params;

    if (this.pollingInterval) {
      console.error(`Polling already in progress`);
      return;
    }

    if (this.port) {
      console.error(`Channel already exists`);
      return;
    }

    if (!clientOrigin) {
      console.error("clientOrigin is missing");
      return;
    }

    if (onReady) {
      this.onReady = onReady;
    }

    if (onError) {
      this.onError = onError;
    }

    const channel = new MessageChannel();
    this.setPort(channel.port1);
    this.listen();

    const connect = () => {
      const win = clientWindow || window;

      try {
        win.postMessage({ type: ESTABLISH_CHANNEL }, clientOrigin, [
          channel.port2,
        ]);
      } catch (e) {
        onError?.(e as Error);
        this.stopPolling();
        this.close();
      }
    };

    const stopPolling = () => {
      this.stopPolling();
      onError?.(new Error(`Polling timed out for ${clientOrigin}`));
    };

    /** Starts the polling intervals for connection and timeout management. */
    this.pollingInterval = window.setInterval(connect, pollingInterval);

    /** Sets the timeout for stopping the polling process if not connected. */
    this.pollingTimeout = window.setInterval(stopPolling, pollingTimeout);
  }

  /**
   * Sets the port for communication.
   *
   * @param port - The `MessagePort` object to be used for communication.
   */
  private setPort(port: MessagePort): void {
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
   * Handles the connection establishment by stopping polling
   * and invoking the `onReady` callback.
   */
  private onConnected(): void {
    this.stopPolling();
    this.onReady();
  }

  /**
   * Sends a notification message through the established port.
   *
   * @param type - The type of the message.
   * @param payload - The payload of the message.
   */
  notify<T>(type: string, payload: T): void {
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
    this.port = null;
  }

  /**
   * Handles incoming messages and dispatches events based on the message type.
   *
   * @param event - The message event containing the data.
   */
  private handleMessage<T extends IMessage>(event: MessageEvent<T>): void {
    const { data } = event;

    if (typeof data.type !== "string") {
      console.error("Unexpected message type:", data);
      return;
    }

    if (event.data.type === CHANNEL_ESTABLISHED) {
      this.onConnected();
      return;
    }

    this.dispatchEvent(new CustomEvent(data.type, { detail: data.payload }));
  }

  /**
   * Stops the polling process by clearing the intervals for polling and timeout.
   * Resets the corresponding properties to `null`.
   */
  private stopPolling(): void {
    if (this.pollingTimeout) {
      clearTimeout(this.pollingTimeout);
      this.pollingTimeout = null;
    }

    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}
