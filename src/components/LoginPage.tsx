import React, { useState } from "react";
import { Button, Stack, TextField } from "@mui/material";
import LogoSVG from "../assets/logo.svg";
import styled from "styled-components";
import LoadingSpinner from "./common/LoadingSpinner";
import useLogin from "../hooks/useLogin";

const StyledLogo = styled.img`
  margin-top: -64px;
  margin-bottom: 32px;
`;

const StyledLoadingSpinner = styled(LoadingSpinner)`
  height: 45px;
`;

interface LoginPageProps {}

export default function LoginPage({}: LoginPageProps) {
  const { login, loading } = useLogin();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ height: "100vh" }}>
      <Stack spacing={2} sx={{ width: 300 }}>
        <StyledLogo src={LogoSVG} alt="LCG logo" />
        <TextField
          label="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {loading ? (
          <StyledLoadingSpinner />
        ) : (
          <Button
            size="large"
            variant="contained"
            sx={{ height: 45 }}
            onClick={() => login(username, password)}
          >
            Login
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
