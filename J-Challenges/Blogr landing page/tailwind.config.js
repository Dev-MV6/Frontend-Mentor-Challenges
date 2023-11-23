/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html"],
  theme: {
    extend: {
      backgroundImage: {
        header: "url('./images/bg-pattern-intro-mobile.svg'), linear-gradient(150deg, hsl(13, 100%, 72%), hsl(353, 100%, 62%))",
        "header-md": "url('./images/bg-pattern-intro-desktop.svg'), linear-gradient(to right, hsl(13, 100%, 72%), hsl(353, 100%, 62%))",
        bodySection: "url('./images/bg-pattern-circles.svg'), radial-gradient(circle at center 100px, hsl(237, 17%, 21%), hsl(237, 23%, 32%))",
        "bodySection-md":
          "url('./images/bg-pattern-circles.svg'), radial-gradient(circle at calc(50% - 426px) 0px, hsl(237, 17%, 21%), hsl(237, 23%, 32%))",
      },

      backgroundPosition: {
        header: "calc(50% + 135px) -250px, top",
        "header-md": "calc(50% + 428px) -1342px, top",
        bodySection: "50% -235px, center",
        "bodySection-md": "calc(50% - 426px) -509px, center",
      },

      backgroundSize: {
        bodySection: "600px, cover",
      },

      maxWidth: {
        pageContent: "1107px",
        "pageContent+": "calc(1107px + 24px*2)",
      },

      screens: {
        sm: "500px",
        md: "1000px",
      },
    },

    colors: {
      "grt-very-light-red": "hsl(13, 100%, 72%)",
      "grt-light-red": "hsl(353, 100%, 62%)",
      "light-red": "hsl(356, 100%, 66%)",
      "very-light-red": "hsl(355, 100%, 74%)",
      "very-dark-blue": "hsl(208, 49%, 24%)",
      white: "hsl(0, 0%, 100%)",
      "grayish-blue": "hsl(240, 2%, 79%)",
      "very-dark-grayish-blue": "hsl(207, 13%, 34%)",
      "very-dark-black-blue": "hsl(240, 10%, 16%)",
      "very-dark-gray-blue": "hsl(237, 17%, 21%)",
      "very-dark-desaturated-blue": "hsl(237, 23%, 32%)",
    }
  },
  plugins: [],
};
