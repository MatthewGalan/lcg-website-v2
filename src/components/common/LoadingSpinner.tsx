import React from "react";
import colors from "../../Colors";
import styled from "styled-components";

const size = 24;

const Styled = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
`;

const StyledSVG = styled.svg<{ index: number }>`
  width: 0;
  height: 0;
  padding: ${size / 2}px;

  @keyframes pulse {
    from {
      width: 0;
      height: 0;
      padding: ${size / 2}px;
    }
    to {
      width: ${size}px;
      height: ${size}px;
      padding: 0;
    }
  }

  animation: pulse 0.5s ${(props) => `${props.index * 0.2}s`} ease infinite
    alternate;
`;

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner = ({ className }: LoadingSpinnerProps) => (
  <Styled className={`loading-spinner ${className ?? ""}`}>
    <StyledSVG index={0} width={size} height={size}>
      <rect width="100%" height="100%" style={{ fill: colors.green }} />
    </StyledSVG>
    <StyledSVG index={1} width={size} height={size}>
      <circle cx="50%" cy="50%" r="48%" style={{ fill: colors.red }} />
    </StyledSVG>
    <StyledSVG index={2} width={size} height={size}>
      <circle cx="50%" cy="50%" r="48%" style={{ fill: colors.blue }} />
    </StyledSVG>
  </Styled>
);

export default LoadingSpinner;
