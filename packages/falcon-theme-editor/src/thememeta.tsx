import { Theme, CSSObject } from '@deity/falcon-ui';
import { fonts } from './fonts';

type ThemeMeta = {
  [name in keyof Theme]?: {
    unit?: string;
    input: {
      type: string;
      min?: number;
      step?: number;
      max?: number;
      options?: any[];
    };
    previewCss?: (value: string) => CSSObject;
  }
};

export const Meta: ThemeMeta = {
  colors: {
    input: {
      type: 'color'
    },
    previewCss: value => ({
      backgroundColor: value
    })
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

export const ThemeCategories = {
  colors: {
    name: 'Colors',
    mappings: [Meta.colors]
  },

  spacing: {
    name: 'Spacing',
    mappings: [Meta.spacing]
  },

  typography: {
    name: 'Typography',
    mappings: [Meta.fonts, Meta.fontSizes, Meta.fontWeights, Meta.letterSpacings, Meta.lineHeights]
  },

  breakpoints: {
    name: 'Breakpoints',
    mappings: [Meta.breakpoints]
  },

  borders: {
    name: 'Borders',
    mappings: [Meta.borders, Meta.borderRadius]
  },

  misc: {
    name: 'Miscellaneous',
    mappings: [Meta.boxShadows, Meta.easingFunctions, Meta.transitionDurations]
  }
};
