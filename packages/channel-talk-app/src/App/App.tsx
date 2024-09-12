import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Center, ChakraProvider, Flex, Grid, GridItem } from "@chakra-ui/react";
import Frame from "react-frame-component";
import styled from "@emotion/styled";

import { CheckoutWidget } from "../CheckoutWidget";
import { Wrapper } from "./Wrapper";
import { HostClient } from "../postMessage";
import { Drawer } from "./Drawer";
import { PageInfo } from "./PageInfo";
import { AmountInput } from "./AmountInput";
import { HanoiTowers } from "../HanoiTowers";

const INITIAL_AMOUNT = 100;

const IFrame = styled(Frame)`
  border: none;
  border-radius: 8px;
  box-shadow: 0 5px 15px 0px rgba(0, 0, 0, 0.1),
    0 2px 6px 0px rgba(0, 0, 0, 0.05);
  background-color: white;
`;

function App() {
  const [amount, setAmount] = useState(INITIAL_AMOUNT);
  const [frameRef, setFrameRef] = useState<HTMLIFrameElement | null>(null);
  const [iframeReady, setIframeReady] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const hostClient = useMemo(() => new HostClient(), []);

  const onAmountChange = useCallback((value: number) => {
    hostClient.notify("changeAmount", { amount: value });
    setAmount(value);
  }, []);

  const setLog = useCallback(
    (data: object) => {
      setLogs((prevLogs) => [...prevLogs, JSON.stringify(data, null, 4)]);
    },
    [setLogs]
  );

  useEffect(() => {
    if (!frameRef?.contentWindow) return;

    hostClient.connect({
      clientOrigin: "*",
      clientWindow: frameRef.contentWindow,
      onReady: () => {
        setIframeReady(true);
      },
    });

    hostClient.addEventListener("checkout", (e) => {
      setLog((e as CustomEvent).detail);
    });

    return () => {
      hostClient.close();
    };
  }, [frameRef, setLog]);

  useEffect(() => {
    const handleMessages = (e: MessageEvent) => {
      if (e.data?.type !== "checkout") return;
      setLog(e.data.payload);
    };

    window.addEventListener("message", handleMessages);

    return () => {
      window.removeEventListener("message", handleMessages);
    };
  }, [frameRef, setLog]);

  return (
    <ChakraProvider>
      <Center>
        <HanoiTowers />
      </Center>
      <Drawer isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
    </ChakraProvider>
  );
}

export default App;
