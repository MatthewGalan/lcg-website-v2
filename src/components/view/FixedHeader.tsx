import React from "react";
import styled from "styled-components";
import MiniLogoSVG from "../../assets/mini_logo.svg";
import { Button, Stack, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";

const StyledDiv = styled.div`
  position: fixed;
  z-index: 1;

  width: calc(100% - 32px);
  height: 36px;
  padding: 8px 16px;

  background: white;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.2);

  .mini-logo {
    cursor: pointer;
    height: 80px;
  }

  @media only screen and (max-width: 768px) {
    width: calc(100% - 16px);
    padding: 4px 8px 2px 8px;

    .mini-logo {
      height: 70px;
    }
  }
`;

export default function FixedHeader() {
  const navigate = useNavigate();
  const widescreen = useMediaQuery("(min-width: 769px)");

  const goHome = () => navigate("/");

  return (
    <StyledDiv>
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent={widescreen ? "center" : "space-between"}
        spacing={2}
      >
        <Button
          onClick={goHome}
          size={widescreen ? "medium" : "small"}
          sx={{ lineHeight: widescreen ? "24.5px" : 1 }}
        >
          Back to
          {!widescreen && <br />} gallery
        </Button>
        <img
          src={MiniLogoSVG}
          alt="LCG logo"
          className="mini-logo"
          onClick={goHome}
        />
        <Button
          onClick={() => navigate("/", { state: { about: true } })}
          size={widescreen ? "medium" : "small"}
          sx={{ lineHeight: widescreen ? "24.5px" : 1 }}
        >
          Meet the
          {!widescreen && <br />} artist
        </Button>
      </Stack>
    </StyledDiv>
  );
}
