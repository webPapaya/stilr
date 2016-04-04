import { isPropertyUnitfull } from './properties';
import {
  hyphenate,
  isNumber,
} from './utils';

export const createCssRules = (styleDeclaration = {}) => {
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

const addLineBreakAfterEveryRule = (rules) =>
  rules.split(';').join(';\n');

export const renderers = {
  default: {
    stringifyCssDeclaration(className, markup) {
      return `.${ className }{${ markup }}`
    },
    stringifyMediaQuery(className, mediaQueryCSS) {
      return `${ className }{${ mediaQueryCSS }}`;
    },
    stringifyRules(styleDeclaration) {
      return createCssRules(styleDeclaration);
    },
    stringifyKeyframeAnimation(keyframeSelector, animation) {
      const stringifiedAnimation = Object.keys(animation).map((animationPosition) => {
        const rulesForAnimation = animation[animationPosition];
        return `${animationPosition}% {${this.stringifyRules(rulesForAnimation)}}`;
      });
      return `${keyframeSelector}{${stringifiedAnimation.join(' ')}}`;
    }
  },
  pretty: {
    stringifyCssDeclaration(className, markup) {
      return `.${ className } {\n${ markup }}\n`;
    },
    stringifyMediaQuery(className, mediaQueryCSS) {
      return `${ className } {\n${ mediaQueryCSS }}\n`;
    },
    stringifyRules(styleDeclaration) {
      const rules = createCssRules(styleDeclaration);
      return addLineBreakAfterEveryRule(rules);
    },
    stringifyKeyframeAnimation(keyframeSelector, animation) {
      const stringifiedAnimation = Object.keys(animation).map((animationPosition) => {
        const rulesForAnimation = animation[animationPosition];
        return `${animationPosition}% {\n${this.stringifyRules(rulesForAnimation)}}\n`;
      });
      return `${keyframeSelector}{\n${stringifiedAnimation.join(' ')}\n}\n`;
    }
  }
};

export const rendererForOptions = (options) => {
  return options.pretty
    ? renderers.pretty
    : renderers.default;
};

export const stringifyFnForSelector = (selector) => {
  if(selector.startsWith('@keyframe')) {
    return renderers.pretty.stringifyKeyframeAnimation;
  }
  if(selector.startsWith('@media')) {
    return renderers.pretty.stringifyMediaQuery;
  }
  return renderers.pretty.stringifyCssDeclaration;
};