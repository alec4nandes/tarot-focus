import getImagesFromCardNames from "./images.js";
import { suits, getRandom } from "../models.js";

export default function formatStatsSection({
    drawn,
    info,
    isBigPicture,
    statsSection,
}) {
    const passing = { drawn, info, isBigPicture },
        { dominant, present, absent } = statsSection;
    return `
        <div class="stats-section">
            ${formatHelper({
                ...passing,
                subsection: dominant,
                header: "Dominant",
                description:
                    "These messages have appeared among more than one card. They have strong energy.",
            })}
            ${formatHelper({
                ...passing,
                subsection: present,
                header: "Present",
                description: "These are other energies in the spread.",
            })}
            ${formatHelper({
                ...passing,
                subsection: absent,
                header: "Absent",
                description:
                    "Sometimes what's absent is just as important as what's present. Make note of what's missing from this reading.",
                isAbsent: true,
            })}
        </div>
    `;
}

function formatHelper({
    drawn,
    info,
    isBigPicture,
    subsection,
    header,
    description,
    isAbsent,
}) {
    const entries = Object.entries(subsection),
        ulClass = isAbsent ? "" : isBigPicture ? "more-text" : "tiled";
    return entries.length
        ? `
            <div class="subsection">
                <h3 class="subsection-header">
                    ${header}
                    <span class="tooltip">
                        <span class="tooltip-icon">ⓘ</span>
                        <span class="tooltiptext">
                            ${description}
                            <br/>
                            <button class="close-tooltip">close</button>
                        </span>
                    </span>
                </h3>
                <ul class="${ulClass}">
                    ${entries.sort(sortEntries).map(listItemHTML).join("")}
                </ul>
            </div>
        `
        : "";

    function sortEntries(a, b) {
        if (isAbsent) {
            // sort numbered ranks for absent cards
            return a[0] === "Ace" ? -1 : +a[0] - +b[0];
        } else {
            // sort entries by their occurence in the drawn cards
            const getIndex = (key) =>
                Object.keys(drawn).findIndex((name) => name.includes(key));
            return getIndex(a[0]) - getIndex(b[0]);
        }
    }

    function listItemHTML([key, cards]) {
        const { represents, meaning, preposition, getPersonal } =
                info[key + ""],
            showMeaning = meaning && !isAbsent;
        return `
            <li>
                <h4>
                    <span class="key"><strong>${key}</strong>:</span>
                    ${represents}
                </h4>
                ${
                    cards.length
                        ? `
                            <div class="small-cards">
                                ${getImagesFromCardNames(cards, "small")
                                    .map((imgHTML, i) => {
                                        const card = cards[i],
                                            [rank, suit] = card
                                                .replace(" reversed", "")
                                                .split(" of "),
                                            isReversed =
                                                card.includes(" reversed");
                                        return preposition || getPersonal
                                            ? `
                                                <div>
                                                    ${imgHTML}
                                                    <br/>
                                                    <strong>
                                                        ${suit}${
                                                  isReversed ? " ⤸" : ""
                                              }:
                                                    </strong>
                                                    ${
                                                        preposition
                                                            ? `
                                                                ${
                                                                    isReversed
                                                                        ? "no "
                                                                        : ""
                                                                }
                                                                ${represents} ${preposition}
                                                                ${getRandom(
                                                                    suits[suit]
                                                                        .adjectives
                                                                )}
                                                            `
                                                            : `
                                                                ${
                                                                    isReversed
                                                                        ? "not "
                                                                        : ""
                                                                }
                                                                ${getPersonal(
                                                                    suit
                                                                )} ${represents}
                                                            `
                                                    }
                                                </div>
                                            `
                                            : imgHTML;
                                    })
                                    .join("")}
                            </div>
                          `
                        : ""
                }
                ${showMeaning ? `<p>${meaning}</p>` : ""}
            </li>
        `;
    }
}
