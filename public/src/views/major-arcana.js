import getImagesFromCardNames from "./images.js";

export default function majorArcanaSection(cardNames, stats) {
    const majorArcana = stats.arcanaStats.major,
        isPluralArcana = majorArcana.length > 1,
        seriouses = ["somewhat serious", "moderately serious", "very serious"],
        seriousIndex =
            Math.ceil(
                (majorArcana.length / cardNames.length) * seriouses.length
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
                            majorArcana.length
                                ? `There ${isPluralArcana ? "are" : "is"} ${
                                      majorArcana.length
                                  } major arcana card${
                                      isPluralArcana ? "s" : ""
                                  } in this reading. The tone of this reading is ${serious}.`
                                : "There are no major arcana cards in this drawing. The tone of this reading is not too serious."
                        }
                    </strong>
                    <p style="margin-bottom: 0">
                        ${getImagesFromCardNames(majorArcana, "small")}
                    </p>
                    <ul>
                        ${majorArcana
                            .map(
                                (card) =>
                                    `<li><strong>${card}</strong>: [MEANING]</li>`
                            )
                            .join("")}
                    </ul>
                </div>
            </div>
        </section>
    `;
}
