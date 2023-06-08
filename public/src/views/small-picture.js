import formatStatsSection from "./stats-section.js";
import { ranks } from "../models.js";

export default function smallPicture(drawn, stats) {
    return `
        <section>
            <h2>Small Picture</h2>
            <p>
                The lower cards of the Minor Arcana number Ace through 10,
                just like a standard playing deck. Each rank has a special meaning and,
                like the suits, they are sorted by their overall presence in today's drawing.
                The absent meanings represent less important areas of your life today.
            </p>
            <p>
                *** For each present word, include an adjective under that card based on the suit
            </p>
            ${formatStatsSection({
                drawn,
                info: ranks,
                isBigPicture: false,
                statsSection: stats.rankStats,
            })}
        </section>
    `;
}
