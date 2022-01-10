export default interface Piece {
  id?: string;
  pictureId?: string;
  columnIndex?: number;
  columnDepth?: number;
  nextPieceId?: string;
  title: string;
  story: string;
  width: number;
  height: number;
  medium: string;
  substrate: string;
  availability: string;
  price: number;
}
