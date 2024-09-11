import React from "react";
import { Box, Button, Text } from "@chakra-ui/react";

export const WatermelonButton = ({
  onClick,
  isDisabled,
}: {
  onClick: () => void;
  isDisabled: boolean;
}) => {
  return (
    <Box>
      <Button
        isLoading={isDisabled}
        onClick={onClick}
        bg="purple.400"
        _hover={{ bg: "purple.500" }}
        _focus={{ bg: "purple.500" }}
        _active={{ bg: "purple.500" }}
        size="lg"
        variant="solid"
        colorScheme="purple"
        w="100%"
      >
        Checkout with 🍉 Watermelon
      </Button>
      <Text color="gray.700" mt="2">
        🍉 Watermelon is built on a regular{" "}
        <Text
          as="a"
          color="green.600"
          textDecoration="underline"
          href="https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API"
          target="_blank"
          rel="noreferrer noopener"
        >
          postMessage
        </Text>{" "}
        calls. Any malicious script can listen to these messages.{" "}
      </Text>
    </Box>
  );
};
