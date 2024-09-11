import { Flex, Text } from "@chakra-ui/react";

export const Header = ({ amount }: { amount: number }) => {
  const { format } = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <Flex
      direction="row"
      justifyContent="space-between"
      width="100%"
      flexWrap="nowrap"
    >
      <Text fontWeight="bold" fontSize="large" as="h3">
        🛒 Total
      </Text>
      <Text fontWeight="bold" fontSize="large" as="h3">
        {format(amount || 0)}
      </Text>
    </Flex>
  );
};
