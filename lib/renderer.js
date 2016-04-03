import { isPropertyUnitfull } from './properties';
import {
  hyphenate,
  isNumber,
} from './utils';

export const createMarkup = (styleDeclaration = {}, options = {pretty: false}) => {
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

export const renderers = {
  default: {
    stringifyCSSDeclaration(className, markup) {
      return `.${ className }{${ markup }}`
    },
    stringifyMediaQuery(className, mediaQueryCSS) {
      return `${ className }{${ mediaQueryCSS }}`;
    },
    stringifyMarkup(styleDeclaration) {
      return createMarkup(styleDeclaration);
    }
  },
  pretty: {
    stringifyCSSDeclaration(className, markup) {
      return `.${ className } {\n${ markup }}\n`;
    },
    stringifyMediaQuery(className, mediaQueryCSS) {
      return `${ className } {\n${ mediaQueryCSS }}\n`;
    },
    stringifyMarkup(styleDeclaration) {
      return createMarkup(styleDeclaration).split(';').join(';\n');
    }
  }
};

export const rendererForOptions = (options) => {
  return options.pretty
    ? renderers.pretty
    : renderers.default;
};

