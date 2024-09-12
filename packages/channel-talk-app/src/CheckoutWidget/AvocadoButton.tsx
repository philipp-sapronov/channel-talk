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
        Checkout
      </Button>
    </Box>
  );
};
