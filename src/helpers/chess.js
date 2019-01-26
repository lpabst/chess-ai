
function calculateBestMove(game) {
    var newGameMoves = game.moves();
    var bestMove = null;
    var bestValue = -999999;
    // console.log(newGameMoves);
    for (var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i];
        game.move(newGameMove);
        var value = minimax(2, game, true);
        game.undo();
        if (value > bestValue) {
            console.log(value);
            console.log('found one!')
            bestValue = value;
            bestMove = newGameMove
        }
    }
    return bestMove;
};

function evaluateBoard(game = window.game) {
    let points = 0;
    let board = game.fen().split(' ')[0];
    let piecePoints = {
        p: 1,
        n: 3,
        b: 3,
        r: 5,
        q: 9,
        k: 90,
        P: -1,
        N: -3,
        B: -3,
        R: -5,
        Q: -9,
        K: -90,
    }
    for (let i = 0; i < board.length; i++) {
        let piece = board.charAt(i);
        let pointsInSquare = piecePoints[piece] || 0;
        points += pointsInSquare;
    }
    // console.log(board)
    // console.log(points);
    return points;
}

// TODO: this is currently really slow. Need to speed it up a bit
function minimax(depth, game, isMaximisingPlayer) {
    if (depth === 0) return evaluateBoard();
    var newGameMoves = game.moves();
    var bestMove = isMaximisingPlayer ? -99999 : 99999;
    for (var i = 0; i < newGameMoves.length; i++) {
        game.move(newGameMoves[i]);
        bestMove = isMaximisingPlayer
            ? Math.max(bestMove, minimax(depth - 1, game, !isMaximisingPlayer))
            : Math.min(bestMove, minimax(depth - 1, game, !isMaximisingPlayer))
        game.undo();
    }
    return bestMove;
};

function onDragStart(source, piece, position, orientation) {
    let game = window.game;
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

function makeBestMove() {
    let board = window.board;
    let game = window.game;
    var bestMove = getBestMove(game);
    game.move(bestMove);
    board.position(game.fen());
    renderMoveHistory(game.history());
    if (game.game_over()) {
        alert('Game over');
    }
};

function getBestMove(game) {
    if (game.game_over()) {
        alert('Game over');
    }
    var bestMove = calculateBestMove(game);
    return bestMove;
};

function renderMoveHistory(moves) {
    let $ = window.$
    var historyElement = $('#move-history').empty();
    historyElement.empty();
    for (var i = 0; i < moves.length; i = i + 2) {
        historyElement.append('<span>' + moves[i] + ' ' + (moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
    }
    historyElement.scrollTop(historyElement[0].scrollHeight);

};

function onDrop(source, target) {
    let game = window.game;
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });
    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }
    renderMoveHistory(game.history());
    window.setTimeout(makeBestMove, 250);
};

function onSnapEnd() {
    let board = window.board;
    let game = window.game;
    board.position(game.fen());
};

function onMouseoverSquare(square, piece) {
    let game = window.game;
    var moves = game.moves({
        square: square,
        verbose: true
    });
    if (moves.length === 0) return;
    greySquare(square);
    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

function onMouseoutSquare(square, piece) {
    removeGreySquares();
};

function removeGreySquares() {
    let $ = window.$
    $('#board .square-55d63').css('background', '');
};

function greySquare(square) {
    let $ = window.$
    var squareEl = $('#board .square-' + square);
    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true)
        background = '#696969';
    squareEl.css('background', background);
};

export {
    calculateBestMove,
    onDragStart,
    makeBestMove,
    getBestMove,
    renderMoveHistory,
    onDrop,
    onSnapEnd,
    onMouseoverSquare,
    onMouseoutSquare,
    removeGreySquares,
    greySquare
}