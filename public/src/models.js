/*
    models.js formats data for the functions in
    views.js to parse into HTML for DOM injection.
*/

import { words, oppositeWords } from "./words.js";

const suits = {
        Pentacles: {
            represents: "health and career",
            // TODO: split meanings for each suit, i.e. one for health and one for career.
            meaning:
                "Focus on long-term goals that will bring security and stability to your life. Make an effort to eat well, exercise, and network.",
            adjectives: ["health", "wealth"],
            personal: [
                "practical",
                "resourceful",
                "stable",
                "hardworking",
                "materialistic",
            ],
        },
        Swords: {
            represents: "learning and logic",
            meaning:
                "Focus on expanding your worldview and skillset. Find a new resource for an old interest, or set out to discover something new. Approach problems with your head instead of your heart. Do not let emotion cloud reason — think before you act.",
            adjectives: ["learning", "logic"],
            personal: [
                "intelligent",
                "rational",
                "communicative",
                "courageous",
                "conflicted",
            ],
        },
        Cups: {
            represents: "human connection and emotion",
            meaning:
                "Focus on strengthening relationships without any ulterior motive. Listen deeply before mentally drafting a response. Approach today's problems with your heart instead of your head. Now is not the time to overanalyze — trust your instinct.",
            adjectives: ["connection", "emotion"],
            personal: [
                "sensitive",
                "intuitive",
                "romantic",
                "imaginative",
                "compassionate",
            ],
        },
        Wands: {
            represents: "creativity and passion",
            meaning:
                "Focus on building something new or expanding an old project. Synthesize your passions, even if the first draft is messy. Put it down on paper, then create a plan to get it done.",
            adjectives: ["creativity", "passion"],
            personal: [
                "energetic",
                "creative",
                "charismatic",
                "spiritual",
                "ambitious",
            ],
        },
    },
    ranks = {
        Ace: { represents: "beginning", preposition: "of" },
        2: { represents: "balance", preposition: "of" },
        3: { represents: "communication", preposition: "with" },
        4: { represents: "rest", preposition: "from" },
        5: { represents: "struggle", preposition: "with" },
        6: { represents: "growth", preposition: "of" },
        7: { represents: "strategy", preposition: "for" },
        8: { represents: "effort", preposition: "with" },
        9: { represents: "outcome", preposition: "of" },
        10: { represents: "ending", preposition: "of" },
    },
    getPersonal = (suit) => getRandom(suits[suit].personal),
    people = {
        Page: { represents: "child", getPersonal },
        Knight: { represents: "adolescent", getPersonal },
        Queen: { represents: "adult", getPersonal },
        King: { represents: "elder", getPersonal },
    },
    majorArcana = {
        Fool: "new beginnings, new experiences, and new choices",
        Magician: "confidence, control, and power",
        "High Priestess": "the mysteries of existence",
        Empress: "the female body and the material world",
        Emperor: "rational thought",
        Hierophant: "the spiritual world or a religious institution",
        Lovers: "an intimate relationship",
        Chariot: "emotional discipline",
        Strength: "determination, endurance, and fortitude of character",
        Hermit: "a wise teacher",
        "Wheel of Fortune": "the notion of fate",
        Justice: "earthly laws and their consequences",
        "Hanged Man": "the need to look at things in new ways",
        Death: "a dramatic transformation, usually in one's lifestyle",
        Temperance: "moderation, compromise, and cooperation",
        Devil: "loss of control, loss of faith, or loss of hope",
        Tower: "physical disaster or the destruction of one's ego",
        Star: "guidance, hope, and faith",
        Moon: "deception",
        Sun: "success, completion, and clarity",
        Judgement:
            "cause-and-effect relationships and the notion of cosmic justice",
        World: "a promotion to a higher position or a new level of knowledge",
    },
    deck = createDeck();

function createDeck() {
    const minorArcana = Object.keys(suits)
            .map((suit) =>
                [...Object.keys(ranks), ...Object.keys(people)].map(
                    (rank) => `${rank} of ${suit}`
                )
            )
            .flat(),
        majorNames = Object.keys(majorArcana),
        deck = [...majorNames, ...minorArcana].reduce((acc, card, i) => {
            const isMajor = i < majorNames.length,
                [rank, suit] = isMajor ? [null, null] : card.split(" of ");
            return {
                ...acc,
                [card]: {
                    ...(isMajor
                        ? {
                              isMajor,
                              majorNumber: i,
                              definition: majorArcana[card],
                          }
                        : {}),
                    ...(rank ? { rank } : {}),
                    ...(suit ? { suit } : {}),
                    words: words[card].sort(),
                    opposites: getOppositeWords(card),
                },
            };
        }, {});
    return deck;
}

function getOppositeWords(card) {
    return [
        ...new Set(
            words[card]
                .map((word) => oppositeWords[word])
                .filter(Boolean)
                .flat()
        ),
    ].sort();
}

function draw(size, testCards = []) {
    const cards = Object.keys(deck);
    let drawn = new Set([
        ...testCards.filter((card) =>
            cards.includes(card.replace(" reversed", ""))
        ),
    ]);
    const predrawnSize = drawn.size;
    if (predrawnSize > size) {
        return [...drawn].slice(0, size);
    }
    while (drawn.size < size) {
        drawn.add(getRandom(cards));
    }
    drawn = [...drawn].reduce((acc, card, i) => {
        const isPredrawn = i < predrawnSize,
            isReversed = isPredrawn
                ? card.includes(" reversed")
                : !!~~(Math.random() * 2),
            cardInfo = deck[card.replace(" reversed", "")],
            { words, opposites } = cardInfo,
            cardName = isPredrawn
                ? card
                : `${card}${isReversed ? " reversed" : ""}`;
        return {
            ...acc,
            [cardName]: {
                ...cardInfo,
                ...(isReversed
                    ? { words: opposites || [], opposites: words || [] }
                    : {}),
            },
        };
    }, {});
    return drawn;
}

function getStats(drawn) {
    const statsObj = (obj) =>
            Object.keys(obj).reduce(
                (acc, key) => ({ ...acc, [key + ""]: [] }),
                {}
            ),
        rankStats = statsObj(ranks),
        peopleStats = statsObj(people),
        suitStats = statsObj(suits),
        arcanaStats = { major: [], minor: [] },
        { matching, otherWords, opposites } = compare(drawn);
    Object.entries(drawn).forEach(([card, info]) => {
        const { isMajor, rank, suit } = info;
        if (isMajor) {
            arcanaStats.major.push(card);
        } else {
            arcanaStats.minor.push(card);
            (rankStats[rank] || peopleStats[rank]).push(card);
            suitStats[suit].push(card);
        }
    });
    return {
        rankStats: sortStats(rankStats),
        peopleStats: sortStats(peopleStats),
        suitStats: sortStats(suitStats),
        arcanaStats,
        matching,
        otherWords,
        opposites,
    };
}

function sortStats(stats) {
    const filterer = (min, max) =>
            Object.fromEntries(
                Object.entries(stats).filter(
                    ([_, cards]) => min <= cards.length && cards.length <= max
                )
            ),
        dominant = filterer(2, Infinity),
        present = filterer(1, 1),
        absent = filterer(0, 0);
    return { dominant, present, absent };
}

/* COMPARE */

function compare(drawn) {
    const data = getCompareData(drawn),
        matchingFunc = (cards) => cards.length > 1,
        otherWordsFunc = (cards) => cards.length === 1,
        filterer = (func, allWordsInOpposites) =>
            Object.entries(data).filter(
                ([word, { cards }]) =>
                    func(cards) && !allWordsInOpposites?.includes(word)
            ),
        reducer = (entries) =>
            entries.reduce(
                (acc, [word, { cards }]) => ({
                    ...acc,
                    [cards.join(", ")]: [
                        ...(acc[cards.join(", ")] || []),
                        word,
                    ].sort(),
                }),
                {}
            ),
        opposites = getOpposites(data),
        otherWords = reducer(
            filterer(otherWordsFunc, getAllWordsInOpposites(opposites))
        ),
        matching = reducer(filterer(matchingFunc));
    return { matching, otherWords, opposites };
}

function getCompareData(drawn) {
    const filterer = (word) =>
            // returns array of names of drawn cards with
            // a specific word in their words array
            Object.entries(drawn)
                .filter(([card, { words }]) => words.includes(word))
                .map(([card]) => card),
        allWords = [
            // all the words for the drawn cards
            ...new Set(
                Object.values(drawn)
                    .map(({ words }) => words)
                    .flat()
            ),
        ].sort();
    return Object.entries(drawn).reduce((acc, [card, { words }]) => {
        /* Object model:
        {
            chaos:
                {
                    cards: ["Tower"],
                    opposites:
                        {
                            peace: {cards: ["Star"]},
                            serenity: {cards: ["Star"]}
                        }
                }
        }
        */
        words.forEach((word) => {
            if (!acc[word]) {
                const opposites = oppositeWords[word]?.filter((oppo) =>
                    allWords.includes(oppo)
                );
                acc[word] = {
                    cards: filterer(word),
                    opposites:
                        opposites?.length &&
                        opposites.reduce(
                            (acc, oppo) => ({
                                ...acc,
                                [oppo]: { cards: filterer(oppo) },
                            }),
                            {}
                        ),
                };
            }
        });
        return acc;
    }, {});
}

function getOpposites(compareData) {
    let result = Object.fromEntries(
        Object.entries(compareData)
            .filter(([_, { opposites }]) => opposites)
            .sort(([aWords, aInfo], [bWords, bInfo]) => {
                // sort by most opposites descending,
                // then alphabetically by word
                const getLength = ({ opposites }) =>
                        Object.entries(opposites).length,
                    diff = getLength(bInfo) - getLength(aInfo);
                return diff || aWords.localeCompare(bWords);
            })
    );
    // delete words from lower lists of opposites
    Object.entries(result).forEach(([word, { opposites }]) =>
        Object.keys(opposites).forEach(
            (opposite) => delete result[opposite].opposites[word]
        )
    );
    // filter out the entries that have no opposites left
    result = Object.fromEntries(
        Object.entries(result).filter(
            ([_, { opposites }]) => Object.entries(opposites).length
        )
    );
    // combine opposites in opposites list that have the same cards
    Object.entries(result).forEach(([words, { opposites }]) => {
        result[words].opposites = combineOppositesList(opposites);
    });
    return result;
}

function combineOppositesList(opposites) {
    return Object.fromEntries(
        Object.entries(
            // reduce opposites lists, combining
            // words with the same cards
            Object.entries(opposites).reduce(
                (acc, [word, { cards }]) => ({
                    ...acc,
                    [cards.join(", ")]: [
                        ...(acc[cards.join(", ")] || []),
                        word,
                    ].sort(),
                }),
                {}
            )
        ).map(([cards, words]) =>
            // flip keys and values
            [words.join(", "), { cards: cards.split(", ") }]
        )
    );
}

function getAllWordsInOpposites(opposites) {
    return [
        ...new Set(
            Object.entries(opposites)
                .map(([key, value]) => [
                    ...key.split(", "),
                    ...Object.keys(value.opposites)
                        .map((oppos) => oppos.split(", "))
                        .flat(),
                ])
                .flat()
        ),
    ];
}

function getRandom(arr) {
    return arr[~~(Math.random() * arr.length)];
}

export {
    suits,
    ranks,
    people,
    majorArcana,
    draw,
    getStats,
    compare,
    getRandom,
};
