import { useState } from "react";
import { Tower } from "./Tower";
import { TowerItem } from "./TowerItem";
import { INITIAL_TOWERS } from "./defs";
import { Box, Flex } from "@chakra-ui/react";
import { css } from "@emotion/react";

export const HanoiTowers = () => {
  const [towers, setTowers] = useState(INITIAL_TOWERS);

  return (
    <Box
      css={css`
        margin-top: 100px;
        border: 4px solid var(--chakra-colors-gray-100);
        border-radius: var(--chakra-radii-md);
        background-color: var(--chakra-colors-gray-50);
        padding: 0 var(--chakra-space-4) var(--chakra-space-2);
      `}
    >
      <Flex>
        {towers.map((tower, towerIdx) => {
          return (
            <Tower key={towerIdx}>
              {tower.map((item, itemIdx) => {
                return (
                  <TowerItem
                    key={item}
                    item={item}
                    isDraggable={itemIdx === 0}
                  />
                );
              })}
            </Tower>
          );
        })}
      </Flex>
    </Box>
  );
};
