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
import { useDropzone } from "react-dropzone";
import Colors from "../Colors";
import OtherRadioGroup from "./common/OtherRadioGroup";
import useWritePiece from "../hooks/useWritePiece";
import Piece from "../types/Piece";
import LoadingSpinner from "./common/LoadingSpinner";
import Layout from "../types/Layout";
import dataUrlToBlob from "../helpers/dataUrlToBlob";

const MAX_DIMENSION = 200;

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
  medium: "Oil",
  substrate: "Stretched canvas",
  availability: "Available",
  price: 0,
};

interface AddPiecePageProps {
  layout: Layout;
}

export default function EditorPage({ layout }: AddPiecePageProps) {
  const [blob, setBlob] = useState<Blob | undefined>(undefined);
  const [fileDataUri, setFileDataUri] = useState<any>();

  const [pieceDraft, setPieceDraft] = useState<Piece>(startingPiece);

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

        canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg");
        const newBlob = dataUrlToBlob(dataUrl);

        setFileDataUri(dataUrl);
        setBlob(newBlob);
      };

      // @ts-ignore
      image.src = readerEvent.target.result;
    };

    fileReader.readAsDataURL(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const { writePiece, loading, error } = useWritePiece(layout);

  return (
    <Container maxWidth="sm">
      <Stack spacing={4} sx={{ mb: 8 }}>
        <h1>Add a piece</h1>

        {fileDataUri && (
          <StyledImagePreview>
            <img className="art" src={fileDataUri} alt="Artwork preview" />
            <IconButton
              size="small"
              sx={{ boxShadow: 1 }}
              onClick={() => {
                setBlob(undefined);
                setFileDataUri(undefined);
              }}
            >
              <ClearIcon />
            </IconButton>
          </StyledImagePreview>
        )}

        {!fileDataUri && (
          <StyledDropzone {...getRootProps()} isDragActive={isDragActive}>
            <FileUploadIcon />
            <input {...getInputProps()} />
            Select image
          </StyledDropzone>
        )}

        <TextField
          label="Title"
          onChange={(e) =>
            setPieceDraft({ ...pieceDraft, title: e.target.value })
          }
        />

        <TextField
          label="Story"
          multiline
          rows={4}
          onChange={(e) =>
            setPieceDraft({ ...pieceDraft, story: e.target.value })
          }
        />

        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            label="Width"
            sx={{ width: 100 }}
            type="number"
            onChange={(e) =>
              setPieceDraft({ ...pieceDraft, width: parseInt(e.target.value) })
            }
          />
          <Typography>x</Typography>
          <TextField
            label="Height"
            sx={{ width: 100 }}
            type="number"
            onChange={(e) =>
              setPieceDraft({ ...pieceDraft, height: parseInt(e.target.value) })
            }
          />
          <Typography>inches</Typography>
        </Stack>

        <OtherRadioGroup
          label="Medium"
          options={["Oil", "Pastel", "Watercolor"]}
          onChange={(value) => setPieceDraft({ ...pieceDraft, medium: value })}
        />

        <OtherRadioGroup
          label="Substrate"
          options={[
            "Stretched canvas",
            "Masonite panel",
            "Sanded paper",
            "Watercolor paper",
          ]}
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

        {loading ? (
          <StyledLoadingSpinner />
        ) : (
          <Stack sx={{ pt: 4 }}>
            <Button
              size="large"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ py: 2 }}
              onClick={() => blob && writePiece(pieceDraft, blob)}
            >
              Add piece
            </Button>
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
