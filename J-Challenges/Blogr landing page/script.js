// Desktop navigation menu
const navItems = document.querySelectorAll(".nav-item");
let activeNavItem;

navItems.forEach((item) => {
  const trigger = item.querySelector(".nav-item__trigger");
  trigger.addEventListener("click", () => {
    // Deactivate currently active menu
    activeNavItem?.classList.remove("nav-item--active");
    activeNavItem?.querySelector(".nav-item__trigger").setAttribute("aria-expanded", false);
    if (item != activeNavItem) {
      activeNavItem = item;
      item.classList.add("nav-item--active");
      trigger.setAttribute("aria-expanded", true);
    } else {
      activeNavItem = null;
    }
  });
});

// Mobile navigation menu
const mobNavBtn = document.getElementById("mob-nav-btn");
const mainNavMenu = document.getElementById("main-nav-menu");
let mobNavBtnActive = false;

function toggleMobNavMenu(active) {
  mobNavBtn.classList.toggle("mob-nav-btn--active", active);
  mainNavMenu.classList.toggle("main-nav-menu--mob", active);
  mobNavBtn.setAttribute("aria-expanded", active);
}

mobNavBtn.addEventListener("click", () => {
  mobNavBtnActive = !mobNavBtnActive;
  toggleMobNavMenu(mobNavBtnActive);
});

// Unfocus (blur) navigation elements
document.addEventListener("click", (e) => {
  if (
    e.target !== mobNavBtn &&
    !e.target.classList.contains("nav-item__trigger") &&
    !e.target.classList.contains("nav-item__menu")
  ) {
    activeNavItem?.classList.remove("nav-item--active");
    activeNavItem?.querySelector(".nav-item__trigger").setAttribute("aria-expanded", false);
    activeNavItem = null;
    mobNavBtnActive = false;
    toggleMobNavMenu(false);
  }
});

// Effect for "Learn More" button in header
function onBtnHoverEffectStart(e) {
  const effect = e.target.querySelector(".button-special--effect");
  effect.style.top = e.offsetY + "px";
  effect.style.left = e.offsetX + "px";
}

document.querySelectorAll(".button-special").forEach((btn) => {
  btn.addEventListener("mouseenter", onBtnHoverEffectStart);
  btn.addEventListener("mouseleave", onBtnHoverEffectStart);
});
