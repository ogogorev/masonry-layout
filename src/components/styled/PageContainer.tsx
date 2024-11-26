import { styled } from "@linaria/react";
import { breakpoints } from "../../styles/breakpoints";

export const PageContainer = styled.div`
  max-width: 1200px;
  height: 100vh;
  padding: 1.5rem 1rem;
  margin: 0 auto;
  box-sizing: border-box;

  @media (min-width: ${breakpoints.lg}px) {
    padding: 1.5rem 2rem;
  }
`;
