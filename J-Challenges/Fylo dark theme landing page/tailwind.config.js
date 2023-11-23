/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    colors: {
      "white": "hsl(0, 0%, 100%)",
      "cyan": "hsl(176, 68%, 64%)",
      "blue": "hsl(198, 60%, 50%)",
      "light-red": "hsl(0, 100%, 63%)",
      "dark-blue": "hsl(219, 30%, 18%)",
      "dark-blue-100": "hsl(217, 28%, 15%)",
      "dark-blue-200": "hsl(218, 28%, 13%)",
      "dark-blue-300": "hsl(216, 53%, 9%)",
    },

    screens: {
      "sm": "500px",
      "smd": "750px",
      "md": "1000px",
      "lg": "1440px"
    }
  },
  plugins: [],
}

