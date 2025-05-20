import type { Config } from 'tailwindcss'
import { Icons, type Options } from 'tailwindcss-plugin-icons'

const options: Options = ({ theme }) => ({
  heroicons: {
    icons: {
      'plus-circle': {
        cursor: 'pointer',
        color: theme('colors.emerald.600'),
        '&:hover': {
          color: theme('colors.emerald.800'),
        },
      },
      'trash?bg': {},
    },
    includeAll: true,
    scale: iconName => (iconName.endsWith('-20-solid') ? 1.25 : 1.5),
    location: 'https://esm.sh/@iconify-json/heroicons@1.1.9/icons.json',
  },
})

export default {
  plugins: [Icons(options)],
} as Config
