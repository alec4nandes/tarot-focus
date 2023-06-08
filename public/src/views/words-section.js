import getImagesFromCardNames from "./images.js";

export default function wordsSection(stats) {
    const { matching, opposites, otherWords } = stats;
    return `
        <section>
            <h2>Words</h2>
            <p>
                Each card holds an array of words that best represent it,
                and not all the words of the deck are distinct.
                There is a lot of overlap and sometimes even contradiction between cards in a spread.
            </p>
            <p>
                If multiple cards share the same word, there is a stronger meaning behind it.
                If one card's words cancel out another card, consider the opposing forces at work.
                Think about the conflict at hand and which side you belong to.
            </p>
            <div class="stats-section">
                <div class="subsection">
                    <h3 class="subsection-header">Matching</h3>
                    ${getMatchingTables(matching)}
                </div>
                <div class="subsection opposites">
                    <h3 class="subsection-header">Opposites</h3>
                    ${getOppositesTables(opposites)}
                </div>
                <div class="subsection">
                    <h3 class="subsection-header">Other Words</h3>
                    ${getOtherWordsTables(otherWords)}
                </div>
            </div>
        </section>
    `;
}

function getMatchingTables(matching) {
    const entries = Object.entries(matching);
    return entries.length
        ? `
            <ul class="tiled">
                ${entries
                    .map(
                        ([cards, words]) => `
                            <li>
                                <h4>${words.join(", ")}</h4>
                                ${getImagesFromCardNames(
                                    cards.split(", "),
                                    "x-small"
                                )}
                            </li>
                        `
                    )
                    .join("")}
            </ul>
        `
        : "<p>No matches!</p>";
}

function getOppositesTables(opposites) {
    const entries = Object.entries(opposites);
    return entries.length
        ? `
            <div class="opposites-tables-container">
                ${entries
                    .map(
                        ([words, { cards, opposites }]) => `
                            <table>
                                <tr>
                                    <th rowspan="${
                                        Object.entries(opposites).length
                                    }">
                                        ${words}
                                        <br/>
                                        ${getImagesFromCardNames(
                                            cards,
                                            "x-small"
                                        )}
                                    </th>
                                    ${Object.entries(opposites)
                                        .slice(0, 1)
                                        .map(
                                            ([words, { cards }]) => `
                                                <td>
                                                    ${words}
                                                    <br/>
                                                    ${getImagesFromCardNames(
                                                        cards,
                                                        "x-small"
                                                    )}
                                                </td>
                                            `
                                        )
                                        .join("")}
                                </tr>
                                ${Object.entries(opposites)
                                    .slice(1)
                                    .map(
                                        ([words, { cards }]) => `
                                            <tr>
                                                <td>
                                                    ${words}
                                                    <br/>
                                                    ${getImagesFromCardNames(
                                                        cards,
                                                        "x-small"
                                                    )}
                                                </td>
                                            </tr>
                                        `
                                    )
                                    .join("")} 
                            </table>
                        `
                    )
                    .join("")}
            </div>
        `
        : "No opposites!";
}

function getOtherWordsTables(otherWords) {
    const entries = Object.entries(otherWords);
    return entries.length
        ? `
            <ul class="tiled full-width">
                ${Object.entries(otherWords)
                    .map(
                        ([card, words]) => `
                            <li>
                                <table>
                                    <tr>
                                        <td>
                                            ${getImagesFromCardNames(
                                                [card],
                                                "x-small"
                                            )}
                                        </td>
                                        <th>${words.join(", ")}</th>
                                    </tr>
                                </table>
                            </li>
                        `
                    )
                    .join("")}
            </ul>
        `
        : "No other words!";
}
