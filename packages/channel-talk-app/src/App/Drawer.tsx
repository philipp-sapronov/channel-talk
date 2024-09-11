import React from "react";
import {
  Box,
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
} from "@chakra-ui/react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Link } from "./Link";
import { links } from "./defs";

const scriptExample = `window.addEventListener("message", (e) => alert(JSON.stringify(e.data.payload)));`;

export const Drawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
}: {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
}) => {
  return (
    <ChakraDrawer
      size="lg"
      placement="left"
      isOpen={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      isFullHeight
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">
          <Text fontSize="x-large" fontWeight="bold" color="gray.500">
            Channel Messaging API demo
          </Text>
          <DrawerCloseButton />
        </DrawerHeader>
        <DrawerBody>
          <Stepper
            index={0}
            orientation="vertical"
            // height="400px"
            gap="2"
            // size="sm"
          >
            <Step>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>
              <Box>
                <StepTitle>
                  <Text py="1" fontWeight="semibold">
                    🧙 Insert Malicious Script
                  </Text>
                </StepTitle>
                <StepDescription>
                  Insert the following script into the DevTools Console to
                  intercept every message sent from the iframe:
                  <Box py="2">
                    <SyntaxHighlighter
                      wrapLines
                      wrapLongLines
                      customStyle={{
                        fontSize: "14px",
                        borderRadius: "var(--chakra-radii-md)",
                      }}
                      language="javascript"
                      style={a11yDark}
                    >
                      {scriptExample}
                    </SyntaxHighlighter>
                  </Box>
                  This example demonstrates a simple script for illustration
                  purposes, but a real-world scenario involving a malicious
                  script could be much more complex and dangerous.
                </StepDescription>
              </Box>
              <StepSeparator />
            </Step>
            <Step>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>
              <Box>
                <StepTitle>
                  <Text py="1" fontWeight="semibold">
                    🛒 Edit the Amount
                  </Text>
                </StepTitle>
                <StepDescription>
                  When you edit the amount, the changes are sent through the{" "}
                  <Link href={links.MessagePort}>MessagePort</Link> from the
                  host application to the iframe, demonstrating a two-way
                  communication channel. This ensures real-time data
                  synchronization between components.
                </StepDescription>
              </Box>
              <StepSeparator />
            </Step>
            <Step>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>
              <Box>
                <StepTitle>
                  <Text py="1" fontWeight="semibold">
                    🍉 Checkout with Watermelon
                  </Text>
                </StepTitle>
                <StepDescription>
                  Watermelon uses the standard{" "}
                  <Link href={links.PostMessage}>postMessage</Link> method for
                  communication, which can be easily intercepted by harmful
                  scripts. If a malicious script is added,{" "}
                  <Text as="span" fontWeight="semibold">
                    an alert will pop up showing the order details,
                  </Text>{" "}
                  revealing the vulnerability of sensitive data. This shows how
                  messages from an iframe can be intercepted when it
                  communicates with the parent window.
                </StepDescription>
              </Box>
              <StepSeparator />
            </Step>
            <Step>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>
              <Box>
                <StepTitle>
                  <Text py="1" fontWeight="semibold">
                    🥑 Checkout with Avocado
                  </Text>
                </StepTitle>
                <StepDescription>
                  When you click on the avocado button,{" "}
                  <Text as="span" fontWeight="semibold">
                    no alert will be shown,
                  </Text>{" "}
                  because the external script does not have access to the{" "}
                  <Link href={links.MessageChannel}>MessageChannel</Link>. The
                  avocado is integrated using the{" "}
                  <Link href={links.ChannelMessagingApi}>
                    Channel Messaging API
                  </Link>
                  , which allows safe data transfer between components without
                  information leakage.
                </StepDescription>
              </Box>
              <StepSeparator />
            </Step>
          </Stepper>
        </DrawerBody>
      </DrawerContent>
    </ChakraDrawer>
  );
};
