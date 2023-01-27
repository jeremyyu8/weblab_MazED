/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./client/src/**/*.{html,js}"],
  theme: {
    extend: {
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
