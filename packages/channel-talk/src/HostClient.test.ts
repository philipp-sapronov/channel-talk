import { HostClient } from "./HostClient";
import { CHANNEL_ESTABLISHED, ESTABLISH_CHANNEL, IMessage } from "./defs";

describe("HostClient", () => {
  let hostClient: HostClient;
  let mockWindow: Window;

  beforeEach(() => {
    hostClient = new HostClient();
    mockWindow = window;
    jest.useFakeTimers();

    // Mocking the MessageChannel API
    const mockPort1 = {
      postMessage: jest.fn(),
      start: jest.fn(),
      close: jest.fn(),
    } as unknown as MessagePort;

    const mockPort2 = {} as MessagePort;

    const mockChannel = {
      port1: mockPort1,
      port2: mockPort2,
    } as MessageChannel;

    // Mock the MessageChannel constructor globally
    (global as any).MessageChannel = jest.fn(() => mockChannel);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  it("should initialize without a port", () => {
    expect(hostClient["port"]).toBeNull();
  });

  it("should connect and establish a message channel", () => {
    const mockPostMessage = jest.fn();
    const mockChannel = new MessageChannel();

    jest.spyOn(mockWindow, "postMessage").mockImplementation(mockPostMessage);

    const onReady = jest.fn();
    hostClient.connect({
      clientOrigin: "http://example.com",
      onReady,
    });

    jest.runOnlyPendingTimers();

    expect(hostClient["port"]).not.toBeNull();
    expect(mockWindow.postMessage).toHaveBeenCalledWith(
      { type: ESTABLISH_CHANNEL },
      "http://example.com",
      [mockChannel.port2]
    );
  });

  it("should call onReady when the connection is established", () => {
    const mockPort = {
      postMessage: jest.fn(),
      start: jest.fn(),
    } as unknown as MessagePort;
    hostClient["port"] = mockPort;
    hostClient["listen"]();

    const onReady = jest.fn();
    hostClient.onReady = onReady;

    const messageEvent = new MessageEvent<IMessage>("message", {
      data: { type: CHANNEL_ESTABLISHED, payload: null },
    });

    // Triggering the message event to simulate a successful connection
    (mockPort.onmessage as any)(messageEvent);

    expect(onReady).toHaveBeenCalled();
    expect(hostClient["pollingInterval"]).toBeNull();
    expect(hostClient["pollingTimeout"]).toBeNull();
  });

  it("should stop polling and handle error on connection failure", () => {
    const mockPostMessage = jest.fn().mockImplementation(() => {
      throw new Error("Failed to connect");
    });
    jest.spyOn(mockWindow, "postMessage").mockImplementation(mockPostMessage);

    const onError = jest.fn();
    hostClient.connect({
      clientOrigin: "http://example.com",
      onError,
    });

    jest.runOnlyPendingTimers();

    expect(onError).toHaveBeenCalledWith(new Error("Failed to connect"));
    expect(hostClient["pollingInterval"]).toBeNull();
    expect(hostClient["pollingTimeout"]).toBeNull();
  });

  it("should notify through the port if connected", () => {
    const mockPort = { postMessage: jest.fn() } as unknown as MessagePort;
    hostClient["port"] = mockPort;

    hostClient.notify("TEST_TYPE", { test: "payload" });

    expect(mockPort.postMessage).toHaveBeenCalledWith({
      type: "TEST_TYPE",
      payload: { test: "payload" },
    });
  });

  it("should not notify if port is missing", () => {
    console.error = jest.fn();
    hostClient.notify("TEST_TYPE", { test: "payload" });

    expect(console.error).toHaveBeenCalledWith("port is missing");
  });

  it("should close the port and reset it to null", () => {
    const mockPort = { close: jest.fn() } as unknown as MessagePort;
    hostClient["port"] = mockPort;

    hostClient.close();

    expect(mockPort.close).toHaveBeenCalled();
    expect(hostClient["port"]).toBeNull();
  });

  it("should handle incoming messages and dispatch events", () => {
    const mockPort = {
      onmessage: null,
      start: jest.fn(),
    } as unknown as MessagePort;
    hostClient["port"] = mockPort;
    hostClient["listen"]();

    const eventListener = jest.fn();
    hostClient.addEventListener("test-event", eventListener);

    const messageEvent = new MessageEvent("message", {
      data: { type: "test-event", payload: "test" },
    });
    (mockPort.onmessage as any)(messageEvent);

    expect(eventListener).toHaveBeenCalledWith(
      expect.objectContaining({ detail: "test" })
    );
  });

  it("should stop polling when connected", () => {
    hostClient["pollingInterval"] = 123;
    hostClient["pollingTimeout"] = 456;
    jest.spyOn(global, "clearInterval");
    jest.spyOn(global, "clearTimeout");

    hostClient["onConnected"]();

    expect(clearInterval).toHaveBeenCalledWith(123);
    expect(clearTimeout).toHaveBeenCalledWith(456);
    expect(hostClient["pollingInterval"]).toBeNull();
    expect(hostClient["pollingTimeout"]).toBeNull();
  });

  it("should not listen if port is missing", () => {
    console.error = jest.fn();

    hostClient["listen"]();

    expect(console.error).toHaveBeenCalledWith("port is missing");
  });
});
