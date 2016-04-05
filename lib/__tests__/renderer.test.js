import assert from 'assert';
import { createCssRules, renderers, stringifyFnForSelector, xxxx } from '../renderer';

describe('renderer', () => {
  describe('#createCssRules', () => {
    it('creates markup', () => {
      const markup = createCssRules({opacity: 0});
      assert.equal(markup, 'opacity:0;')
    });

    it('creates markup for multiple rules', () => {
      const actualMarkup = createCssRules({opacity: 0, fontSize: 10, color: 'tomato'});
      const expectedMarkup = "opacity:0;font-size:10px;color:tomato;";
      assert.equal(actualMarkup, expectedMarkup);
    });

    it('creates hyphenate css property', () => {
      const markup = createCssRules({fontSize: '10px'});
      assert.equal(markup, 'font-size:10px;')
    });

    it('trims property value', () => {
      const markup = createCssRules({fontSize: ' 10px '});
      assert.equal(markup, 'font-size:10px;')
    });

    it('converts numbers to px values', () => {
      const markup = createCssRules({fontSize: 10});
      assert.equal(markup, 'font-size:10px;');
    });

    it('creates no markup for empty object', () => {
      const markup = createCssRules({});
      assert.equal(markup, '')
    });

    it('creates no markup for undefined styles', () => {
      const markup = createCssRules(undefined);
      assert.equal(markup, '')
    });
  });

  describe('#xxxx', () => {
    it('renderes a declaration', () => {
      const selector = 'my-class';
      const declaration = { opacity: 0 };
      const actualDeclaration = xxxx(selector, declaration);
      const expectedDeclaration = '.my-class{opacity:0;}';

      assert.equal(expectedDeclaration, actualDeclaration);
    });

    it('renderes a media query', () => {
      const mediaQuery = '@media screen';
      const styles = new Map();
      styles.set('my-class', { opacity: 0 });

      const actualDeclaration = xxxx(mediaQuery, styles);
      const expectedDeclaration = '@media screen{.my-class{opacity:0;}}';

      assert.equal(expectedDeclaration, actualDeclaration);
    });
  });



  describe('#stringifyFnForSelector', () => {
    describe('returns correct fn when options', () => {
      describe('pretty and selector is a', () => {
        it('Media Selector', () => {
          const selector = '@media screen';
          const stringifyFn = stringifyFnForSelector(selector, {pretty: true});
          assert.equal(stringifyFn, renderers.pretty.stringifyMediaQuery);
        });

        it('Keyframe Selector', () => {
          const selector = '@keyframe my-animation';
          const stringifyFn = stringifyFnForSelector(selector, {pretty: true});

          assert.equal(stringifyFn, renderers.pretty.stringifyKeyframeAnimation);
        });

        it('Other Selector', () => {
          const selector = '.my-class';
          const stringifyFn = stringifyFnForSelector(selector, {pretty: true});

          assert.equal(stringifyFn, renderers.pretty.stringifyCssDeclaration);
        });
      });
      describe('minified and selector is a', () => {
        it('Media Query', () => {
          const selector = '@media screen';
          const stringifyFn = stringifyFnForSelector(selector, {pretty: false});
          assert.equal(stringifyFn, renderers.default.stringifyMediaQuery);
        });

        it('Keyframe Selector', () => {
          const selector = '@keyframe my-animation';
          const stringifyFn = stringifyFnForSelector(selector, {pretty: false});

          assert.equal(stringifyFn, renderers.default.stringifyKeyframeAnimation);
        });

        it('Other Selector', () => {
          const selector = '.my-class';
          const stringifyFn = stringifyFnForSelector(selector, {pretty: false});

          assert.equal(stringifyFn, renderers.default.stringifyCssDeclaration);
        });
      });
    });
  });

  describe('#rendererForOptions', () => {
    const STYLES = {opacity: 0, fontSize: 10, color: 'tomato'};

    describe('minified', () => {
      const rulesStringified = 'opacity:0;font-size:10px;color:tomato;';
      const declarationStringified = `.my-class{${rulesStringified}}`;
      const renderer = renderers.default;

      it('CSS Rules', () => {
        const actualRules = renderer.stringifyRules(STYLES);
        assert.equal(actualRules, rulesStringified);
      });

      it('CSS Declaration', () => {
        const className = 'my-class';
        const actualDeclaration = renderer.stringifyCssDeclaration(className, rulesStringified);
        assert.equal(actualDeclaration, declarationStringified);
      });

      it('Media Query', () => {
        const mediaQuery = '@media screen';
        const actualDeclaration = renderer.stringifyMediaQuery(mediaQuery, declarationStringified);
        const expectedDeclaration = `@media screen{${declarationStringified}}`;

        assert.equal(actualDeclaration, expectedDeclaration);
      });

      it('Keyframe Animation', () => {
        const keyframeAnimation = '@keyframe my-animation';
        const animation = {
          0: { opacity: 0 },
          100: { opacity: 1 }
        };

        const expectedAnimation= '0% {opacity:0;} 100% {opacity:1;}';
        const expectedDeclaration = `@keyframe my-animation{${expectedAnimation}}`;
        const actualDeclaration = renderer.stringifyKeyframeAnimation(keyframeAnimation, animation);

        assert.equal(actualDeclaration, expectedDeclaration);
      });
    });

    describe('pretty', () => {
      const renderer = renderers.pretty;
      const rulesStringified = 'opacity:0;\nfont-size:10px;\ncolor:tomato;\n';
      const declarationStringified = `.my-class {\n${rulesStringified}}\n`;

      it('CSS Rules', () => {
        const actualRules = renderer.stringifyRules(STYLES);
        const expectedRules = rulesStringified;

        assert.equal(actualRules, expectedRules);
      });

      it('CSS Declaration', () => {
        const className = 'my-class';
        const actualDeclaration = renderer.stringifyCssDeclaration(className, rulesStringified);

        assert.equal(actualDeclaration, declarationStringified);
      });

      it('Media Query', () => {
        const mediaQuery = '@media screen';
        const actualDeclaration = renderer.stringifyMediaQuery(mediaQuery, declarationStringified);
        const expectedDeclaration = `@media screen {\n${declarationStringified}}\n`;

        assert.equal(actualDeclaration, expectedDeclaration);
      });

      it('Keyframe Animation', () => {
        const keyframeAnimation = '@keyframe my-animation';
        const animation = {
          0: { opacity: 0 },
          100: { opacity: 1 }
        };

        const expectedAnimation= '0% {\nopacity:0;\n}\n 100% {\nopacity:1;\n}\n';
        const expectedDeclaration = `@keyframe my-animation{\n${expectedAnimation}\n}\n`;
        const actualDeclaration = renderer.stringifyKeyframeAnimation(keyframeAnimation, animation);

        assert.equal(actualDeclaration, expectedDeclaration);
      });
    });
  });
});
