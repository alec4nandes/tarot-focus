export default function getImagesFromCardNames(cards, classes) {
    const imgHTML = (card) => {
        const reverse = () => (card.includes(" reversed") ? " reversed" : ""),
            upright = card.replace(" reversed", "");
        return `
            <img src="./assets/cards/${upright}.jpg"
                class="${classes}${reverse()}"
                alt="${upright}${reverse()} tarot card" />
        `;
    };
    return cards.map(imgHTML);
}
