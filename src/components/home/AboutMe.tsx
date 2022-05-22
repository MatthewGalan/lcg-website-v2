import React, { useEffect, useRef } from "react";
import { Box, Link } from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

const StyledDiv = styled.div`
  max-width: 932px;
  margin: 32px auto;
  padding: 0 16px;
  position: relative;

  display: flex;
  align-items: flex-start;

  .biopic {
    width: 300px;
    margin-right: 16px;
  }

  .socials {
    display: flex;
    flex-flow: row nowrap;
    position: absolute;
    right: 20px;
    bottom: 8px;

    svg {
      width: 40px;
      height: 40px;
      color: #2e3192;
      margin-left: 7px;
    }
  }

  @media only screen and (max-width: 768px) {
    display: block;

    p,
    span {
      font-size: 15px;
    }

    .biopic {
      margin-top: 4px;
      width: 157px;
      float: left;
    }

    .socials {
      bottom: -8px;
    }
  }
`;

export default function AboutMe() {
  const location = useLocation();
  const ref = useRef();

  useEffect(() => {
    // @ts-ignore
    if (location.state?.about) {
      // @ts-ignore
      ref.current?.scrollIntoView();
    }
  });

  return (
    <Box ref={ref}>
      <StyledDiv>
        <img
          className="biopic"
          src={"https://lcg-artwork.s3.us-east-1.amazonaws.com/biopic.jpg"}
          alt="Picture of me"
          loading="lazy"
        />
        <Typography>
          <Typography fontWeight={600} component="span">
            I am fortunate to live a very creative life.
          </Typography>{" "}
          Some days I am a graphic designer, other days I am a fine artist. My
          favorite project is whatever I happen to be working on at the moment.
          Whether I am at my computer or at my easel, a creative challenge
          always excites me. The fine art in my gallery are all originals. I
          love bold, rich color and prefer painting from life. The changing
          seasons and weather of Upstate New York offer constant inspiration. I
          enjoy traveling and often take my gear along with me to paint en plein
          air. When the weather forces me inside, I will set up an unusual still
          life in my studio space. Painting brings me joy and I hope my work
          does the same for you.
          <br />
          <br />
          <Typography fontWeight={600}>Member of:</Typography>
          Rochester Art Club - Signature Member, Newsletter Editor
          <br />
          Pastel Society of Western New York
          <br />
          Greater Rochester Plein Air Painters
          <br />
          <br />
          <Typography fontWeight={600}>Contact me:</Typography>
          <a href="mailto:galanlori@gmail.com">galanlori@gmail.com</a>
        </Typography>
        <div className="socials">
          <Link href="https://www.facebook.com/loricaprongalan/">
            <FacebookIcon />
          </Link>
          <Link href="https://www.instagram.com/loricaprongalan/">
            <InstagramIcon />
          </Link>
        </div>
      </StyledDiv>
    </Box>
  );
}
