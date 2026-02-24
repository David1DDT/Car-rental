import type { Config } from 'tailwindcss'
import flyonui from 'flyonui'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    'node_modules/flyonui/dist/flyonui.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [flyonui],
}

export default config
