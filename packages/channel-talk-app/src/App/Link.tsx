import { Text } from "@chakra-ui/layout";
import { ReactNode } from "react";

export const Link = ({
  href,
  children,
  onDark,
}: {
  href: string;
  children: ReactNode;
  onDark?: boolean;
}) => {
  return (
    <Text
      color={onDark ? "green.400" : "green.600"}
      textDecoration="underline"
      as="a"
      href={href}
      target="_blank"
    >
      {children}
    </Text>
  );
};
