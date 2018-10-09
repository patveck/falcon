import { fonts } from './fonts';

const meta = {
  colors: {
    input: {
      type: 'color'
    }
  },

  spacing: {
    input: {
      type: 'number',
      min: 0,
      step: 1,
      max: 100
    },
    unit: 'px'
  },

  fonts: {
    input: {
      type: 'dropdown',
      options: fonts
    }
  },

  fontSizes: {
    input: {
      type: 'number',
      min: 0,
      step: 1,
      max: 80
    },

    unit: 'px'
  },

  fontWeights: {
    input: {
      type: 'text'
    }
  },

  lineHeights: {
    input: {
      type: 'number',
      min: 0,
      step: 0.1,
      max: 3
    },

    unit: 'px'
  },

  letterSpacings: {
    input: {
      type: 'text'
    }
  },

  breakpoints: {
    input: {
      type: 'number',
      step: 1,
      min: 0,
      max: 2048
    },

    unit: 'px'
  },

  borders: {
    input: {
      type: 'text'
    }
  },

  borderRadius: {
    input: {
      type: 'number',
      min: 0,
      step: 1,
      max: 100
    },

    unit: 'px'
  },

  boxShadows: {
    input: {
      type: 'text'
    }
  },
  easingFunctions: {
    input: {
      type: 'text'
    }
  },

  transitionDurations: {
    input: {
      type: 'text'
    }
  }
};

export const Categories = {
  colors: {
    name: 'Colors',
    mappings: [meta.colors]
  },

  spacing: {
    name: 'Spacing',
    mappings: [meta.spacing]
  },

  typography: {
    name: 'Typography',
    mappings: [meta.fonts, meta.fontSizes, meta.fontWeights, meta.letterSpacings, meta.lineHeights]
  },

  breakpoints: {
    name: 'Breakpoints',
    mappings: [meta.breakpoints]
  },

  borders: {
    name: 'Borders',
    mappings: [meta.borders, meta.borderRadius]
  },

  misc: {
    name: 'Miscellaneous',
    mappings: [meta.boxShadows, meta.easingFunctions, meta.transitionDurations]
  }
};
