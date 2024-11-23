import { css } from "@linaria/core";
import { styled } from "@linaria/react";

export const MasonryStyled = styled.div<{
  minColumnWidth: number;
  rowHeight: number;
  columnGap: number;
}>`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${({ minColumnWidth }) => minColumnWidth}px, 1fr)
  );
  grid-auto-rows: ${({ rowHeight }) => rowHeight}px;
  column-gap: ${({ columnGap }) => columnGap}px;
`;

export const MasonryItemStyled = styled.div<{ gridArea: string }>`
  grid-area: ${({ gridArea }) => gridArea};
`;

// Used for testing
export const Item = styled.div`
  background-color: grey;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

type OffsetLineType = {
  top?: number;
  bottom?: number;
};

export const OffsetLine = styled.div<OffsetLineType>`
  position: fixed;
  width: 100%;
  border: solid 1px rgba(255, 0, 0, 0.5);

  top: ${({ top }) => String(top)}px;
  bottom: ${({ bottom }) => String(bottom)}px;
`;

export const debugInfo = css`
  position: fixed;
  top: 20px;
  right: 20px;
  background: grey;

  font-size: 1.5rem;
`;
