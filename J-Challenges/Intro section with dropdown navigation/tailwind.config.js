/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {},
    colors: {
      "almost-white": "hsl(0, 0%, 98%)",
      "medium-gray": "hsl(0, 0%, 41%)",
      "almost-black": "hsl(0, 0%, 8%)",
    },

    screens: {
      md: "1065px",
    },
  },
  plugins: [],
};
