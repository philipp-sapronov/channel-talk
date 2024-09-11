import { Box, Text } from "@chakra-ui/react";

import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

export const PaymentInfo = ({ data }: { data: object }) => {
  return (
    <Box
      px="2"
      borderRadius="base"
      border="1px solid"
      borderColor="gray.300"
      bgColor="gray.50"
    >
      <Box as="form" mt="0.5rem">
        <SyntaxHighlighter
          wrapLines
          wrapLongLines
          customStyle={{
            fontSize: "14px",
            backgroundColor: "transparent",
          }}
          language="json"
          style={a11yLight}
        >
          {JSON.stringify(data, null, 2)}
        </SyntaxHighlighter>
      </Box>
    </Box>
  );
};
