interface BoardItem {
  id: string;
  value: string;
}

const createBoardArray = (): BoardItem[][] => {
  let board: BoardItem[][] = [];
  const rows = Array.from({ length: 7 }).fill('');

  rows.forEach((_, rowIndex) => {
    const col: BoardItem[] = Array.from({ length: 6 }).fill({
      id: `${rowIndex} `,
      value: '',
    }) as BoardItem[];
    board.push(col.map((item, colIdx) => ({ ...item, id: item.id + colIdx })));
  });

  return board;
};

export const initialBoard = createBoardArray();