import assert from 'assert';
import { stringifyMarkup } from '../renderer';

describe('renderer', () => {
  describe('#createMarkup', () => {
    it('creates markup', () => {

      const markup = stringifyMarkup({opacity: 0});
      assert.equal(markup, 'opacity:0;')
    });

    it('creates hyphenate css property', () => {
      const markup = stringifyMarkup({fontSize: '10px'});
      assert.equal(markup, 'font-size:10px;')
    });

    it('trims property value', () => {
      const markup = stringifyMarkup({fontSize: ' 10px '});
      assert.equal(markup, 'font-size:10px;')
    });

    it('converts numbers to px values', () => {
      const markup = stringifyMarkup({fontSize: 10});
      assert.equal(markup, 'font-size:10px;');
    });

    it('creates no markup for empty object', () => {
      const markup = stringifyMarkup({});
      assert.equal(markup, '')
    });

    it('creates no markup for undefined styles', () => {
      const markup = stringifyMarkup(undefined);
      assert.equal(markup, '')
    });
  });
});


