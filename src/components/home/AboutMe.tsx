import React, { useEffect, useRef } from "react";
import { Stack, useMediaQuery } from "@mui/material";
import BiopicPNG from "../../assets/biopic.png";
import Typography from "@mui/material/Typography";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

const StyledBiopic = styled.img`
  width: 300px;

  @media only screen and (max-width: 768px) {
    width: 150px;
  }
`;

export default function AboutMe() {
  const location = useLocation();
  const widescreen = useMediaQuery("(min-width: 769px)");
  const ref = useRef();

  useEffect(() => {
    // @ts-ignore
    if (location.state?.about) {
      // @ts-ignore
      ref.current?.scrollIntoView();
    }
  });

  return (
    <Stack
      ref={ref}
      direction={widescreen ? "row" : "column"}
      spacing={widescreen ? 4 : 2}
      alignItems={widescreen ? "flex-start" : "center"}
      sx={{ maxWidth: 932, mx: "auto", mt: 4, px: 2 }}
    >
      <StyledBiopic src={BiopicPNG} />
      <Typography>
        <Typography fontWeight={700} component="span">
          I am fortunate to live a very creative life.
        </Typography>{" "}
        Some days I am a graphic designer, other days I am a fine artist. My
        favorite project is whatever I happen to be working on at the moment.
        Whether I am at my computer or at my easel, a creative challenge always
        excites me. The fine art in my gallery are all originals. I love bold,
        rich color and prefer painting from life. The changing seasons and
        weather of Upstate New York offer constant inspiration. I enjoy
        traveling and often take my gear along with me to paint en plein air.
        When the weather forces me inside, I will set up an unusual still life
        in my studio space. Painting brings me joy and I hope my work does the
        same for you.
        <br />
        <br />
        <Typography fontWeight={500}>Member of:</Typography>
        Rochester Art Club - Signature Member, Newsletter Editor
        <br />
        Pastel Society of Western New York
        <br />
        Greater Rochester Plein Air Painters
        <br />
        <br />
        <Typography fontWeight={500}>Contact me:</Typography>
        <a href="mailto:galanlori@gmail.com">galanlori@gmail.com</a>
      </Typography>
    </Stack>
  );
}
