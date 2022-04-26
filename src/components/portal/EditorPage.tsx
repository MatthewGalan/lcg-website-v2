import React, { useCallback, useState } from "react";
import styled from "styled-components";
import {
  Alert,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDropzone } from "react-dropzone";
import Colors from "../../Colors";
import OtherRadioGroup from "../common/OtherRadioGroup";
import useWritePiece from "../../hooks/useWritePiece";
import Piece from "../../types/Piece";
import LoadingSpinner from "../common/LoadingSpinner";
import dataUrlToBlob from "../../helpers/dataUrlToBlob";
import { useNavigate, useParams } from "react-router-dom";
import { getImgSrcFromPieceId } from "./PortalPage";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useDeletePiece from "../../hooks/useDeletePiece";
import useDeleteImage from "../../hooks/useDeleteImage";
import { useLayoutAndPieces } from "../LayoutAndPiecesProvider";

const MAX_DIMENSION = 1024;

const StyledDropzone = styled.div<{ isDragActive: boolean }>`
  border: 1px dashed ${Colors.green};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: rgba(0, 0, 0, 0.7);

  background: ${(props) =>
    props.isDragActive ? Colors.lighterGreen : "transparent"};

  &:hover {
    background: ${Colors.lighterGreen};
  }

  .MuiSvgIcon-root {
    margin-right: 8px;
  }
`;

const StyledImagePreview = styled.div`
  position: relative;
  width: fit-content;
  align-self: center;

  .art {
    max-width: 552px;
    box-shadow: rgb(0 0 0 / 20%) 0 3px 3px -2px, rgb(0 0 0 / 14%) 0 3px 4px 0,
      rgb(0 0 0 / 12%) 0 1px 8px 0;
  }

  .MuiButtonBase-root {
    background: white;
    position: absolute;
    top: -17px;
    right: -17px;
  }
`;

const StyledLoadingSpinner = styled(LoadingSpinner)`
  height: 58px;
`;

const startingPiece: Piece = {
  title: "",
  story: "",
  width: 0,
  height: 0,
  imageWidth: 0,
  imageHeight: 0,
  medium: "Oil",
  substrate: "Stretched canvas",
  availability: "Available",
  price: 0,
};

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { layout, pieces } = useLayoutAndPieces();

  const newPiece = id === "new";

  const initialDataUrl = newPiece ? "" : getImgSrcFromPieceId(id, pieces);

  const initialDraft = newPiece
    ? startingPiece
    : pieces.find((p) => p.id === id) ?? startingPiece;

  const [blob, setBlob] = useState<Blob | undefined>(undefined);
  const [dataUrl, setDataUrl] = useState<string>(initialDataUrl);

  const [pieceDraft, setPieceDraft] = useState<Piece>(initialDraft);

  const onDrop = useCallback(([selectedFile]: File[]) => {
    if (!selectedFile) return;

    if (!selectedFile.type.match(/image.*/)) {
      console.log("File must be an image");
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = (readerEvent) => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");

        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) throw new Error("Failed to get canvas context");

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        context.drawImage(image, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        const newBlob = dataUrlToBlob(dataUrl);

        setDataUrl(dataUrl);
        setBlob(newBlob);
        setPieceDraft({
          ...pieceDraft,
          imageWidth: Math.round(width),
          imageHeight: Math.round(height),
        });
      };

      // @ts-ignore
      image.src = readerEvent.target.result;
    };

    fileReader.readAsDataURL(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const { writePiece, loading, error } = useWritePiece(layout);
  const [deletePiece, deletePieceResult] = useDeletePiece();
  const [deleteImage, deleteImageResult] = useDeleteImage();

  const handleSaveClicked = async () => {
    if (!blob && !pieceDraft.pictureId) {
      window.alert("Please select an image.");
      return;
    }

    if (newPiece) {
      await writePiece(pieceDraft, { blob });
      return;
    }

    // Existing piece
    const needToUpload = newPiece || dataUrl !== initialDataUrl;

    await writePiece(pieceDraft, {
      pieceId: id,
      blob: needToUpload ? blob : undefined,
      pictureId: needToUpload ? undefined : pieceDraft.pictureId,
    });
  };

  const handleDeleteClicked = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${pieceDraft.title}"? This cannot be undone.`
      )
    ) {
      return;
    }

    if (!pieceDraft.pictureId) {
      console.error("Cannot delete piece because pictureId is undefined");
      return;
    }

    if (!id) {
      console.error("Cannot delete piece because ID is undefined");
      return;
    }

    await deleteImage(pieceDraft.pictureId);
    await deletePiece(id, layout);
  };

  return (
    <Container maxWidth="sm">
      <Stack spacing={4} sx={{ mb: 8, mt: 4 }}>
        <Stack spacing={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/portal")}
            sx={{ alignSelf: "flex-start" }}
          >
            Back to layout
          </Button>

          <Typography variant="h1" fontSize={32} fontWeight={700}>
            {newPiece ? "Add a piece" : "Edit piece"}
          </Typography>
        </Stack>

        {dataUrl && (
          <StyledImagePreview>
            <img className="art" src={dataUrl} alt="Artwork preview" />
            <IconButton
              size="small"
              sx={{ boxShadow: 1 }}
              onClick={() => {
                setBlob(undefined);
                setDataUrl("");
              }}
            >
              <ClearIcon />
            </IconButton>
          </StyledImagePreview>
        )}

        {!dataUrl && (
          <StyledDropzone {...getRootProps()} isDragActive={isDragActive}>
            <FileUploadIcon />
            <input {...getInputProps()} />
            Select image
          </StyledDropzone>
        )}

        <TextField
          label="Title"
          value={pieceDraft.title}
          onChange={(e) =>
            setPieceDraft({ ...pieceDraft, title: e.target.value })
          }
        />

        <TextField
          label="Story"
          multiline
          rows={4}
          value={pieceDraft.story}
          onChange={(e) =>
            setPieceDraft({ ...pieceDraft, story: e.target.value })
          }
        />

        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            label="Width"
            sx={{ width: 100 }}
            type="number"
            value={pieceDraft.width}
            onChange={(e) =>
              setPieceDraft({ ...pieceDraft, width: parseInt(e.target.value) })
            }
          />
          <Typography>x</Typography>
          <TextField
            label="Height"
            sx={{ width: 100 }}
            type="number"
            value={pieceDraft.height}
            onChange={(e) =>
              setPieceDraft({ ...pieceDraft, height: parseInt(e.target.value) })
            }
          />
          <Typography>inches</Typography>
        </Stack>

        <OtherRadioGroup
          label="Medium"
          options={["Oil", "Pastel", "Watercolor"]}
          value={pieceDraft.medium}
          onChange={(value) => setPieceDraft({ ...pieceDraft, medium: value })}
        />

        <OtherRadioGroup
          label="Substrate"
          options={[
            "Stretched canvas",
            "Panel",
            "Sanded paper",
            "Watercolor paper",
          ]}
          value={pieceDraft.substrate}
          onChange={(value) =>
            setPieceDraft({ ...pieceDraft, substrate: value })
          }
        />

        <FormControl component="fieldset">
          <FormLabel component="legend">Availability</FormLabel>
          <RadioGroup
            aria-label="availability"
            value={pieceDraft.availability}
            onChange={(e) =>
              setPieceDraft({ ...pieceDraft, availability: e.target.value })
            }
          >
            {["Available", "Sold", "Commissioned", "Private collection"].map(
              (availString) => (
                <FormControlLabel
                  key={availString}
                  value={availString}
                  control={<Radio />}
                  label={availString}
                />
              )
            )}
          </RadioGroup>
        </FormControl>

        {pieceDraft.availability === "Available" && (
          <TextField
            label="Price"
            type="number"
            sx={{ width: "50%" }}
            value={pieceDraft.price}
            onChange={(e) =>
              setPieceDraft({ ...pieceDraft, price: parseInt(e.target.value) })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        )}

        {loading || deleteImageResult.loading || deletePieceResult.loading ? (
          <StyledLoadingSpinner />
        ) : (
          <Stack sx={{ pt: 4 }} spacing={2}>
            <Button
              size="large"
              variant="contained"
              startIcon={newPiece ? <AddIcon /> : <SaveIcon />}
              sx={{ py: 2 }}
              onClick={handleSaveClicked}
            >
              {newPiece ? "Add piece" : "Save piece"}
            </Button>
            {!newPiece && (
              <Button
                color="error"
                size="large"
                startIcon={<DeleteIcon />}
                sx={{ py: 2 }}
                variant="outlined"
                onClick={handleDeleteClicked}
              >
                Delete piece
              </Button>
            )}
          </Stack>
        )}

        {error && (
          <Alert severity="error" variant="outlined">
            {error}
          </Alert>
        )}
      </Stack>
    </Container>
  );
}
