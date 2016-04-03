import { isPropertyUnitfull } from './properties';

import {
  hyphenate,
  isNumber,
} from './utils';

export const renderers = {
  default: {
    stringifyCSSDeclaration(className, markup) {
      return `.${ className }{${ markup }}`
    },
    stringifyMediaQuery(className, mediaQueryCSS) {
      return `${ className }{${ mediaQueryCSS }}`;
    }
  },
  pretty: {
    stringifyCSSDeclaration(className, markup) {
      return `.${ className } {\n${ markup.split(';').join(';\n')}}\n`;
    },
    stringifyMediaQuery(className, mediaQueryCSS) {
      return `${ className } {\n${ mediaQueryCSS }}\n`;
    }
  }
};

export const rendererForOptions = (options) => {
  return options.pretty
    ? renderers.pretty
    : renderers.default;
};

export const stringifyMarkup = (styleDeclaration = {}) => {
  const rules = Object.keys(styleDeclaration).map((cssProperty) => {
    const rawCssValue = styleDeclaration[cssProperty];
    const hyphenatedProperty = hyphenate(cssProperty);

    let cssValue = rawCssValue;

    if(isNumber(cssValue) && isPropertyUnitfull(hyphenatedProperty)) {
      cssValue += 'px';
    }

    if(cssValue.trim) {
      cssValue = cssValue.trim();
    }

    return `${hyphenatedProperty}:${cssValue};`;
  });
  return rules.join('');
};
