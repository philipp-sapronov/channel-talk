import { Box } from "@chakra-ui/react";
import { ITowerItem } from "./types";
import { css } from "@emotion/react";
import { TOWER_COLOR } from "./defs";

export const TowerItem = ({
  item,
  isDraggable,
  onDragStart,
  onDragEnd,
}: {
  item: ITowerItem;
  isDraggable: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}) => {
  return (
    <Box
      onDragStart={(e) => {
        if (!isDraggable) {
          e.preventDefault();
          return;
        }

        onDragStart();
      }}
      draggable={isDraggable}
      onDragEnd={onDragEnd}
      css={css`
        position: relative;
        z-index: 1;
        width: calc(${item} * var(--chakra-sizes-8));
        background-color: var(--chakra-colors-${TOWER_COLOR[item]}-400);
        border-radius: var(--chakra-radii-full);
        margin: 0 auto;
        margin-top: var(--chakra-space-1);
        height: var(--chakra-sizes-8);
        cursor: ${isDraggable ? "grab" : "default"};

        &:hover {
          background-color: var(--chakra-colors-${TOWER_COLOR[item]}-500);
        }
      `}
    />
  );
};
