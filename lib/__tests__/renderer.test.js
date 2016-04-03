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
    describe('minified', () => {
      const renderer = renderers.default;

      it('CSS Rules', () => {
        const cssRules = {opacity: 0, fontSize: 10, color: 'tomato'};
        const actualRules = renderer.stringifyMarkup(cssRules);
        const expectedRules = 'opacity:0;font-size:10px;color:tomato;';

        assert.equal(actualRules, expectedRules);
      });

      it('CSS Declaration', () => {
        const cssRules = 'opacity:0;font-size:10px;color:tomato;';
        const className = 'my-class';
        const actualDeclaration = renderer.stringifyCSSDeclaration(className, cssRules);
        const expectedDeclaration = '.my-class{opacity:0;font-size:10px;color:tomato;}';

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
      xit('CSS Rules', () => {

      });

      xit('CSS Declaration', () => {

      });

      xit('Media Query', () => {

      });
    });
  });
});


