import React from "react";
import { useLayoutAndPieces } from "../LayoutAndPiecesProvider";
import { Stack } from "@mui/material";
import styled from "styled-components";
import Thumbnail from "./Thumbnail";
import LogoSVG from "../../assets/logo.svg";

const StyledLogo = styled.img`
  width: 300px;
  margin: 64px auto;

  @media only screen and (max-width: 768px) {
    width: 200px;
    margin: 32px auto;
  }
`;

const StyledGallery = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;
  justify-content: center;
  padding: 0 8px;

  @media only screen and (max-width: 768px) {
    padding: 0 4px;
  }
`;

const StyledColumn = styled.div`
  flex: 33%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  max-width: 300px;
  margin: 0 8px;

  @media only screen and (max-width: 768px) {
    margin: 0 4px;
  }
`;

const StyledFooter = styled.div`
  max-width: 600px;
  text-align: center;
  opacity: 0.5;
  margin: 64px auto;
  padding: 0 16px;
  line-height: 1.15;
`;

export default function HomePage() {
  const { layout, pieces } = useLayoutAndPieces();

  const mapPieces = (ids: string[]) =>
    ids.map((id) => pieces.find((p) => p.id === id));

  const flatLayout = [
    mapPieces(layout.left),
    mapPieces(layout.middle),
    mapPieces(layout.right),
  ];

  return (
    <Stack>
      <StyledLogo src={LogoSVG} alt="LCG logo" />

      <StyledGallery>
        {flatLayout.map((col, i) => (
          <StyledColumn key={i}>
            {col.map(
              (piece) => piece && <Thumbnail key={piece.id} piece={piece} />
            )}
          </StyledColumn>
        ))}
      </StyledGallery>

      <StyledFooter>
        © {new Date().getFullYear()} All work on this website may not be copied
        or reproduced in any format without prior consent of Lori Capron Galan.
        All rights reserved.
      </StyledFooter>
    </Stack>
  );
}
