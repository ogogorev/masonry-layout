import { styled } from "@linaria/react";
import { breakpoints } from "../../styles/breakpoints";

export const PageContainer = styled.div`
  max-width: 1200px;
  padding: 1.5rem 1rem;
  margin: 0 auto;

  @media (min-width: ${breakpoints.lg}px) {
    padding: 1.5rem 2rem;
    height: 100vh;
  }
`;
