import React, { useEffect, useState } from "react";
import { Button, Paper, Snackbar, Stack, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import lcgFetch from "../../helpers/lcgFetch";
import LoadingSpinner from "../common/LoadingSpinner";

enum SaveState {
  NONE,
  SAVING,
  SUCCESS,
  FAILURE,
}

interface UnsavedChangesProps {
  localLayout: string[][];
  cloudLayout: string[][];
  setLayouts: (layout: string[][]) => void;
}

export default function UnsavedChanges({
  localLayout,
  cloudLayout,
  setLayouts,
}: UnsavedChangesProps) {
  const [saveState, setSaveState] = useState<SaveState>(SaveState.NONE);
  const [autoHidden, setAutoHidden] = useState<boolean>(false);

  useEffect(() => setAutoHidden(false), [localLayout, cloudLayout]);

  function saveLayout() {
    setSaveState(SaveState.SAVING);

    lcgFetch({
      endpoint: "/write-layout",
      method: "POST",
      body: JSON.stringify({
        hidden: localLayout[0],
        left: localLayout[1],
        middle: localLayout[2],
        right: localLayout[3],
      }),
    })
      .then((response) => {
        if (response.ok) {
          setSaveState(SaveState.SUCCESS);
        } else {
          console.log(response.statusText);
          setSaveState(SaveState.FAILURE);
        }
      })
      .catch((e) => setSaveState(SaveState.FAILURE));
  }

  const hasUnsavedChanges =
    JSON.stringify(cloudLayout) !== JSON.stringify(localLayout);

  return (
    <Snackbar
      open={hasUnsavedChanges && !autoHidden}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      autoHideDuration={saveState === SaveState.SUCCESS ? 3000 : null}
      onClose={(_, reason) => {
        if (reason !== "timeout") return;
        setAutoHidden(true);
      }}
    >
      <Paper elevation={4} sx={{ p: 2, width: 450 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
          sx={{ height: 37 }}
        >
          <Contents
            saveState={saveState}
            revertLayout={() => setLayouts(cloudLayout)}
            saveLayout={saveLayout}
          />
        </Stack>
      </Paper>
    </Snackbar>
  );
}

interface ContentsProps {
  saveState: SaveState;
  revertLayout: () => void;
  saveLayout: () => void;
}

function Contents({ saveState, revertLayout, saveLayout }: ContentsProps) {
  switch (saveState) {
    case SaveState.NONE:
      return (
        <>
          <SaveIcon />
          <Typography sx={{ flex: 1 }}>You have unsaved changes.</Typography>
          <Button onClick={revertLayout}>Revert</Button>
          <Button variant="contained" onClick={saveLayout}>
            Save
          </Button>
        </>
      );
    case SaveState.SAVING:
      return (
        <>
          <LoadingSpinner />
          <Typography sx={{ pl: 2 }}>Saving...</Typography>
        </>
      );
    case SaveState.SUCCESS:
      return (
        <>
          <CheckIcon />
          <Typography>Saved successfully.</Typography>
        </>
      );
    case SaveState.FAILURE:
      return (
        <>
          <ErrorIcon />
          <Typography>Failed to save.</Typography>
        </>
      );
  }
}
