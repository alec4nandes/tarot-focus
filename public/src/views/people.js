import formatStatsSection from "./stats-section.js";
import { people } from "../models.js";

export default function peopleSection(drawn, stats) {
    return `
        <section>
            <h2>People</h2>
            <p>
                The lower cards of the Minor Arcana number Ace through 10,
                just like a standard playing deck. Each rank has a special meaning and,
                like the suits, they are sorted by their overall presence in today's drawing.
                The absent meanings represent less important areas of your life today.
            </p>
            <small>
                If all are present, pay attention to the order they show up in the cards.
                The first one is the most important.
            </small>
            ${formatStatsSection({
                drawn,
                info: people,
                isBigPicture: false,
                statsSection: stats.peopleStats,
            })}
        </section>
    `;
}
