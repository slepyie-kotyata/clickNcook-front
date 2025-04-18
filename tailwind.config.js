/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#6F56FF",
        secondary: "#FFEB9C",
        red: "#CB3D3D",
        sky: "#89E4FF",
      },
      borderRadius: {
        xxl: "50px",
      },
      zIndex: {
        max: "99999",
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
      flex: {
        2: "2 2 0%",
        3: "3 3 0%",
      },
      flexGrow: {
        2: "2",
        3: "3",
      },
      flexShrink: {
        2: "2",
        3: "3",
      },
    },
  },
  plugins: [],
};
