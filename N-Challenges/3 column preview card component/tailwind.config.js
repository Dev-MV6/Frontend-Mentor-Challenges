/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    colors: {
      "transparent-white": "hsla(0, 0%, 100%, 0.75)",
      "light-gray": "hsl(0, 0%, 95%)",
      "bright-orange": "hsl(31, 77%, 52%)",
      "dark-cyan": "hsl(184, 100%, 22%)",
      "very-dark-cyan": "hsl(179, 100%, 13%)",
    },

    screens: {
      "mobile": "1050px"
    }
  },
  plugins: [],
}

