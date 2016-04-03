import assert from 'assert';
import { createMarkup } from '../renderer';

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
      xit('CSS Rules', () => {

      });

      xit('CSS Declaration', () => {

      });

      xit('Media Query', () => {

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


