import assert from 'assert';
import * as utils from '../utils';

describe('renderer', () => {
  describe('#createMarkup', () => {
    it('creates markup', () => {
      const markup = utils.createMarkup({opacity: 0});
      assert.equal(markup, 'opacity:0;')
    });

    it('creates hyphenate css property', () => {
      const markup = utils.createMarkup({fontSize: '10px'});
      assert.equal(markup, 'font-size:10px;')
    });

    it('trims property value', () => {
      const markup = utils.createMarkup({fontSize: ' 10px '});
      assert.equal(markup, 'font-size:10px;')
    });

    it('converts numbers to px values', () => {
      const markup = utils.createMarkup({fontSize: 10});
      assert.equal(markup, 'font-size:10px;');
    });

    it('creates no markup for empty object', () => {
      const markup = utils.createMarkup({});
      assert.equal(markup, '')
    });

    it('creates no markup for undefined styles', () => {
      const markup = utils.createMarkup(undefined);
      assert.equal(markup, '')
    });
  });
});


