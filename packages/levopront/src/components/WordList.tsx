import React from 'react';

interface WordListProps {
  words: string[];
  foundWords: string[];
}

const WordList: React.FC<WordListProps> = ({ words, foundWords }) => {
  return (
    <div className="word-list">
      <h3>Words to Find:</h3>
      <ul>
        {words.map((word, index) => (
          <li
            key={index}
            className={foundWords.includes(word) ? 'found' : ''}
          >
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordList;