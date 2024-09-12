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
            Channel Talk
          </Text>
          <DrawerCloseButton />
        </DrawerHeader>
        <DrawerBody>{/*  */}</DrawerBody>
      </DrawerContent>
    </ChakraDrawer>
  );
};
