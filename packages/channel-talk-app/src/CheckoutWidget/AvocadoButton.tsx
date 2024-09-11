import React from "react";
import { Box, Button, Text } from "@chakra-ui/react";

export const AvocadoButton = ({
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
        bg="green.400"
        _hover={{ bg: "green.500" }}
        _focus={{ bg: "green.500" }}
        _active={{ bg: "green.500" }}
        size="lg"
        variant="solid"
        colorScheme="green"
        color="white"
        w="100%"
      >
        Checkout with 🥑 Avocado
      </Button>
      <Text color="gray.700" mt="2">
        🥑 Avocado uses the{" "}
        <Text
          as="a"
          color="green.600"
          textDecoration="underline"
          href="https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API"
          target="_blank"
          rel="noreferrer noopener"
        >
          Channel Messaging API
        </Text>
        . Secure and faster than postMessage.{" "}
      </Text>{" "}
    </Box>
  );
};
