import getImagesFromCardNames from "./images.js";
import { majorArcana } from "../models.js";

export default function majorArcanaSection(cardNames, stats) {
    const drawnMajors = stats.arcanaStats.major,
        isPluralArcana = drawnMajors.length > 1,
        seriouses = ["somewhat serious", "moderately serious", "very serious"],
        seriousIndex =
            Math.ceil(
                (drawnMajors.length / cardNames.length) * seriouses.length
            ) - 1,
        serious = seriouses[seriousIndex];
    return `
        <section>
            <h2>Major Arcana</h2>
            <p>
                Not all Tarot cards hold equal importance.
                Some are steeped in deep symbolic meaning and reflect the most fundamental forces of nature.
                These are the Major Arcana cards.
            </p>
            <p>
                More of these cards in a reading indicates more urgency.
                Take seriously the messages these cards give you in proportion to how many there are.
            </p>
            <div class="stats-section">
                <div class="subsection">
                    <strong>
                        ${
                            drawnMajors.length
                                ? `There ${isPluralArcana ? "are" : "is"} ${
                                      drawnMajors.length
                                  } major arcana card${
                                      isPluralArcana ? "s" : ""
                                  } in this reading. The tone of this reading is ${serious}.`
                                : "There are no major arcana cards in this drawing. The tone of this reading is not too serious."
                        }
                    </strong>
                    <p style="margin-bottom: 0">
                        ${getImagesFromCardNames(drawnMajors, "small").join("")}
                    </p>
                    <ul>
                        ${drawnMajors
                            .map((card) => {
                                const isReversed = card.includes(" reversed"),
                                    upright = card.replace(" reversed", "");
                                return `
                                    <li>
                                        <strong>${card}</strong>:
                                        ${isReversed ? "(blocked energy) " : ""}
                                        ${majorArcana[upright]}
                                    </li>
                                `;
                            })
                            .join("")}
                    </ul>
                </div>
            </div>
        </section>
    `;
}
