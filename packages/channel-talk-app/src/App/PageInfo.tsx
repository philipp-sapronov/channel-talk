import React from "react";
import { Box, Button, Divider, Flex, Text } from "@chakra-ui/react";

import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Github } from "./Github";
import { Link } from "./Link";
import { links } from "./defs";

export const PageInfo = ({
  messageLogs,
  onReadMore,
}: {
  messageLogs: string[];
  onReadMore: () => void;
}) => {
  return (
    <>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb="2">
          <Text color="white" fontSize="x-large" fontWeight="semibold" py="2">
            Channel Messaging API demo
          </Text>
          <Github />
        </Flex>
        <Text color="gray.300" py="1" maxW="600px">
          Explore the security differences between postMessage and Channel
          Messaging API in real-time. See how{" "}
          <Link onDark href={links.ChannelMessagingApi}>
            Channel Messaging API
          </Link>{" "}
          keeps your data safe.
        </Text>
        <Button colorScheme="green" variant="solid" mt="2" onClick={onReadMore}>
          Read more
        </Button>
      </Box>
      <Divider my="4" borderColor="gray.600" />
      <Box py="2">
        <Text color="gray.100" fontSize="medium" fontWeight="semibold">
          Message logs
        </Text>
        <Text color="gray.400">
          Messages sent from the iframe will be displayed here.
        </Text>
      </Box>
      {messageLogs.length === 0 && (
        <Box bg="gray.700" borderRadius="md" p="2">
          <Text color="gray.400" fontSize="sm">
            No messages yet
          </Text>
        </Box>
      )}
      {messageLogs.map((log, index) => (
        <Box bg="gray.700" borderRadius="md" p="2" mb="2" key={index}>
          <SyntaxHighlighter
            customStyle={{
              fontSize: "14px",
              backgroundColor: "transparent",
            }}
            language="javascript"
            style={a11yDark}
          >
            {log}
          </SyntaxHighlighter>
        </Box>
      ))}
    </>
  );
};
