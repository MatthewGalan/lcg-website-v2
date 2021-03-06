import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Piece from "../../types/Piece";
import { Typography } from "@mui/material";

const StyledLink = styled(Link)<{ $available: boolean; $topPadding: number }>`
  position: relative;

  margin-bottom: 16px;

  .image-container {
    position: relative;
    width: 100%;
    padding-top: ${(props) => props.$topPadding}%;
    background-color: #eceae7;
    z-index: 1;
    transition: margin 0.25s, box-shadow 0.25s;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
  }

  .availability {
    position: absolute;
    left: 8px;
    bottom: 8px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    font-size: 12px;
    color: black;
    transition: bottom 0.25s;

    span {
      text-transform: uppercase;
    }

    .dot {
      width: 8px;
      height: 8px;
      margin-right: 8px;
      border-radius: 50%;

      background-color: ${(props) =>
        props.$available ? "#eb4928" : "#789f3f"};

      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.33);
    }
  }

  // Only do the hover effect for non-mobile
  @media only screen and (min-width: 769px) {
    &:hover {
      // Lift up even more to make room for the dot description to come down
      padding-bottom: 16px;

      .image-container {
        margin-top: -8px;
        margin-bottom: 8px;
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
      }

      .availability {
        bottom: 0;
      }
    }
  }

  @media only screen and (max-width: 768px) {
    margin-bottom: 8px;
  }

  transition: padding 0.25s;
`;

interface ThumbnailProps {
  piece: Piece;
}

export default function Thumbnail({ piece }: ThumbnailProps) {
  const available = piece.availability !== "Available";

  return (
    <StyledLink
      to={`/view/${piece.id}`}
      $available={available}
      $topPadding={(100 * piece.imageHeight) / piece.imageWidth}
    >
      <div className="image-container">
        <img
          src={process.env.REACT_APP_BUCKET_URL + "/" + piece.pictureId}
          alt={piece.title}
          loading="lazy"
        />
      </div>

      <div className="availability">
        <div className="dot" />
        <span>
          {piece.availability}
          <Typography sx={{ opacity: 0.7 }} component="span" fontSize="inherit">
            {" "}
            - CLICK FOR DETAILS
          </Typography>
        </span>
      </div>
    </StyledLink>
  );
}
