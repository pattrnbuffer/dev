import { promptChoice } from './choice';
import { promptFor, promptType, promptLoop } from './tools';

export const promp = {
  for: promptFor,
  type: promptType,
  loop: promptLoop,
  choice: promptChoice,
};
export const PrompTools = promp;

export const PT = PrompTools;
