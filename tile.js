class Tile {
    constructor(cb) {
        this.cb = cb;
        this.color = null;
        this.image = null;
        this.piece = false;
        this.type = 0;
        this.row = 0;
        this.column = 0;
        this.moves = 0;
        
        this.element = document.createElement('div');
        this.element.className = 'tile debug';
        this.element.addEventListener('click', () => this.actionPerformed());
    }

    getMoves() {
        return this.moves;
    }

    setMoves(moves) {
        this.moves = moves;
    }

    getRow() {
        return this.row;
    }

    setRow(row) {
        this.row = row;
    }

    getColumn() {
        return this.column;
    }

    setColumn(column) {
        this.column = column;
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
        this.element.dataset.type = type;
    }
    
    getColor() {
        return this.color;
    }

    setColor(color) {
        this.color = color;
        this.element.style.backgroundColor = color;
    }
    
    setClickedColor(color) {
        this.element.style.backgroundColor = color;
    }

    getImage() {
        return this.image;
    }

    setImage(image) {
        console.log("Setting image:", image);
        this.image = image;
        if (image) {
            const img = new Image();
            img.onload = () => {
                this.element.innerHTML = `<img src="${image}" alt="chess piece">`;
                console.log("Image loaded successfully");
            };
            img.onerror = () => console.error("Failed to load image:", image);
            img.src = image;
        } else {
            this.element.innerHTML = '';
        }
    }
    
    getPiece() {
        return this.piece;
    }
    
    setPiece(piece) {
        this.piece = piece;
    }

    actionPerformed() {
        try {
            this.cb.validateClick(this);
        } catch (e) {
            console.error("Click error:", e);
        }
    }
    
    highlight() {
        this.element.classList.add('highlight');
    }
    
    unhighlight() {
        this.element.classList.remove('highlight');
    }
    
    select() {
        this.element.classList.add('selected');
    }
    
    unselect() {
        this.element.classList.remove('selected');
    }
    
    showPossibleMove() {
        this.element.classList.add('possible-move');
    }
    
    hidePossibleMove() {
        this.element.classList.remove('possible-move');
    }
}
