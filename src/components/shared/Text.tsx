import styled from "@emotion/styled";
import { CSSProperties } from "react";
import { ColorsType, colors } from "styles/colors";
import { TypographyType, typographyMap } from "styles/typography";

interface TextProps {
  typography: TypographyType;
  color?: ColorsType;
  display?: CSSProperties['display'];
}

const Text = styled.span<TextProps>(({ color = 'white', display, typography = 't1' }) => ({
    color: colors[color],
    display,
    ...typographyMap[typography],
  }),
);

export default Text;
