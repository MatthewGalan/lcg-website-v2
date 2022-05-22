import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, Stack } from "@mui/material";
import { useLayoutAndPieces } from "../LayoutAndPiecesProvider";
import ViewArt from "./ViewArt";
import styled from "styled-components";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LogoSVG from "../../assets/logo.svg";
import FixedHeader from "./FixedHeader";

const StyledModalContents = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 32px;
  width: min(calc(100vw - 120px), 450px);
  display: flex;
  flex-flow: column nowrap;

  .modal-logo {
    width: 200px;
    margin: 0 auto 32px auto;
  }

  .modal-tag {
    font-weight: 700;
    font-size: 24px;
    margin-bottom: 8px;
  }

  .contact {
    margin: 0 auto;

    .contact-row {
      display: flex;
      align-items: center;
      margin-top: 32px;

      &:last-child {
        margin-top: 16px;
      }

      a {
        text-decoration: none;
        line-height: 1;
        color: #2e3192;
      }

      svg {
        margin-right: 8px;
        color: #2e3192;
      }
    }
  }
`;

export default function ViewPage() {
  const { id } = useParams();
  const { layout, pieces } = useLayoutAndPieces();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const flatLayout = [...layout.left, ...layout.middle, ...layout.right];

  let flatPieces = flatLayout.map((pieceId) =>
    pieces.find((p) => p.id === pieceId)
  );

  let startIndex = flatPieces.findIndex((p) => p?.id === id);

  if (startIndex === -1) startIndex = 0;

  flatPieces = [
    ...flatPieces.slice(startIndex),
    ...flatPieces.slice(0, startIndex),
  ];

  return (
    <div>
      <FixedHeader />
      <Stack pt={16}>
        {flatPieces.map(
          (piece) =>
            piece && (
              <ViewArt
                key={piece.id}
                piece={piece}
                openModal={() => setModalOpen(true)}
              />
            )
        )}
      </Stack>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <StyledModalContents>
          <img className="modal-logo" src={LogoSVG} alt="LCG logo" />

          <div className="modal-tag">Interesting in purchasing this piece?</div>
          <div className="modal-desc">
            I would love to get in touch to discuss delivery, framing, and
            payment. Please reach out via email or phone.
          </div>
          <div className="contact">
            <div className="contact-row">
              <PhoneIcon />
              <a href="tel:+5857032817">585·703·2817</a>
            </div>
            <div className="contact-row">
              <EmailIcon />
              <a href="mailto:galanlori@gmail.com">galanlori@gmail.com</a>
            </div>
          </div>
        </StyledModalContents>
      </Modal>
    </div>
  );
}
