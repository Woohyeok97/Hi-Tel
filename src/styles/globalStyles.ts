import { css } from '@emotion/react';
import './font/font.css';
import { colorList } from './colors';

export default css`
  ${colorList}
  
  body {
    font-family: 'DungGeunMo', sans-serif;
    color: #ffffff;
    height: 100vh;
  }
  input {
    outline: none;
    border: none;
    box-sizing: border-box;
  }
  textarea {
    outline: none;
    border: none;
    box-sizing: border-box;
    resize: none;
    }
  h1 {
    margin: 0;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
`