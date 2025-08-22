import { faker } from '@faker-js/faker';

const usedWords = new Set<string>();

export const getUniqWord = (): string => {
  let word: string;
  do {
    word = faker.word.noun({ length: { min: 5, max: 25 } });
  } while (usedWords.has(word));
  usedWords.add(word);
  return word;
};
