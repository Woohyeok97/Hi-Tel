import styled from "@emotion/styled";
import { ColorsType, colors } from "styles/colors";

interface DividerPrpps {
  color?: ColorsType;
  size?: number;
}
export const Divider = styled.span<DividerPrpps>(({ color = 'white', size = 1}) => ({
  borderTop: `${size}px solid ${colors[color]}`,
}));