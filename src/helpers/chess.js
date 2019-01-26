
function calculateBestMove(game) {
    var newGameMoves = game.ugly_moves();
    return newGameMoves[Math.floor(Math.random() * newGameMoves.length)];
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
    game.ugly_move(bestMove);
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