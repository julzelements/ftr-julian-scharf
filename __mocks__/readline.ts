import { Interface } from "readline";

const readlineMock = {
  on: jest.fn(),
  setPrompt: jest.fn(),
  prompt: jest.fn(),
};

export const createInterface = jest.fn().mockReturnValue(readlineMock);

// If you are using other methods from the 'readline' module, make sure to export them here.
const readline = {
  createInterface,
};

export default readline;
