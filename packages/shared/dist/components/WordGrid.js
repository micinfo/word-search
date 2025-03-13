var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Add new state variables in the component
var WordGrid = function (_a) {
    var words = _a.words, onWordFound = _a.onWordFound, hintedWord = _a.hintedWord;
    var gridSize = 15; // Increased grid size to match the K-CAB puzzle
    var _b = useState(createEmptyGrid()), grid = _b[0], setGrid = _b[1];
    var _c = useState([]), selection = _c[0], setSelection = _c[1];
    var _d = useState([]), foundPositions = _d[0], setFoundPositions = _d[1];
    var _e = useState([]), placedWords = _e[0], setPlacedWords = _e[1];
    // Add state to preserve the initial grid
    var _f = useState([]), initializedGrid = _f[0], setInitializedGrid = _f[1];
    function createEmptyGrid() {
        return Array(gridSize)
            .fill(null)
            .map(function () {
            return Array(gridSize)
                .fill(null)
                .map(function () { return ({
                letter: "",
                selected: false,
                isPartOfHint: false,
                wordIndex: undefined,
            }); });
        });
    }
    // Update directions to only include horizontal, vertical, and diagonal
    var directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1], // diagonal up-left
    ];
    useEffect(function () {
        var createGrid = function () {
            var attempts = 0;
            var maxAttempts = 1000;
            var _loop_1 = function () {
                var newGrid_1 = createEmptyGrid();
                var placedWords_1 = [];
                // Shuffle directions array for each attempt
                var shuffledDirections = __spreadArray([], directions, true).sort(function () { return Math.random() - 0.5; });
                // Process words in random order while maintaining size sorting
                var processedWords = __spreadArray([], words, true).sort(function (a, b) { return b.length - a.length; })
                    .map(function (word) { return ({
                    original: word,
                    processed: word.replace(/[^A-Za-z]/g, "").toUpperCase()
                }); })
                    .sort(function (a, b) { return Math.random() - 0.5; });
                var allWordsPlaced = true;
                var _loop_2 = function (wordIndex) {
                    var word = processedWords[wordIndex].processed;
                    var isPlaced = false;
                    // Randomize starting positions
                    var positions = Array.from({ length: gridSize * gridSize }, function (_, i) { return ({
                        x: i % gridSize,
                        y: Math.floor(i / gridSize)
                    }); }).sort(function () { return Math.random() - 0.5; });
                    // Try each direction with random starting positions
                    for (var _i = 0, shuffledDirections_1 = shuffledDirections; _i < shuffledDirections_1.length; _i++) {
                        var _a = shuffledDirections_1[_i], dx = _a[0], dy = _a[1];
                        if (isPlaced)
                            break;
                        for (var _b = 0, positions_1 = positions; _b < positions_1.length; _b++) {
                            var pos = positions_1[_b];
                            if (isPlaced)
                                break;
                            var x = pos.x, y = pos.y;
                            // Calculate valid range for this word
                            var maxX = dx === 0 ? gridSize : dx > 0 ? gridSize - word.length : gridSize;
                            var maxY = dy === 0 ? gridSize : dy > 0 ? gridSize - word.length : gridSize;
                            var minX = dx < 0 ? word.length - 1 : 0;
                            var minY = dy < 0 ? word.length - 1 : 0;
                            // Try each position
                            for (var y_1 = minY; y_1 < maxY && !isPlaced; y_1++) {
                                for (var x_1 = minX; x_1 < maxX && !isPlaced; x_1++) {
                                    var canPlace = true;
                                    var positions_2 = [];
                                    // Check if word fits
                                    for (var i = 0; i < word.length && canPlace; i++) {
                                        var newX = x_1 + dx * i;
                                        var newY = y_1 + dy * i;
                                        if (newX < 0 ||
                                            newX >= gridSize ||
                                            newY < 0 ||
                                            newY >= gridSize) {
                                            canPlace = false;
                                            break;
                                        }
                                        var currentCell = newGrid_1[newY][newX];
                                        if (currentCell.letter && currentCell.letter !== word[i]) {
                                            canPlace = false;
                                            break;
                                        }
                                        positions_2.push([newX, newY]);
                                    }
                                    if (canPlace && positions_2.length === word.length) {
                                        positions_2.forEach(function (_a, i) {
                                            var posX = _a[0], posY = _a[1];
                                            newGrid_1[posY][posX] = {
                                                letter: word[i],
                                                selected: false,
                                                isPartOfHint: false,
                                                wordIndex: wordIndex,
                                            };
                                        });
                                        isPlaced = true;
                                        placedWords_1.push(processedWords[wordIndex].original);
                                    }
                                }
                            }
                        }
                    }
                    if (!isPlaced) {
                        allWordsPlaced = false;
                        return "break";
                    }
                };
                for (var wordIndex = 0; wordIndex < processedWords.length; wordIndex++) {
                    var state_2 = _loop_2(wordIndex);
                    if (state_2 === "break")
                        break;
                }
                if (allWordsPlaced) {
                    // Fill remaining cells with random letters
                    for (var y = 0; y < gridSize; y++) {
                        for (var x = 0; x < gridSize; x++) {
                            if (!newGrid_1[y][x].letter) {
                                newGrid_1[y][x].letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                            }
                        }
                    }
                    return { value: newGrid_1 };
                }
                attempts++;
            };
            while (attempts < maxAttempts) {
                var state_1 = _loop_1();
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            return createEmptyGrid();
        };
        var newGrid = createGrid();
        setGrid(newGrid);
        setInitializedGrid(JSON.parse(JSON.stringify(newGrid)));
    }, [words]);
    // Add this new useEffect to handle found words
    useEffect(function () {
        if (initializedGrid.length > 0) {
            var updatedGrid_1 = JSON.parse(JSON.stringify(initializedGrid));
            foundPositions.forEach(function (positions) {
                positions.forEach(function (pos) {
                    if (updatedGrid_1[pos.row] && updatedGrid_1[pos.row][pos.col]) {
                        updatedGrid_1[pos.row][pos.col].found = true;
                        updatedGrid_1[pos.row][pos.col].selected = true;
                    }
                });
            });
            setGrid(updatedGrid_1);
        }
    }, [foundPositions, initializedGrid]);
    // Add state for celebration
    var _g = useState(false), showCelebration = _g[0], setShowCelebration = _g[1];
    var _h = useState(false), showFinalCelebration = _h[0], setShowFinalCelebration = _h[1];
    var isValidDirection = function (start, end) {
        var dx = end.col - start.col;
        var dy = end.row - start.row;
        // Check if movement is horizontal, vertical, or diagonal
        return (dx === 0 || // vertical
            dy === 0 || // horizontal
            Math.abs(dx) === Math.abs(dy) // diagonal
        );
    };
    var getPositionsInLine = function (start, end) {
        var positions = [];
        var dx = Math.sign(end.col - start.col);
        var dy = Math.sign(end.row - start.row);
        var current = __assign({}, start);
        while (current.row !== end.row || current.col !== end.col) {
            positions.push(__assign({}, current));
            current.row += dy;
            current.col += dx;
        }
        positions.push(end);
        return positions;
    };
    var handleCellClick = function (rowIndex, colIndex) {
        if (selection.length === 0) {
            setSelection([{ row: rowIndex, col: colIndex }]);
            return;
        }
        var start = selection[0];
        var end = { row: rowIndex, col: colIndex };
        if (!isValidDirection(start, end)) {
            setSelection([]);
            return;
        }
        var newSelection = getPositionsInLine(start, end);
        setSelection(newSelection);
        var selectedWord = newSelection
            .map(function (pos) { return grid[pos.row][pos.col].letter; })
            .join("");
        var foundWord = words.find(function (word) { return word.replace(/[^A-Za-z]/g, "").toUpperCase() === selectedWord; });
        if (foundWord) {
            toast.success("Congratulations! You found \"".concat(foundWord, "\"!"), {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            onWordFound(foundWord);
            setFoundPositions(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newSelection], false); });
            setSelection([]);
            // Check if all words are found
            if (foundPositions.length + 1 === words.length) {
                setShowFinalCelebration(true);
                setTimeout(function () { return setShowFinalCelebration(false); }, 5000);
            }
        }
    };
    return (_jsxs("div", __assign({ className: "word-grid" }, { children: [_jsx(ToastContainer, {}), showCelebration && (_jsxs("div", __assign({ className: "celebration-overlay" }, { children: [_jsxs("div", __assign({ className: "celebration-text" }, { children: ["Congratulations!", _jsx("br", {}), "You found all words!"] })), __spreadArray([], Array(50), true).map(function (_, i) { return (_jsx("div", { className: "confetti", style: {
                            left: "".concat(Math.random() * 100, "%"),
                            backgroundColor: "hsl(".concat(Math.random() * 360, ", 70%, 50%)"),
                            animationDelay: "".concat(Math.random() * 2, "s"),
                        } }, i)); })] }))), _jsx("div", __assign({ className: "grid-container" }, { children: grid.map(function (row, rowIndex) { return (_jsx("div", __assign({ className: "grid-row" }, { children: row.map(function (cell, colIndex) { return (_jsx("div", __assign({ className: "grid-cell ".concat(selection.some(function (pos) { return pos.row === rowIndex && pos.col === colIndex; })
                            ? "selected"
                            : ""), onClick: function () { return handleCellClick(rowIndex, colIndex); } }, { children: cell.letter }), "".concat(rowIndex, "-").concat(colIndex))); }) }), rowIndex)); }) }))] })));
};
export default WordGrid;
