import { css } from "@emotion/react";

export const colorList = css`
  :root {
    --blue: #00007f;
    --blue100: #040461;
    --blue-light: #3d83f7;
    --white: #ccc;
    --white-hover: #eaeaea;
    --gray: gray;
    --gray-hover: darkgray;
    --orangered: orangered;
    --orangered-hover: rgb(255, 98, 40);
    --border-blue: rgba(0, 0, 255, 1);
    --border-black: #000000;
  }
`;

export const colors = {
  blue: 'var(--blue)',
  blue100: 'var(--blue100)',
  blueLigth: 'var(--blue-light)',
  white: 'var(--white)',
  whiteHover: 'var(--white-hover)',
  gray: 'var(--gray)',
  grayHover: 'var(--gray-hover)',
  orangered: 'var(--orangered)',
  orangeredHover: 'var(--orangered-hover)',
  borderBlue: 'var(--border-blue)',
  borderBack: 'var(--border-black)',
};

export const getHoverColor = (color: ColorsType): string => {
  switch (color) {
    case 'white':
      return colors.whiteHover;
    case 'gray':
      return colors.grayHover;
    case 'orangered':
      return colors.orangeredHover;
    default:
      return color;
  }
};

export type ColorsType = keyof typeof colors;
