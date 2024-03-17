import styled from "@emotion/styled";
import { CSSProperties } from "react";
import { ColorsType, colors } from "styles/colors";
import { fontSizeMap, FontSizeType } from "styles/fontSize";

interface TextProps {
  fontSize: FontSizeType;
  color?: ColorsType;
  display?: CSSProperties['display'];
}

const Text = styled.span<TextProps>(({ color = 'white', display, fontSize = 'base' }) => ({
    cursor: 'pointer',
    color: colors[color],
    display,
    fontSize: fontSizeMap[fontSize],
  }),
);

export default Text;
