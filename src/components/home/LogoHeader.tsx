import React from "react";
import styled from "styled-components";
import LogoSVG from "../../assets/logo.svg";

const StyledLogoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 270px;
`;

export default function LogoHeader() {
  return (
    <StyledLogoHeader>
      <img src={LogoSVG} alt="LCG logo" />
    </StyledLogoHeader>
  );
}
