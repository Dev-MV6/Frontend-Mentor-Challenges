/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html"],
  theme: {
    colors: {
      "white": "hsl(0, 0%, 100%)",
      "transparent": "hsla(0, 0%, 0%, 0)",
      "red": "hsl(0, 100%, 66%)",
      "violet": "hsl(249, 99%, 64%)",
      "light-grayish-violet": "hsl(270, 3%, 87%)",
      "dark-grayish-violet": "hsl(279, 6%, 55%)",
      "very-dark-violet": "hsl(278, 68%, 11%)"
    },

    screens: {
      "mobile": "1280px"
    }
  }
}

