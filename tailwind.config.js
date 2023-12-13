/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        extend: {
            fontFamily: {
                'default': ['DungGeunMo', 'sans-serif'],
            },
            colors: {
                bgColor: '#00007f',
                white: '#ccc',
                whiteHover: '#eaeaea',
                gray: 'gray',
                grayHover: 'darkgray',
                darkBlue: '#040461',
                warning: 'orangered',
                warningHover: 'rgb(255, 98, 40)',
            },
            borderWidth: {
                '3': '3px',
                '5': '5px',
              },
              borderColor: {
                'custom-blue': 'rgba(0, 0, 255, 1)',
                'custom-black': '#000000',
              },
        },
    },
    plugins: [],
}

