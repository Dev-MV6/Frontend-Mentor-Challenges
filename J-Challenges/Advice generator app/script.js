const card = document.getElementById("card");
const advice = document.getElementById("advice");
const adviceIdContainer = document.getElementById("advice-id");
const adviceQuoteContainer = document.getElementById("advice-quote");
const adviceQuoteDivider = document.getElementById("advice-quote-divider");
const fetchNewAdviceBtn = document.getElementById("fetch-new-advice-btn");
const dice = document.getElementById("dice");

const updateCardHeight = () => {
  card.style.height = advice.getBoundingClientRect().height + parseFloat(getComputedStyle(card).paddingTop) * 2 + "px";
};

window.addEventListener("load", updateCardHeight);
window.addEventListener("resize", updateCardHeight);

async function fetchNewAdvice() {
  const rotating = {
    transform: ["translate(-50%, -50%) rotateZ(0deg)", "translate(-50%, -50%) rotateZ(360deg)"],
  };
  const translating = {
    transform: ["translate(0, 50%)", "translate(0, 0)"],
  };
  const fading = {
    opacity: [0, 1],
  };

  const diceAnimation = dice.animate(rotating, { duration: 400, iterations: Infinity });
  adviceQuoteContainer.animate(
    { ...translating, ...fading },
    { duration: 500, easing: "cubic-bezier(0.680, -0.550, 0.265, 1.550)", fill: "forwards", direction: "reverse" }
  );
  adviceIdContainer.animate(fading, { duration: 500, easing: "ease-in-out", fill: "forwards", direction: "reverse" });
  adviceQuoteDivider.animate(fading, { duration: 500, easing: "ease-in-out", fill: "forwards", direction: "reverse" });

  try {
    const res = await fetch("https://api.adviceslip.com/advice", { method: "GET", cache: "no-cache" });
    const json = await res.json();
    const slip = json.slip;

    setTimeout(() => {
      adviceIdContainer.innerText = `Advice #${slip.id}`;
      adviceQuoteContainer.innerText = `“${slip.advice}”`;
      updateCardHeight();

      adviceIdContainer.animate(fading, { duration: 500, easing: "ease-in-out", fill: "forwards" });
      adviceQuoteDivider.animate(fading, { duration: 500, easing: "ease-in-out", fill: "forwards" });
      setTimeout(() => {
        adviceQuoteContainer.animate(
          { ...translating, ...fading },
          { duration: 500, easing: "cubic-bezier(0.680, -0.550, 0.265, 1.550)", fill: "forwards" }
        );
      }, 400);
    }, 500);
  } finally {
    diceAnimation.cancel();
  }
}

fetchNewAdviceBtn.addEventListener("click", fetchNewAdvice);
