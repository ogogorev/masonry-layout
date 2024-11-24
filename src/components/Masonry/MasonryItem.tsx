import {
  ComponentProps,
  ForwardedRef,
  forwardRef,
  memo,
  PropsWithChildren,
} from "react";
import { MasonryItemStyled } from "./Masonry.styles";

type MasonryItemProps = PropsWithChildren<{
  gridArea: string;
  refValue?: ForwardedRef<HTMLDivElement>;
}>;

const MasonryItemComponent = forwardRef<HTMLDivElement, MasonryItemProps>(
  ({ gridArea, children }, ref) => {
    return (
      <MasonryItemStyled ref={ref} gridArea={gridArea}>
        {children}
      </MasonryItemStyled>
    );
  }
);

export const MasonryItem = memo(
  MasonryItemComponent,
  (
    prev: ComponentProps<typeof MasonryItemComponent>,
    next: ComponentProps<typeof MasonryItemComponent>
  ) => prev.refValue === next.refValue && prev.gridArea === next.gridArea
);
