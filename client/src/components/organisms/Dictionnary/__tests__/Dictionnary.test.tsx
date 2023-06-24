import React from "react";
import { render } from "@testing-library/react";
import Dictionnary from "../Dictionnary";
import DictionaryApiResult from "@api/types";

describe("Dictionnary", () => {
  const mockDictionnary: DictionaryApiResult = {
    word: "example",
    phonetic: "/ɪɡˈzæmpəl/",
    phonetics: [],
    meanings: [
      {
        partOfSpeech: "noun",
        definitions: [
          {
            definition:
              "a thing characteristic of its kind or illustrating a general rule",
            synonyms: [],
            antonyms: [],
            example: undefined,
          },
        ],
        synonyms: [],
        antonyms: [],
      },
    ],
    license: {
      name: "",
      url: "",
    },
    sourceUrls: [],
  };

  test("renders without errors", () => {
    render(<Dictionnary dictionnary={mockDictionnary} />);
  });

  test("displays the word and phonetic", () => {
    const { getByText } = render(<Dictionnary dictionnary={mockDictionnary} />);
    const wordElement = getByText("example");
    const phoneticElement = getByText("/ɪɡˈzæmpəl/");

    expect(wordElement).toBeInTheDocument();
    expect(phoneticElement).toBeInTheDocument();
  });

  test("displays the part of speech and definition", () => {
    const { getByText } = render(<Dictionnary dictionnary={mockDictionnary} />);
    const partOfSpeechElement = getByText("noun");
    const definitionElement = getByText(
      "a thing characteristic of its kind or illustrating a general rule"
    );

    expect(partOfSpeechElement).toBeInTheDocument();
    expect(definitionElement).toBeInTheDocument();
  });

  test("does not display synonyms if there are none", () => {
    const { queryByText } = render(
      <Dictionnary dictionnary={mockDictionnary} />
    );
    const synonymsElement = queryByText("Synonyms");

    expect(synonymsElement).toBeNull();
  });

  test("displays the source URL", () => {
    const mockDictionnaryWithSource = {
      ...mockDictionnary,
      sourceUrls: ["https://example.com"],
    };

    const { getByText } = render(
      <Dictionnary dictionnary={mockDictionnaryWithSource} />
    );
    const sourceElement = getByText("https://example.com");

    expect(sourceElement).toBeInTheDocument();
  });
});
