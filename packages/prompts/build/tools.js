"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptType = exports.promptFor = void 0;
const prompts_1 = require("prompts");
async function promptFor(question, options) {
    const [answer] = Object.values(await (0, prompts_1.default)(question, options));
    return answer;
}
exports.promptFor = promptFor;
function promptType(prompt) {
    return prompt;
}
exports.promptType = promptType;
//# sourceMappingURL=tools.js.map