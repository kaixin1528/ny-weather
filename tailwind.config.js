module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      overpass: "Overpass",
    },
    extend: {
      textColor: {
        high: "#3ac9db",
        low: "#c2f8e7",
      },
      backgroundImage: {
        main: "url('../public/ny-wallpaper.jpg')",
      },
    },
  },
  plugins: [],
};
