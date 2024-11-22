import { css } from "@linaria/core";

export const globalStyles = css`
  :global() {
    :root {
      font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;

      font-synthesis: none;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      margin: 0;
      min-height: 100vh;
      max-height: 100vh;
      min-height: -webkit-fill-available;
    }
  }
`;
