export default function displayNavigation(scrollElem) {
    const navigationElem = document.querySelector("header"),
        slides = [
            ...document.querySelector("main").querySelectorAll("section"),
        ];
    let slideIndex = 0;
    navigationElem.style.overflow = "initial";
    navigationElem.innerHTML = `
        <button id="previous"><</button>
        ${slides
            .map(
                (_, i) =>
                    `<span class="nav-dot${
                        i === slideIndex ? " current-nav-dot" : ""
                    }">&bull;</span>`
            )
            .join("")}
        <button id="next">></button>
        <button id="home">home</button>
    `;
    const navDots = document.querySelectorAll(".nav-dot"),
        prev = document.querySelector("#previous"),
        next = document.querySelector("#next"),
        home = document.querySelector("#home");
    scrollElem.onscroll = () => handleMove(navDots);
    scrollElem.ontouchmove = () => handleMove(navDots);
    navDots.forEach((dot, i) => (dot.onclick = () => scroller(i)));
    prev.onclick = () => slides[slideIndex - 1] && scroller(--slideIndex);
    next.onclick = () => slides[slideIndex + 1] && scroller(++slideIndex);
    home.onclick = () => location.reload();

    function handleMove(navDots) {
        const showing = slides.findLastIndex(
            (slide) =>
                slide.getBoundingClientRect().left < window.innerWidth / 2
        );
        navDots.forEach((dot, i) =>
            dot.classList[i === showing ? "add" : "remove"]("current-nav-dot")
        );
        slideIndex = showing;
    }

    function scroller(index = slideIndex) {
        slides[index].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "start",
        });
        slideIndex = index;
    }
}
