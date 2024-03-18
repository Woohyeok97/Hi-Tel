import styled from "@emotion/styled";
import { CSSProperties } from "react";
import { ColorsType, colors } from "styles/colors";
import { fontSizeMap, FontSizeType } from "styles/fontSize";

interface TextProps {
  fontSize?: FontSizeType;
  color?: ColorsType;
  display?: CSSProperties['display'];
}

export const Text = styled.span<TextProps>(({ color = 'white', display, fontSize = 'base' }) => ({
    color: colors[color],
    display,
    fontSize: fontSizeMap[fontSize],
  }),
);
