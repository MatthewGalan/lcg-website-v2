import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Piece from "../../types/Piece";

const StyledLink = styled(Link)<{ $isAvailable: boolean }>`
  position: relative;

  margin-bottom: 16px;

  img {
    width: 100%;
    height: auto;
    display: block;
    cursor: pointer;

    transition: margin 0.25s, box-shadow 0.25s;
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
      z-index: -1;
      text-transform: uppercase;
    }

    .dot {
      width: 8px;
      height: 8px;
      margin-right: 8px;
      border-radius: 50%;
      background-color: #eb4928;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.33);
      transition: background-color 0.25s, opacity 0.5s;
    }
  }

  // Only do the hover effect for non-mobile
  @media only screen and (min-width: 769px) {
    &:hover {
      // Lift up even more to make room for the dot description to come down
      padding-bottom: ${(props) => (props.$isAvailable ? 16 : 0)}px;

      img {
        margin-top: -8px;
        margin-bottom: 8px;
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
      }

      .availability {
        bottom: 0;

        .dot {
          background-color: #be4f38;
        }
      }
    }
  }

  @media only screen and (max-width: 768px) {
    margin-bottom: 8px;

    .availability {
      .dot {
        margin: 0;
      }

      // Don't show dot descriptions on mobile
      span {
        display: none;
      }
    }
  }

  transition: padding 0.25s;
`;

interface ThumbnailProps {
  piece: Piece;
}

export default function Thumbnail({ piece }: ThumbnailProps) {
  const isAvailable = piece.availability !== "Available";

  return (
    <StyledLink to={`/view/${piece.id}`} $isAvailable={isAvailable}>
      <img
        src={process.env.REACT_APP_BUCKET_URL + "/" + piece.pictureId}
        alt={piece.title}
      />

      {isAvailable && (
        <div className="availability">
          <div className="dot" />
          <span>{piece.availability}</span>
        </div>
      )}
    </StyledLink>
  );
}
