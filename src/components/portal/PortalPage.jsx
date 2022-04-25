import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Stack } from "@mui/material";
import colors from "../../Colors";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import styled from "styled-components";
import PortalHeader from "./PortalHeader";
import UnsavedChanges from "./UnsavedChanges";
import { useNavigate } from "react-router-dom";
import { useLayoutAndPieces } from "../LayoutAndPiecesProvider";

const StyledHiddenHeader = styled.div`
  display: flex;
  color: ${colors.red};
  margin-bottom: 8px;
  margin-top: -33px;
  opacity: ${(props) => (props.index === 0 ? 1 : 0)};

  .hidden-text {
    margin-left: 8px;
    font-weight: 500;
  }
`;

const StyledImage = styled.img`
  width: 250px;
`;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  margin: "0 0 16px 0",
  ...draggableStyle,
});

const getListStyle = (index) => {
  const hiddenListStyle =
    index === 0
      ? {
          border: `1px solid ${colors.red}`,
          padding: 16,
          marginRight: 48,
          background: "#efe2df",
        }
      : {};

  return {
    width: 250,
    marginRight: 16,
    ...hiddenListStyle,
    paddingTop: 41,
  };
};

export function getImgSrcFromPieceId(pieceId, pieces) {
  const piece = pieces.find((p) => p.id === pieceId);

  if (!piece) return "";

  return process.env.REACT_APP_BUCKET_URL + "/" + piece.pictureId;
}

export default function PortalPage() {
  const navigate = useNavigate();
  const { layout, pieces } = useLayoutAndPieces();

  const [cloudLayout, setCloudLayout] = useState([]);
  const [localLayout, setLocalLayout] = useState([]);

  useEffect(() => {
    if (!layout) return;
    const { hidden, left, middle, right } = layout;
    const flatLayout = [hidden, left, middle, right];
    setCloudLayout(flatLayout);
    setLocalLayout(flatLayout);
  }, [layout, setCloudLayout, setLocalLayout]);

  function onDragEnd(result) {
    const { source, destination } = result;

    // Dropped out of bounds
    if (!destination) return;

    const sourceId = +source.droppableId;
    const destinationId = +destination.droppableId;

    if (sourceId === destinationId) {
      // Moved within a column
      const items = reorder(
        localLayout[sourceId],
        source.index,
        destination.index
      );

      const newState = [...localLayout];
      newState[sourceId] = items;
      setLocalLayout(newState);
    } else {
      // Moved to a different column
      const result = move(
        localLayout[sourceId],
        localLayout[destinationId],
        source,
        destination
      );

      const newState = [...localLayout];
      newState[sourceId] = result[sourceId];
      newState[destinationId] = result[destinationId];
      setLocalLayout(newState);
    }
  }

  return (
    <div>
      <UnsavedChanges
        localLayout={localLayout}
        cloudLayout={cloudLayout}
        setLayouts={(layout) => {
          setLocalLayout(layout);
          setCloudLayout(layout);
        }}
      />

      <PortalHeader />

      <Stack direction="row" justifyContent="center">
        <DragDropContext onDragEnd={onDragEnd}>
          {localLayout.map((column, index) => (
            <Droppable key={index} droppableId={"" + index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(index)}
                  {...provided.droppableProps}
                >
                  <StyledHiddenHeader index={index}>
                    <VisibilityOffIcon />
                    <div className="hidden-text">HIDDEN</div>
                  </StyledHiddenHeader>

                  {column.map((pieceId, index) => (
                    <Draggable
                      key={pieceId}
                      draggableId={pieceId}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                            }}
                            onClick={() =>
                              navigate(`/portal/editor/${pieceId}`)
                            }
                          >
                            <StyledImage
                              src={getImgSrcFromPieceId(pieceId, pieces)}
                              alt=""
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </Stack>
    </div>
  );
}
