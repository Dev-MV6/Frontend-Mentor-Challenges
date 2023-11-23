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
  document.body.style.overflow = active ? "hidden" : "auto";
  // Animate mob menu
  const animationDutation = 150;
  mainNavMenu.animate(
    { right: ["-240px", "0px"] },
    { duration: 150, easing: "ease-in-out", direction: active ? "normal" : "reverse" }
  );
  setTimeout(() => mainNavMenu.classList.toggle("main-nav-menu--mob", active), active ? 0 : animationDutation - 10);
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
    if (mobNavBtnActive) {
      mobNavBtnActive = false;
      toggleMobNavMenu(false);
    }
  }
});
