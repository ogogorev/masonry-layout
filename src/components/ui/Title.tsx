import { styled } from "@linaria/react";
import { breakpoints } from "../../styles/breakpoints";

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 900;

  @media (min-width: ${breakpoints.md}px) {
    font-size: 2rem;
  }
`;
