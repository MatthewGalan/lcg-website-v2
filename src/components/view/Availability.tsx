import React from "react";
import Piece from "../../types/Piece";
import { Button, Stack, Typography } from "@mui/material";
import styled from "styled-components";

const StyledDot = styled.div`
  width: 8px;
  height: 8px;
  margin-right: 8px;
  border-radius: 50%;
  background-color: #eb4928;
`;

interface AvailabilityProps {
  piece: Piece;
  openModal: () => void;
}

export default function Availability({ piece, openModal }: AvailabilityProps) {
  if (piece.availability === "Available") {
    return (
      <Button
        variant="contained"
        size="large"
        sx={{ mt: 2 }}
        onClick={openModal}
      >
        Available for ${piece.price}
      </Button>
    );
  }

  return (
    <Stack direction="row" alignItems="center" pt={2}>
      <StyledDot />
      <Typography sx={{ fontWeight: 500, lineHeight: 1, opacity: 0.6 }}>
        {piece.availability}
      </Typography>
    </Stack>
  );
}
