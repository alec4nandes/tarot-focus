import formatStatsSection from "./stats-section.js";
import { suits } from "../models.js";

export default function bigPicture(drawn, stats) {
    return `
        <section>
            <h2>Big Picture</h2>
            <p>
                Alongside the Major Arcana is the Minor Arcana,
                which is grouped into four different suits.
                And just like the four cardinal directions,
                each suit points to a different quadrant of the human experience.
                Our career paths (Pentacles), intellectual interests (Swords),
                hidden emotions (Cups), and physical passions (Wands) are
                the driving forces that make us who we are.
            <p>
            <p>
                Sometimes one direction pulls us much stronger than the others.
                Below are your Tarot cards, sorted by how often each suit appears in your reading.
                What is today's grand theme, and what's missing?
            </p>
            <small>
                If all are present, pay attention to the order they show up in the cards.
                The first one is the most important.
            </small>
            ${formatStatsSection({
                drawn,
                info: suits,
                isBigPicture: true,
                statsSection: stats.suitStats,
            })}
        </section>
    `;
}
