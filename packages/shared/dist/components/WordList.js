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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var WordList = function (_a) {
    var words = _a.words, foundWords = _a.foundWords;
    return (_jsxs("div", __assign({ className: "word-list" }, { children: [_jsx("h3", { children: "Words to Find:" }), _jsx("ul", { children: words.map(function (word, index) { return (_jsx("li", __assign({ className: foundWords.includes(word) ? 'found' : '' }, { children: word }), index)); }) })] })));
};
export default WordList;
