/** @type {import('tailwindcss').Config} */
// (this is comment for disabling eslint, must be comment)
// eslint-disable-next-line
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // I have place another font in fontFamily, give sans property to implement in all files, I have overwrite tailwind default class, if I want new font I could place in extend object, like pizza:"Roboto Mono, monospace  "
    fontFamily: { sans: "Roboto Mono, monospace  " },
    // I have overight height property of screen earlier was "100vh" "100dvh" (dinamic viewport height, it is better with smaller screens)
    extend: {
      height: {
        screen: "100dvh",
      },
    },
  },
  plugins: [],
};
