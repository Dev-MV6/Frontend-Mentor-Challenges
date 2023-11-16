/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    colors: {
      "white": "hsl(0, 0%, 100%)",
      "dark-cyan": "hsl(185, 75%, 39%)",
      "very-dark-desaturated-blue": "hsl(229, 23%, 23%)",
      "dark-grayish-blue": "hsl(227, 10%, 46%)",
      "dark-gray": "hsl(0, 0%, 59%)"
    },

    screens: {
      "mobile": "700px",
      "laptop": "1300px"
    },

    backgroundImage: {
      'bodyPattern': "url('./images/bg-pattern-top.svg'),  url('./images/bg-pattern-bottom.svg')"
    },

    extend: {
      backgroundPosition: {
        'bodyPattern': "left -330px top -300px, right -428px bottom -326px",
        'mobileBodyPattern': "left -585px top -510px, right -530px bottom -633px",
        'laptopBodyPattern': "left -285px top -510px, right -230px bottom -633px"
      },
    }
  },
  plugins: [],
}
