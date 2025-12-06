class RemovedPieces {
    constructor() {
        this.pieces = [];
        this.icon = "images/blank.png";
        this.blankPieces = 16;
        
        this.element = document.createElement('div');
        this.element.className = 'captured-pieces';
    }

    getPiecesSize() {
        return this.pieces.length;
    }

    setIcon(iconPath) {
        if (16 - this.blankPieces < 16) {
            const piece = document.createElement('div');
            piece.className = 'captured-piece';
            const img = document.createElement('img');
            img.src = iconPath;
            img.style.width = '100%';
            img.style.height = '100%';
            piece.appendChild(img);
            this.element.appendChild(piece);
            this.pieces.push(piece);
            this.blankPieces--;
        }
    }
}
