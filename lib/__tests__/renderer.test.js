import assert from 'assert';
import { createMarkup, renderers } from '../renderer';

describe('renderer', () => {
  describe('#createMarkup', () => {
    it('creates markup', () => {
      const markup = createMarkup({opacity: 0});
      assert.equal(markup, 'opacity:0;')
    });

    it('creates markup for multiple rules', () => {
      const actualMarkup = createMarkup({opacity: 0, fontSize: 10, color: 'tomato'});
      const expectedMarkup = "opacity:0;font-size:10px;color:tomato;";
      assert.equal(actualMarkup, expectedMarkup);
    });

    it('creates hyphenate css property', () => {
      const markup = createMarkup({fontSize: '10px'});
      assert.equal(markup, 'font-size:10px;')
    });

    it('trims property value', () => {
      const markup = createMarkup({fontSize: ' 10px '});
      assert.equal(markup, 'font-size:10px;')
    });

    it('converts numbers to px values', () => {
      const markup = createMarkup({fontSize: 10});
      assert.equal(markup, 'font-size:10px;');
    });

    it('creates no markup for empty object', () => {
      const markup = createMarkup({});
      assert.equal(markup, '')
    });

    it('creates no markup for undefined styles', () => {
      const markup = createMarkup(undefined);
      assert.equal(markup, '')
    });
  });

  describe('#rendererForOptions', () => {
    const CSS_RULES = {opacity: 0, fontSize: 10, color: 'tomato'};
    const CSS_RULES_STRINGIFIED = 'opacity:0;font-size:10px;color:tomato;';

    describe('minified', () => {
      const renderer = renderers.default;
      it('CSS Rules', () => {
        const actualRules = renderer.stringifyMarkup(CSS_RULES);

        assert.equal(actualRules, CSS_RULES_STRINGIFIED);
      });

      it('CSS Declaration', () => {
        const className = 'my-class';
        const actualDeclaration = renderer.stringifyCSSDeclaration(className, CSS_RULES_STRINGIFIED);
        const expectedDeclaration = `.my-class{${CSS_RULES_STRINGIFIED}}`;

        assert.equal(actualDeclaration, expectedDeclaration);
      });

      it('Media Query', () => {
        const cssDeclaration = '.my-class{opacity:0.5}';
        const mediaQuery = '@media screen';
        const actualDeclaration = renderer.stringifyMediaQuery(mediaQuery, cssDeclaration);
        const expectedDeclaration = '@media screen{.my-class{opacity:0.5}}';

        assert.equal(actualDeclaration, expectedDeclaration);
      });
    });

    describe('pretty', () => {
      const renderer = renderers.pretty;

      it('CSS Rules', () => {
        const actualRules = renderer.stringifyMarkup(CSS_RULES);
        const expectedRules = 'opacity:0;\nfont-size:10px;\ncolor:tomato;\n';

        assert.equal(actualRules, expectedRules);
      });

      it('CSS Declaration', () => {

      });

      xit('Media Query', () => {

      });
    });
  });
});


