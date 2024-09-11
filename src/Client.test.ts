import { Client } from "./Client";
import { CHANNEL_ESTABLISHED, ESTABLISH_CHANNEL, IMessage } from "./defs";

describe("Client", () => {
  let client: Client;
  let mockWindow: Window;

  beforeEach(() => {
    client = new Client();
    mockWindow = window;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  it("should initialize without a port", () => {
    expect(client["port"]).toBeNull();
  });

  it("should set a custom window if provided in connect", () => {
    const customWindow = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    client.connect({ window: customWindow as unknown as Window });
    expect(client["window"]).toBe(customWindow);
  });

  it("should establish a connection and call onReady", () => {
    const mockPort = {
      postMessage: jest.fn(),
      start: jest.fn(),
      close: jest.fn(),
    } as unknown as MessagePort;
    const mockEvent = new MessageEvent("message", {
      data: { type: ESTABLISH_CHANNEL },
      ports: [mockPort],
      source: {} as Window,
    });

    const onReady = jest.fn();
    client.connect({ onReady });

    client["window"].dispatchEvent(mockEvent);

    expect(client["port"]).toBe(mockPort);
    expect(onReady).toHaveBeenCalled();
  });

  it("should handle messages from the correct origin", () => {
    const mockPort = {
      postMessage: jest.fn(),
      start: jest.fn(),
      close: jest.fn(),
    } as unknown as MessagePort;
    const mockEvent = new MessageEvent("message", {
      data: { type: ESTABLISH_CHANNEL },
      origin: "http://correct-origin.com",
      source: {} as Window,
      ports: [mockPort],
    });

    const onReady = jest.fn();
    client.connect({ origin: "http://correct-origin.com", onReady });

    client["window"].dispatchEvent(mockEvent);

    expect(client["port"]).toBe(mockPort);
    expect(onReady).toHaveBeenCalled();
  });

  it("should reject messages from incorrect origin", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation();
    const mockEvent = new MessageEvent("message", {
      data: { type: ESTABLISH_CHANNEL },
      origin: "http://wrong-origin.com",
      source: {} as Window,
    });

    client.connect({
      origin: "http://correct-origin.com",
      window: mockWindow,
    });

    mockWindow.dispatchEvent(mockEvent);

    expect(consoleError).toHaveBeenCalledWith(
      "unexpected origin:",
      "http://wrong-origin.com"
    );
    expect(client["port"]).toBeNull();
  });

  it("should notify through the port if connected", () => {
    const mockPort = { postMessage: jest.fn() } as unknown as MessagePort;
    client["port"] = mockPort;

    client.notify("TEST_TYPE", { test: "payload" });

    expect(mockPort.postMessage).toHaveBeenCalledWith({
      type: "TEST_TYPE",
      payload: { test: "payload" },
    });
  });

  it("should not notify if port is missing", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation();
    client.notify("TEST_TYPE", { test: "payload" });

    expect(consoleError).toHaveBeenCalledWith("port is missing");
  });

  it("should close the port and reset it to null", () => {
    const mockPort = { close: jest.fn() } as unknown as MessagePort;
    client["port"] = mockPort;

    client.close();

    expect(mockPort.close).toHaveBeenCalled();
    expect(client["port"]).toBeNull();
  });

  it("should dispatch events based on received message types", () => {
    const mockPort = {
      onmessage: null,
      start: jest.fn(),
    } as unknown as MessagePort;
    client["port"] = mockPort;
    client["listen"]();

    const eventListener = jest.fn();
    client.addEventListener("test-event", eventListener);

    const messageEvent = new MessageEvent("message", {
      data: { type: "test-event", payload: "test" },
    });
    (mockPort.onmessage as any)(messageEvent);

    expect(eventListener).toHaveBeenCalledWith(
      expect.objectContaining({ detail: "test" })
    );
  });

  it("should handle messages correctly with handleMessage", () => {
    const mockPort = {
      onmessage: null,
      start: jest.fn(),
    } as unknown as MessagePort;
    client["port"] = mockPort;
    client["listen"]();

    const mockEvent = new MessageEvent<IMessage>("message", {
      data: { type: "test-message", payload: "payload" },
    });

    const listener = jest.fn();
    client.addEventListener("test-message", listener);

    client["handleMessage"](mockEvent);

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ detail: "payload" })
    );
  });

  it("should log an error if the message type is not a string", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation();
    const mockEvent = new MessageEvent("message", {
      data: { type: 123, payload: "test" },
    });

    client["handleMessage"](mockEvent as any);

    expect(consoleError).toHaveBeenCalledWith("unexpected message type:", {
      type: 123,
      payload: "test",
    });
  });

  it("should not listen if port is missing", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation();

    client["listen"]();

    expect(consoleError).toHaveBeenCalledWith("port is missing");
  });
});
