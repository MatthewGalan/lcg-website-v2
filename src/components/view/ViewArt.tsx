import React, { useRef, useState } from "react";
import Piece from "../../types/Piece";
import styled from "styled-components";
import Availability from "./Availability";

const MAX_DIMENSION = 600;
const TOP_PEEK = 200;

const StyledDiv = styled.div<{ $width: number; $height: number }>`
  background-color: white;

  margin-top: ${TOP_PEEK}px;
  margin-bottom: 200px;
  padding-bottom: 32px;

  @media only screen and (max-width: 769px) {
    margin-bottom: 100px;
  }

  display: flex;
  flex-flow: column nowrap;
  align-items: center;

  opacity: ${(props) => (props.$width ? 1 : 0)};
  transition: opacity 0.25s;

  .art-container {
    img {
      margin: -${TOP_PEEK}px 16px 16px 16px;
      max-width: min(${(props) => props.$width}px, calc(100vw - 32px));
      max-height: ${(props) => props.$height}px;
      box-shadow: rgba(0, 0, 0, 0.2) 0 4px 8px;
    }

    .art-info {
      margin: 0 16px;
      max-width: ${(props) => props.$width}px;

      .title {
        font-weight: 700;
        font-size: 24px;
      }

      .medium {
        opacity: 0.6;
        margin-bottom: 16px;
      }

      .story {
        margin-bottom: 16px;
      }
    }
  }
`;

interface ViewArtProps {
  piece: Piece;
  openModal: () => void;
}

export default function ViewArt({ piece, openModal }: ViewArtProps) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const calcDimensions = () => {
    if (!ref.current) return;

    const { naturalWidth, naturalHeight } = ref.current;

    if (naturalWidth > naturalHeight) {
      if (naturalWidth > MAX_DIMENSION) {
        setHeight((naturalHeight * MAX_DIMENSION) / naturalWidth);
        setWidth(MAX_DIMENSION);
      }
    } else {
      if (naturalHeight > MAX_DIMENSION) {
        setHeight(MAX_DIMENSION);
        setWidth((naturalWidth * MAX_DIMENSION) / naturalHeight);
      }
    }
  };

  const medium =
    `${piece.width} x ${piece.height}" ${piece.medium} on ${piece.substrate}`.toLocaleLowerCase();

  return (
    <StyledDiv $width={width} $height={height}>
      <div className="art-container">
        <img
          src={process.env.REACT_APP_BUCKET_URL + "/" + piece.pictureId}
          alt={piece.title}
          loading="lazy"
          ref={ref}
          onLoad={calcDimensions}
        />
        <div className="art-info">
          <div className="title">{piece.title || "Untitled"}</div>
          <div className="medium">{medium}</div>
          <div className="story">{piece.story}</div>
          <Availability piece={piece} openModal={openModal} />
        </div>
      </div>
    </StyledDiv>
  );
}
