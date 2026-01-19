import { globalCss } from '@ignite-ui/react'

export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },

  '*::-webkit-scrollbar': {
    width: '$2',
    height: '$2',
  },

  '*::-webkit-scrollbar-track': {
    background: '$gray800',
  },

  '*::-webkit-scrollbar-thumb': {
    border: '1px solid $gray800',
    borderRadius: '9999px',
    background: '$gray200',
  },

  body: {
    backgroundColor: '$gray900',
    color: '$gray100',
    '-webkit-font-smoothing': 'antialiased',
  },
})
