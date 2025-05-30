
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html', // Arquivos HTML na raiz
    './js/**/*.js', // Arquivos JS na pasta "js" (ou outro diretório relevante)
  ],
  theme: {
    fontFamily: {
      quicksand: ['"Quicksand"', 'sans-serif'],
    },
    extend: {
      backgroundImage: {
        home: "url('/asset/bg.png')",
      },
    },
  },
  plugins: [],
};