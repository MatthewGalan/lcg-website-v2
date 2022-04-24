import React from "react";
import styled from "styled-components";
import { Button, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MiniLogoSVG from "../../assets/mini_logo.svg";
import BrushIcon from "@mui/icons-material/Brush";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const StyledLogoHeader = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 20px;
  margin: 8px 0;

  img {
    height: 24px;
    margin-right: 8px;
  }
`;

export default function PortalHeader() {
  const navigate = useNavigate();

  return (
    <Stack direction="row" sx={{ background: "white", px: 4, mb: 4 }}>
      <Stack direction="row" flex={1}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}>
          Back to site
        </Button>
      </Stack>

      <StyledLogoHeader>
        <img src={MiniLogoSVG} alt="LCG logo" />
        <div>Portal</div>
      </StyledLogoHeader>

      <Stack direction="row" flex={1} justifyContent="flex-end" spacing={4}>
        <Button
          startIcon={<BrushIcon />}
          onClick={() => navigate("/portal/editor/new")}
        >
          Add piece
        </Button>
        <Button startIcon={<LogoutIcon />}>Logout</Button>
      </Stack>
    </Stack>
  );
}
