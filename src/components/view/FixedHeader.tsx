import React from "react";
import styled from "styled-components";
import MiniLogoSVG from "../../assets/mini_logo.svg";
import { Button, useMediaQuery } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const StyledDiv = styled.div`
  position: fixed;
  z-index: 1;

  width: 100%;
  padding: 8px;
  min-height: 36px;

  background: white;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);

  .mini-logo {
    cursor: pointer;
    height: 80px;
    position: absolute;
    left: 50%;
    top: 8px;
    transform: translate(-50%, 0);
  }
`;

export default function FixedHeader() {
  const navigate = useNavigate();
  const widescreen = useMediaQuery("(min-width: 769px)");

  const goHome = () => navigate("/");

  return (
    <StyledDiv>
      {widescreen && (
        <Button startIcon={<ArrowBackIcon />} onClick={goHome}>
          Back to gallery
        </Button>
      )}
      <img
        src={MiniLogoSVG}
        alt="LCG logo"
        className="mini-logo"
        onClick={goHome}
      />
    </StyledDiv>
  );
}
