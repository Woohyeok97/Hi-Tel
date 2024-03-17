// /** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { CSSProperties } from "react";

interface FlexProps {
  direction?: CSSProperties['flexDirection'];
  justify?: CSSProperties['justifyContent'];
  align?: CSSProperties['alignItems'];
  gap?: CSSProperties['gap'];
}
const Flex = styled.div<FlexProps>(({ direction, justify, align, gap }) => ({
  display: 'flex',
  flexDirection: direction,
  justifyContent: justify,
  alignItems: align,
  gap: gap,
}));

export default Flex;