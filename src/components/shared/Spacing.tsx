import styled from "@emotion/styled";

interface SpacingProps {
  size: number;
  direction?: 'vertical' | 'horizontal';
}
export const Spacing = styled.div<SpacingProps>(({ size, direction = 'vertical' }) => ({
    width: direction === 'horizontal' ? `${size}px` : undefined,
    height: direction === 'vertical' ? `${size}px` : undefined,
  })
);