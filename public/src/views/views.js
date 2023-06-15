/*
    views.js takes formatted data from models.js
    and parses it into HTML for DOM injection.
*/

import { getStats } from "../models.js";
import getImagesFromCardNames from "./images.js";
import majorArcanaSection from "./major-arcana.js";
import bigPicture from "./big-picture.js";
import smallPicture from "./small-picture.js";
import peopleSection from "./people.js";
import wordsSection from "./words-section.js";
import displayNavigation from "./navigation.js";

function preloadImages(drawn, elem) {
    const loader = document.querySelector("#loader");
    loader.style.display = "block";
    // let the loading gif play for a bit
    setTimeout(() => {
        const urls = Object.keys(drawn)
            .map((cardName) => cardName.replace(" reversed", ""))
            .map((upright) => `./assets/cards/${upright}.jpg`);
        let loaded = 0;
        for (const url of urls) {
            const img = new Image();
            img.onload = () =>
                ++loaded === urls.length && readyToLoad(elem, drawn, loader);
            img.src = url;
        }
    }, 2000);
}

function readyToLoad(elem, drawn, loader) {
    displayStats(elem, drawn);
    enableMobileTooltips();
    displayNavigation(elem);
    // small time buffer for injecting images into DOM
    setTimeout(() => {
        loader.style.display = "none";
    }, 150);
}

function displayStats(elem, drawn) {
    const cardNames = Object.keys(drawn),
        stats = getStats(drawn);
    elem.innerHTML = `
        <section>
            <h2>These are your six cards:</h2>
            <p>${getImagesFromCardNames(cardNames, "drawn").join("")}</p>
            <p>Swipe right to start learning more, or navigate using the menu above.</p>
        </section>
        ${majorArcanaSection(cardNames, stats)}
        ${bigPicture(drawn, stats)}
        ${smallPicture(drawn, stats)}
        ${peopleSection(drawn, stats)}
        ${wordsSection(stats)}
    `;
}

function enableMobileTooltips() {
    document.querySelectorAll(".tooltip").forEach((elem) => {
        const icon = elem.querySelector(".tooltip-icon"),
            text = elem.querySelector(".tooltiptext"),
            closeButton = text.querySelector(".close-tooltip");
        icon.onclick = () => (text.style.visibility = "visible");
        closeButton.onclick = () => (text.style.visibility = "hidden");
    });
}

export { preloadImages };
