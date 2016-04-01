import {
  sortObject,
  createClassName,
  createMarkup,
  seperateStyles,
  isEmpty,
} from './utils';

const globalStylesheet = new Map();

const renderers = {
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


export default {
  create( styles, stylesheet = globalStylesheet ) {
    if ( !(stylesheet instanceof Map) ) throw new Error(`${ stylesheet } should be a Map`);

    return Object.keys( styles ).reduce( ( acc, key ) => {

      const { style, pseudos, mediaQueries } = seperateStyles( styles[key] );
      const className = createClassName( sortObject( style ));

      if (className === undefined) {
        acc[ key ] = '';
        return acc;
      }

      if ( !stylesheet.has( className ) )
        stylesheet.set( className, style );

      if ( pseudos.length ) {
        pseudos.map( selector => {
          delete style[selector];
          const pseudoClassName = `${className}${selector}`;

          if ( stylesheet.has( pseudoClassName ) ) return false;

          stylesheet.set( pseudoClassName, styles[key][selector] );
        });
      }

      if ( mediaQueries.length ) {
        mediaQueries.map( selector => {
          let mqSelector = selector;
          let mqStyles = styles[key][selector];
          let mqPseudos = [];
          let mqStylesheet;

          if ( Array.isArray(selector) ) {
            mqSelector = selector[0];
            mqStyles = selector[1];
            mqPseudos = selector.slice(2);
          }

          delete style[mqSelector];


          if ( stylesheet.has( mqSelector ) ) {
            mqStylesheet = stylesheet.get( mqSelector );

            if ( mqStylesheet.has( className )) return false;
          }

          mqStylesheet = mqStylesheet
            || stylesheet.set( mqSelector, new Map() ).get( mqSelector );

          mqStylesheet.set( className, mqStyles );

          if ( mqPseudos.length ) {
            mqPseudos.map( pseudo => {
              delete mqStyles[pseudo];
              const pseudoClassName = `${className}${pseudo}`;

              if ( mqStylesheet.has( pseudoClassName ) ) return false;
              mqStylesheet.set( pseudoClassName, styles[key][mqSelector][pseudo] );
            });
          }
        });
      }

      acc[ key ] = className;
      return acc;
    }, {});
  },

  render(options = { pretty: false }, stylesheet = globalStylesheet ) {
    const stylesheetEntries = stylesheet.entries();

    let css = '';
    let mediaQueries = '';

    for ( const entry of stylesheetEntries ) {
      const className = entry[0];
      const styles = entry[1];
      const isMap = styles instanceof Map;

      if (!isMap && isEmpty(styles)) continue;

      if (isMap) {
        const mediaQueryCSS = this.render(options, stylesheet.get( className ) );
        mediaQueries += options.pretty
          ? renderers.pretty.stringifyMediaQuery(className, mediaQueryCSS)
          : renderers.default.stringifyMediaQuery(className, mediaQueryCSS);
        continue;
      }

      const markup = createMarkup( styles );
      css += options.pretty
        ? renderers.pretty.stringifyCSSDeclaration(className, markup)
        : renderers.default.stringifyCSSDeclaration(className, markup);
    }

    return css + mediaQueries;
  },

  clear( stylesheet = globalStylesheet ) {
    stylesheet.clear();
    return !stylesheet.size;
  },

  Map,

  __stylesheet: globalStylesheet
};
