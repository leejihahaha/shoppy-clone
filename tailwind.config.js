/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{jsx,js}"],
  theme: {
    extend: {
      colors: {
        brand: "#F96162",
      },
      backgroundImage: {
        banner: `url("../public/images/banner.jpg")`,
      },
    },
  },
  plugins: [],
};
