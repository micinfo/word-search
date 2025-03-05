import React from "react";
import "react-toastify/dist/ReactToastify.css";
interface WordGridProps {
    words: string[];
    onWordFound: (word: string) => void;
    hintedWord?: string;
}
declare const WordGrid: React.FC<WordGridProps>;
export default WordGrid;
