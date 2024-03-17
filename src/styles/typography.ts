import { css } from '@emotion/react';

export const typographyMap = {
  t1: css`
    font-size: 30px;
    line-height: 1.35;
  `,
  t2: css`
    font-size: 24px;
    line-height: 1.34;
  `,
  t3: css`
    font-size: 20px;
    line-height: 1.4;
  `,
  t4: css`
    font-size: 18px;
    line-height: 1.45;
  `,
  t5: css`
    font-size: 16px;
    line-height: 1.5;
  `,
  t6: css`
  font-size: 14px;
  line-height: 1.6;
  `
};

export type TypographyType = keyof typeof typographyMap;