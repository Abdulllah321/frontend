/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      gradientColorStops: {
        "custom-gradient": [
          "rgba(18,12,120,1)",
          "rgba(17,2,189,1)",
          "rgba(9,9,121,1)",
        ],
      },
      gridTemplateRows: {
        "[auto,auto,1fr]": "auto auto 1fr",
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
  ],
};

