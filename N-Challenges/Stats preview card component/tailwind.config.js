/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    colors: {
      "very-dark-blue": 'hsl(233, 47%, 7%)',
      "dark-desaturated-blue": 'hsl(244, 38%, 16%)',
      "soft-violet": 'hsl(277, 64%, 61%)',
      "white": 'hsl(0, 100%, 100%)',
      "slightly-transparent-white-75": 'hsla(0, 0%, 100%, 0.75)',
      "slightly-transparent-white-60": 'hsla(0, 0%, 100%, 0.6)'
    },
    screens: {
      "mobile": '1200px'
    }
  },
  plugins: [],
}
