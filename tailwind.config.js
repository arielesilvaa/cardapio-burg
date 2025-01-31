
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html', // Arquivos HTML na raiz
    './js/**/*.js', // Arquivos JS na pasta "js" (ou outro diretório relevante)
  ],
  theme: {
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
    },
    extend: {
      backgroundImage: {
        home: "url('/asset/bg.png')",
      },
    },
  },
  plugins: [],
};