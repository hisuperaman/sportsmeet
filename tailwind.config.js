/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "rgb(13,16,26)",
        secondary: "#FF4500",
        background: "#F5F5F5",
        card: "#FFFFFF",
        textPrimary: "#222222",
        textSecondary: "#666666",
        accent: "#32CD32",
        archive: "#888888",
        border: "#E0E0E0",
        success: "#28a745",
        danger: "#dc3545",
      },
      fontFamily: {
        poppins: ['poppins'],
        'poppins-black': ['poppins-black'],
        'poppins-black-italic': ['poppins-black-italic'],
        'poppins-bold': ['poppins-bold'],
        'poppins-bold-italic': ['poppins-bold-italic'],
        'poppins-extra-bold': ['poppins-extra-bold'],
        'poppins-extra-bold-italic': ['poppins-extra-bold-italic'],
        'poppins-extra-light': ['poppins-extra-light'],
        'poppins-extra-light-italic': ['poppins-extra-light-italic'],
        'poppins-italic': ['poppins-italic'],
        'poppins-light': ['poppins-light'],
        'poppins-light-italic': ['poppins-light-italic'],
        'poppins-medium': ['poppins-medium'],
        'poppins-medium-italic': ['poppins-medium-italic'],
        'poppins-semibold': ['poppins-semibold'],
        'poppins-semibold-italic': ['poppins-semibold-italic'],
        'poppins-thin': ['poppins-thin'],
        'poppins-thin-italic': ['poppins-thin-italic'],
      }
    },
  },
  plugins: [],
}