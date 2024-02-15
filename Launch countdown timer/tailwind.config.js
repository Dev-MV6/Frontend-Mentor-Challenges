/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.vue"],
  theme: {
    colors: {
      "grayish-blue": "hsl(237, 18%, 59%)",
      "soft-red": "hsl(345, 95%, 68%)",
      white: "hsl(0, 0%, 100%)",
      "dark-desaturated-blue": "hsl(236, 21%, 26%)",
      "very-dark-blue": "hsl(235, 16%, 14%)",
      "very-dark-mostly-black-blue": "hsl(234, 17%, 12%)",
    },

    screens: {
      lg: "800px",
    },
  },
  plugins: [],
}
