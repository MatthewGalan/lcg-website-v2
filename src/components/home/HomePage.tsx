import React from "react";
import { useLayoutAndPieces } from "../LayoutAndPiecesProvider";
import { Box, Stack } from "@mui/material";
import styled from "styled-components";
import Thumbnail from "./Thumbnail";
import MiniLogoSVG from "../../assets/mini_logo.svg";
import LoadingSpinner from "../common/LoadingSpinner";
import AboutMe from "./AboutMe";

const StyledLogo = styled.div`
  margin: 64px 0 16px 0;
  text-align: center;

  .lori {
    font-size: 31px;
    letter-spacing: 2px;
  }

  .originals {
    font-size: 25px;
    font-weight: 300;
    letter-spacing: 5px;
    line-height: 1;
    margin-top: 2px;
  }

  img {
    width: 300px;
  }

  @media only screen and (max-width: 768px) {
    margin: 32px auto 8px auto;

    .lori {
      font-size: 19px;
    }

    .originals {
      font-size: 14px;
      letter-spacing: 4px;
      margin-top: 0;
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
  padding: 32px 8px 24px 8px;
  background-color: white;

  @media only screen and (max-width: 768px) {
    padding: 8px 4px 24px 4px;
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
  font-size: 14px;
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
        <img src={MiniLogoSVG} alt="LCG logo" />
        <div className="lori">LORI CAPRON GALAN</div>
        <div className="originals">ORIGINALS</div>
      </StyledLogo>

      {pieces.length ? (
        <Box>
          <StyledGallery>
            {flatLayout.map((col, i) => (
              <StyledColumn key={i}>
                {col.map(
                  (piece) => piece && <Thumbnail key={piece.id} piece={piece} />
                )}
              </StyledColumn>
            ))}
          </StyledGallery>
          <AboutMe />
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
