/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./client/src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "light-white": "rgba(255,255,255,0.17)",
      },
      fontFamily: {
        // Roboto: ["Roboto", "sans-serif"],
        Ribeka: ["RIBEKA trial", "sans-serif"],
        Ubuntu: ["Ubuntu Mono", "sans-serif"],
      },
      backgroundImage: {
        spaceimg2: "url('/client/src/public/img/17520.jpg')",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};

// font-family: 'Roboto', sans-serif;
