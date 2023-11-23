/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {},
    colors: {
      "pale-blue": "hsl(243, 100%, 93%)",
      "grayish-blue": "hsl(229, 7%, 55%)",
      "dark-blue": "hsl(228, 56%, 26%)",
      "very-dark-blue": "hsl(229, 57%, 11%)",
    },
    screens: {
      lg: "850px"
    }
  },
  plugins: [],
};
