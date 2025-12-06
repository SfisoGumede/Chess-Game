class ChessBoard {
    constructor() {
        this.currentRound = 0;
        this.EMPTY = 0;
        this.CASTLE_BLACK = 1;
        this.KNIGHT_BLACK = 2;
        this.BISHOP_BLACK = 3;
        this.KING_BLACK = 4;
        this.QUEEN_BLACK = 5;
        this.PAWN_BLACK = 6;
        this.CASTLE_WHITE = 7;
        this.KNIGHT_WHITE = 8;
        this.BISHOP_WHITE = 9;
        this.KING_WHITE = 10;
        this.QUEEN_WHITE = 11;
        this.PAWN_WHITE = 12;

        console.log("Piece type constants:", {
            EMPTY: this.EMPTY,
            CASTLE_BLACK: this.CASTLE_BLACK,
            PAWN_WHITE: this.PAWN_WHITE,
            CASTLE_WHITE: this.CASTLE_WHITE,
            KING_BLACK: this.KING_BLACK,
            KING_WHITE: this.KING_WHITE
        });

        this.columns = ["A", "B", "C", "D", "E", "F", "G", "H"];
        this.rows = ["1", "2", "3", "4", "5", "6", "7", "8"];

        this.tiles = Array.from({ length: 8 }, () => new Array(8));
        this.panRemPieces = [new RemovedPieces(), new RemovedPieces()];
        this.icon = [[], []];
        this.clickedTiles = [];
        this.possibleMoves = [];

        this.element = document.getElementById('chess-board');
        this.blackCaptured = document.getElementById('black-captured');
        this.whiteCaptured = document.getElementById('white-captured');
        this.turnIndicator = document.getElementById('turn-indicator');

        this.blackCaptured.appendChild(this.panRemPieces[0].element);
        this.whiteCaptured.appendChild(this.panRemPieces[1].element);

        this.loadPieceImages();
        this.createBoard();
    }

    loadPieceImages() {
        // Black pieces
     this.icon[0][0] = "images/black_rook.svg";
     this.icon[0][1] = "images/black_knight.svg";
     this.icon[0][2] = "images/black_bishop.svg";
     this.icon[0][3] = "images/black_king.svg";
     this.icon[0][4] = "images/black_queen.svg";
     this.icon[0][5] = "images/black_pawn.svg";

// White pieces
     this.icon[1][0] = "images/white_rook.svg";
     this.icon[1][1] = "images/white_knight.svg";
     this.icon[1][2] = "images/white_bishop.svg";
     this.icon[1][3] = "images/white_king.svg";
     this.icon[1][4] = "images/white_queen.svg";
     this.icon[1][5] = "images/white_pawn.svg";
    }

    createBoard() {
        this.element.innerHTML = '';

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                this.tiles[r][c] = new Tile(this);
                this.tiles[r][c].setRow(r);
                this.tiles[r][c].setColumn(c);

                if ((r + c) % 2 !== 0) {
                    this.tiles[r][c].setColor('#769656'); // Dark squares
                } else {
                    this.tiles[r][c].setColor('#eeeed2'); // Light squares
                }

                this.initializePiece(r, c);
                this.element.appendChild(this.tiles[r][c].element);
            }
        }

        this.updateTurnIndicator();
    }

    initializePiece(r, c) {
        // Black pieces (top rows)
        if (r === 0) {
            if (c === 0 || c === 7) {
                this.setPiece(r, c, this.CASTLE_BLACK, this.icon[0][0]);
            } else if (c === 1 || c === 6) {
                this.setPiece(r, c, this.KNIGHT_BLACK, this.icon[0][1]);
            } else if (c === 2 || c === 5) {
                this.setPiece(r, c, this.BISHOP_BLACK, this.icon[0][2]);
            } else if (c === 3) {
                this.setPiece(r, c, this.QUEEN_BLACK, this.icon[0][4]);
            } else if (c === 4) {
                this.setPiece(r, c, this.KING_BLACK, this.icon[0][3]);
            }
        } else if (r === 1) {
            this.setPiece(r, c, this.PAWN_BLACK, this.icon[0][5]);
        }
        // White pieces (bottom rows)
        else if (r === 7) {
            if (c === 0 || c === 7) {
                this.setPiece(r, c, this.CASTLE_WHITE, this.icon[1][0]);
            } else if (c === 1 || c === 6) {
                this.setPiece(r, c, this.KNIGHT_WHITE, this.icon[1][1]);
            } else if (c === 2 || c === 5) {
                this.setPiece(r, c, this.BISHOP_WHITE, this.icon[1][2]);
            } else if (c === 3) {
                this.setPiece(r, c, this.QUEEN_WHITE, this.icon[1][4]);
            } else if (c === 4) {
                this.setPiece(r, c, this.KING_WHITE, this.icon[1][3]);
            }
        } else if (r === 6) {
            this.setPiece(r, c, this.PAWN_WHITE, this.icon[1][5]);
        }
    }

    setPiece(row, col, type, image) {
        this.tiles[row][col].setImage(image);
        this.tiles[row][col].setPiece(true);
        this.tiles[row][col].setType(type);
    }

    updateTurnIndicator() {
        this.turnIndicator.textContent = this.currentRound % 2 === 0 ? 
            "White's Turn" : "Black's Turn";
    }

    validateClick(tile) {
        console.group("Move Validation");
console.log("Current round:", this.currentRound);
console.log("Current turn:", this.currentRound % 2 === 0 ? "White" : "Black");

// ... rest of your existing validateClick code ...


        console.log(`Turn ${this.currentRound} - ${this.currentRound % 2 === 0 ? 'White' : 'Black'}'s turn`);
        console.log(`Clicked tile: ${tile.getRow()},${tile.getColumn()} Type: ${tile.getType()}`);
        
        this.clearPossibleMoves();

        if (this.clickedTiles.length === 0) {
            if (tile.getPiece()) {
                const isWhitePiece = tile.getType() >= this.CASTLE_WHITE;
                if ((this.currentRound % 2 === 0 && isWhitePiece) || 
                    (this.currentRound % 2 === 1 && !isWhitePiece)) {
                    
                    this.clickedTiles.push(tile);
                    tile.select();
                    this.showPossibleMoves(tile);
                    return;
                } else {
                    alert(`It's ${this.currentRound % 2 === 0 ? "White" : "Black"}'s turn!`);
                    return;
                }
            }
        } else {
            const selectedTile = this.clickedTiles[0];
            
            if (selectedTile === tile) {
                selectedTile.unselect();
                this.clickedTiles = [];
                return;
            }

            if (this.validateMove(tile)) {
                this.movePiece(tile);
                this.currentRound++;
                this.updateTurnIndicator();
            } else {
                alert("Invalid move!");
            }

            selectedTile.unselect();
            this.clickedTiles = [];
        }
        
    }

    showPossibleMoves(tile) {
        const row = tile.getRow();
        const col = tile.getColumn();
        const type = tile.getType();

        this.clearPossibleMoves();

        switch(type) {
            case this.PAWN_WHITE:
                if (row > 0 && !this.tiles[row-1][col].getPiece()) {
                    this.tiles[row-1][col].showPossibleMove();
                    this.possibleMoves.push(this.tiles[row-1][col]);
                }
                if (row > 0 && col > 0 && this.tiles[row-1][col-1].getPiece() && 
                    this.tiles[row-1][col-1].getType() < this.CASTLE_WHITE) {
                    this.tiles[row-1][col-1].showPossibleMove();
                    this.possibleMoves.push(this.tiles[row-1][col-1]);
                }
                if (row > 0 && col < 7 && this.tiles[row-1][col+1].getPiece() && 
                    this.tiles[row-1][col+1].getType() < this.CASTLE_WHITE) {
                    this.tiles[row-1][col+1].showPossibleMove();
                    this.possibleMoves.push(this.tiles[row-1][col+1]);
                }
                break;
                
            case this.PAWN_BLACK:
                if (row < 7 && !this.tiles[row+1][col].getPiece()) {
                    this.tiles[row+1][col].showPossibleMove();
                    this.possibleMoves.push(this.tiles[row+1][col]);
                }
                if (row < 7 && col > 0 && this.tiles[row+1][col-1].getPiece() && 
                    this.tiles[row+1][col-1].getType() >= this.CASTLE_WHITE) {
                    this.tiles[row+1][col-1].showPossibleMove();
                    this.possibleMoves.push(this.tiles[row+1][col-1]);
                }
                if (row < 7 && col < 7 && this.tiles[row+1][col+1].getPiece() && 
                    this.tiles[row+1][col+1].getType() >= this.CASTLE_WHITE) {
                    this.tiles[row+1][col+1].showPossibleMove();
                    this.possibleMoves.push(this.tiles[row+1][col+1]);
                }
                break;
                
            case this.KNIGHT_WHITE:
            case this.KNIGHT_BLACK:
                const knightMoves = [
                    [row-2, col-1], [row-2, col+1],
                    [row-1, col-2], [row-1, col+2],
                    [row+1, col-2], [row+1, col+2],
                    [row+2, col-1], [row+2, col+1]
                ];
                
                knightMoves.forEach(([r, c]) => {
                    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                        const targetTile = this.tiles[r][c];
                        if (!targetTile.getPiece() || 
                            (type >= this.CASTLE_WHITE && targetTile.getType() < this.CASTLE_WHITE) ||
                            (type < this.CASTLE_WHITE && targetTile.getType() >= this.CASTLE_WHITE)) {
                            targetTile.showPossibleMove();
                            this.possibleMoves.push(targetTile);
                        }
                    }
                });
                break;
                
            default:
                for (let r = Math.max(0, row-1); r <= Math.min(7, row+1); r++) {
                    for (let c = Math.max(0, col-1); c <= Math.min(7, col+1); c++) {
                        if (r !== row || c !== col) {
                            const targetTile = this.tiles[r][c];
                            if (!targetTile.getPiece() || 
                                (type >= this.CASTLE_WHITE && targetTile.getType() < this.CASTLE_WHITE) ||
                                (type < this.CASTLE_WHITE && targetTile.getType() >= this.CASTLE_WHITE)) {
                                targetTile.showPossibleMove();
                                this.possibleMoves.push(targetTile);
                            }
                        }
                    }
                }
        }
    }

    clearPossibleMoves() {
        this.possibleMoves.forEach(tile => tile.hidePossibleMove());
        this.possibleMoves = [];
    }

    validateMove(targetTile) {
const sourceTile = this.clickedTiles[0];
if (!sourceTile) {
console.error("No source tile selected");
return false;
}

// Debug output
console.log(`Attempting move from (${sourceTile.getRow()},${sourceTile.getColumn()}) to (${targetTile.getRow()},${targetTile.getColumn()})`);
console.log(`Source type: ${sourceTile.getType()}, Target type: ${targetTile.getType()}`);

// 1. Check if moving to same position
if (sourceTile === targetTile) {
console.log("Same tile clicked");
return false;
}

// 2. Check turn rules
const isWhiteTurn = this.currentRound % 2 === 0;
const isWhitePiece = sourceTile.getType() >= this.CASTLE_WHITE;

if ((isWhiteTurn && !isWhitePiece) || (!isWhiteTurn && isWhitePiece)) {
console.log("Wrong turn for this piece");
return false;
}

// 3. Check if capturing own piece
if (targetTile.getPiece() && 
((isWhitePiece && targetTile.getType() >= this.CASTLE_WHITE) || 
 (!isWhitePiece && targetTile.getType() < this.CASTLE_WHITE))) {
console.log("Can't capture your own piece");
return false;
}

// 4. Calculate movement deltas
const dRow = targetTile.getRow() - sourceTile.getRow();
const dCol = targetTile.getColumn() - sourceTile.getColumn();
const absRow = Math.abs(dRow);
const absCol = Math.abs(dCol);

// 5. Piece-specific movement rules
switch(sourceTile.getType()) {
case this.PAWN_WHITE:
    // Forward move
    if (dCol === 0) {
        // Single move forward
        if (dRow === -1 && !targetTile.getPiece()) return true;
        // Double move from starting position
        if (sourceTile.getRow() === 6 && dRow === -2 && !targetTile.getPiece() && 
            !this.tiles[sourceTile.getRow()-1][sourceTile.getColumn()].getPiece()) return true;
    }
    // Capture move
    else if (absCol === 1 && dRow === -1 && targetTile.getPiece()) {
        return true;
    }
    break;

case this.PAWN_BLACK:
    // Forward move
    if (dCol === 0) {
        // Single move forward
        if (dRow === 1 && !targetTile.getPiece()) return true;
        // Double move from starting position
        if (sourceTile.getRow() === 1 && dRow === 2 && !targetTile.getPiece() && 
            !this.tiles[sourceTile.getRow()+1][sourceTile.getColumn()].getPiece()) return true;
    }
    // Capture move
    else if (absCol === 1 && dRow === 1 && targetTile.getPiece()) {
        return true;
    }
    break;

case this.KNIGHT_WHITE:
case this.KNIGHT_BLACK:
    return (absRow === 2 && absCol === 1) || (absRow === 1 && absCol === 2);

case this.BISHOP_WHITE:
case this.BISHOP_BLACK:
    if (absRow !== absCol) return false;
    return this.checkClearDiagonal(sourceTile, targetTile);

case this.ROOK_WHITE:
case this.ROOK_BLACK:
    if (absRow !== 0 && absCol !== 0) return false;
    return this.checkClearStraight(sourceTile, targetTile);

case this.QUEEN_WHITE:
case this.QUEEN_BLACK:
    if (absRow !== absCol && absRow !== 0 && absCol !== 0) return false;
    if (absRow === absCol) return this.checkClearDiagonal(sourceTile, targetTile);
    return this.checkClearStraight(sourceTile, targetTile);

case this.KING_WHITE:
case this.KING_BLACK:
    return absRow <= 1 && absCol <= 1;

default:
    console.error("Unknown piece type:", sourceTile.getType());
    return false;
}

console.log("Move doesn't match any valid pattern");
return false;
}

// Helper functions
checkClearStraight(source, target) {
const rowStep = target.getRow() > source.getRow() ? 1 : -1;
const colStep = target.getColumn() > source.getColumn() ? 1 : -1;

if (source.getRow() === target.getRow()) {
// Horizontal move
for (let c = source.getColumn() + colStep; c !== target.getColumn(); c += colStep) {
    if (this.tiles[source.getRow()][c].getPiece()) return false;
}
} else {
// Vertical move
for (let r = source.getRow() + rowStep; r !== target.getRow(); r += rowStep) {
    if (this.tiles[r][source.getColumn()].getPiece()) return false;
}
}
return true;
}

checkClearDiagonal(source, target) {
const rowStep = target.getRow() > source.getRow() ? 1 : -1;
const colStep = target.getColumn() > source.getColumn() ? 1 : -1;

let r = source.getRow() + rowStep;
let c = source.getColumn() + colStep;

while (r !== target.getRow() && c !== target.getColumn()) {
if (this.tiles[r][c].getPiece()) return false;
r += rowStep;
c += colStep;
}
return true;
}
    movePiece(targetTile) {
        const sourceTile = this.clickedTiles[0];
        
        if (targetTile.getPiece()) {
            this.capturePiece(targetTile);
        }
        
        targetTile.setImage(sourceTile.getImage());
        targetTile.setPiece(true);
        targetTile.setType(sourceTile.getType());
        targetTile.setMoves(sourceTile.getMoves() + 1);
        
        sourceTile.setImage(null);
        sourceTile.setPiece(false);
        sourceTile.setType(this.EMPTY);
        sourceTile.setMoves(0);
    }

    capturePiece(tile) {
        const isWhiteCapturing = this.clickedTiles[0].getType() >= this.CASTLE_WHITE;
        
        if (tile.getType() === this.KING_BLACK || tile.getType() === this.KING_WHITE) {
            const winner = tile.getType() === this.KING_BLACK ? "White" : "Black";
            alert(`Checkmate! ${winner} wins!`);
            setTimeout(() => window.location.reload(), 2000);
            return;
        }
        
        if (isWhiteCapturing) {
            this.panRemPieces[1].setIcon(tile.getImage());
        } else {
            this.panRemPieces[0].setIcon(tile.getImage());
        }
    }
}
// document.addEventListener('DOMContentLoaded', () => {
//     const chessBoard = new ChessBoard();
//     document.getElementById('reset-button').addEventListener('click', () => {
//         window.location.reload();
//     });
// });
/*body {
            font-family: 'Arial', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
        }

        #game-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }

        #chess-board {
            display: grid;
            grid-template-columns: repeat(8, 60px);
            grid-template-rows: repeat(8, 60px);
            border: 2px solid #333;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        }

        .captured-pieces {
            display: flex;
            flex-wrap: wrap;
            width: 480px;
            min-height: 60px;
            border: 1px solid #ccc;
            background-color: #fff;
            padding: 5px;
            gap: 5px;
        }

        .captured-piece {
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #game-info {
            display: flex;
            justify-content: space-between;
            width: 480px;
            padding: 10px;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        #turn-indicator {
            font-weight: bold;
            font-size: 18px;
        }

        #reset-button {
            padding: 5px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }

        #reset-button:hover {
            background-color: #45a049;
        }

        .tile {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            font-size: 40px;
            user-select: none;
        }

        .tile img {
            width: 50px;
            height: 50px;
            pointer-events: none;
        }

        .tile.highlight {
            background-color: #8f8 !important;
        }

        .tile.selected {
            background-color: #88f !important;
        }

        .tile.possible-move {
            background-color: #ff8 !important;
        }

        .tile.debug {
            position: relative;
        }
        
        .tile.debug::after {
            content: attr(data-type);
            position: absolute;
            bottom: 2px;
            right: 2px;
            font-size: 8px;
            background: white;
            padding: 2px;
        }*/