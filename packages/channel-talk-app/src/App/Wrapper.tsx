import { Box, Text } from "@chakra-ui/react";

export const Wrapper = ({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) => {
  return (
    <Box
      my="4"
      p="4"
      border="1px"
      borderColor="gray.500"
      position="relative"
      borderRadius="lg"
    >
      <Text
        position="absolute"
        color="gray.500"
        bgColor="gray.50"
        px="1"
        top="-3"
        left="4"
        fontWeight="medium"
        fontSize="sm"
      >
        {text}
      </Text>
      {children}
    </Box>
  );
};
