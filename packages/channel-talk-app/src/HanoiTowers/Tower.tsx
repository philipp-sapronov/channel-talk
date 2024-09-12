import { Box } from "@chakra-ui/react";
import { css } from "@emotion/react";
import { useState } from "react";

export const Tower = ({ children }: { children: React.ReactNode }) => {
  const [dragOver, setDragOver] = useState(false);

  return (
    <Box
      onDragOver={(e) => {
        e.preventDefault();
        console.log("onDragOver", e);
        setDragOver(true);
      }}
      onDragLeave={(e) => {
        console.log("onDragLeave", e);
        setDragOver(false);
      }}
      onDrop={(e) => {
        console.log("onDrop", e);
        setDragOver(false);
      }}
      css={css`
        position: relative;
        width: 200px;
        height: 300px;
        display: flex;
        align-items: flex-end;
        flex-direction: column;
        align-items: center;
        padding: 100px 0 var(--chakra-space-2);
      `}
    >
      {children}
      <Box
        css={css`
          position: absolute;
          width: 4px;
          height: calc(100% - 100px);
          background-color: ${dragOver
            ? "var(--chakra-colors-messenger-400)"
            : "var(--chakra-colors-gray-300)"};
          border-top-left-radius: var(--chakra-radii-full);
          border-top-right-radius: var(--chakra-radii-full);
          bottom: var(--chakra-space-4);
          left: 50%;
          transform: translateX(-50%);
          z-index: 0;
        `}
      />
      <Box
        css={css`
          position: absolute;
          width: calc(100% - var(--chakra-space-4));
          height: var(--chakra-space-2);
          background-color: ${dragOver
            ? "var(--chakra-colors-messenger-400)"
            : "var(--chakra-colors-gray-300)"};
          border-radius: var(--chakra-radii-full);
          bottom: var(--chakra-space-2);
          left: 50%;
          transform: translateX(-50%);
          right: 0;
          z-index: 0;
        `}
      />
    </Box>
  );
};
