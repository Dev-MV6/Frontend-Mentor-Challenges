/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "very-dark-gray": "hsl(0, 0%, 17%)",
        "dark-gray": "hsl(0, 0%, 59%)",
        "light-red": "#ff4646",
      },

      screens: {
        md: "500px",
        lg: "1150px",
      },
    },
  },
  plugins: [],
};
