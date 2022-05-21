import React from "react";
import { useLayoutAndPieces } from "../LayoutAndPiecesProvider";
import { Box, Stack } from "@mui/material";
import styled from "styled-components";
import Thumbnail from "./Thumbnail";
import LogoSVG from "../../assets/logo.svg";
import LoadingSpinner from "../common/LoadingSpinner";
import AboutMe from "./AboutMe";

const StyledLogo = styled.div`
  margin: 64px auto 16px auto;

  .originals {
    text-align: center;
    font-size: 18px;
    font-weight: 300;
    letter-spacing: 4px;
    line-height: 1;
    margin-top: 12px;
  }

  img {
    width: 300px;
  }

  @media only screen and (max-width: 768px) {
    margin: 32px auto 8px auto;

    .originals {
      font-size: 14px;
      margin-top: 4px;
    }

    img {
      width: 200px;
    }
  }
`;

const StyledGallery = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;
  justify-content: center;
  padding: 32px 8px 0 8px;

  @media only screen and (max-width: 768px) {
    padding: 8px 4px 0 4px;
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
      <StyledLogo>
        <img src={LogoSVG} alt="LCG logo" />
        <div className="originals">ORIGINALS</div>
      </StyledLogo>

      {pieces.length ? (
        <Box sx={{ backgroundColor: "white" }}>
          <AboutMe />
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
            © {new Date().getFullYear()} All work on this website may not be
            copied or reproduced in any format without prior consent of Lori
            Capron Galan. All rights reserved.
          </StyledFooter>
        </Box>
      ) : (
        <Box sx={{ pt: 8, pb: 200, backgroundColor: "white" }}>
          <LoadingSpinner />
        </Box>
      )}
    </Stack>
  );
}
