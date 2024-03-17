// /** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { CSSProperties } from "react";
import { ColorsType, colors, getHoverColor } from "styles/colors";
import { fontSizeMap, FontSizeType } from "styles/fontSize";

interface TextButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  color?: ColorsType;
  fontSize?: FontSizeType;
  display?: CSSProperties['display'];
}

// 스타일 props을 받을 스타일드 컴포넌트 생성
const StyledTextButton = styled.span<TextButtonProps>(({ color = 'white', display, fontSize = 'base' }) => ({
    color: colors[color],
    display,
    cursor: 'pointer',
    fontSize: fontSizeMap[fontSize],
    '&:hover': {
      color: getHoverColor(color),
    },
  })
);

// 로직, 옵션을 받을 컴포넌트 생성
export default function TextButton({ children, onClick, ...styledProps }: TextButtonProps) {
  return (
    <StyledTextButton onClick={onClick} {...styledProps}>
      {children}
    </StyledTextButton>
  );
}
