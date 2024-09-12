import { useState } from "react";
import { Tower } from "./Tower";
import { TowerItem } from "./TowerItem";
import { INITIAL_TOWERS } from "./defs";
import { Box, Flex } from "@chakra-ui/react";
import { css } from "@emotion/react";
import { ITowerItem } from "./types";

export const HanoiTowers = () => {
  const [towers, setTowers] = useState(INITIAL_TOWERS);

  const [draggingItem, setDraggingItem] = useState<ITowerItem | null>(null);

  return (
    <Box
      css={css`
        margin-top: 100px;
        border: 4px solid;
        border-radius: var(--chakra-radii-md);
        background-color: var(--chakra-colors-gray-50);
        border-color: var(--chakra-colors-gray-200);
        padding: 0 var(--chakra-space-4) var(--chakra-space-2);
      `}
    >
      <Flex>
        {towers.map(({ id, items }) => {
          return (
            <Tower
              key={id}
              isDroppable={
                (draggingItem !== null && draggingItem < items[0]) ||
                items.length === 0
              }
              onDrop={() => {
                if (draggingItem) {
                  setDraggingItem(null);

                  setTowers((prev) => {
                    const newTowers = [...prev];
                    const draggingItemIdx = newTowers.findIndex((tower) =>
                      tower.items.includes(draggingItem)
                    );
                    const targetTowerIdx = newTowers.findIndex(
                      (tower) => tower.id === id
                    );
                    if (draggingItemIdx !== targetTowerIdx) {
                      newTowers[draggingItemIdx] = {
                        ...newTowers[draggingItemIdx],
                        items: newTowers[draggingItemIdx].items.filter(
                          (item) => item !== draggingItem
                        ),
                      };
                      newTowers[targetTowerIdx] = {
                        ...newTowers[targetTowerIdx],
                        items: [
                          draggingItem,
                          ...newTowers[targetTowerIdx].items,
                        ],
                      };
                    }
                    return newTowers;
                  });
                }
              }}
            >
              {items.map((item, itemIdx) => {
                return (
                  <TowerItem
                    key={item}
                    item={item}
                    isDraggable={itemIdx === 0}
                    onDragStart={() => {
                      setDraggingItem(item);
                    }}
                    onDragEnd={() => {
                      setDraggingItem(null);
                    }}
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
