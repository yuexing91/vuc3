let styleId = 1;

export function parseStyleStr(styleStr) {
  let styles = [];

  if (styleStr) {
    let comments = {};
    let i = 0;
    let innerStyle = styleStr.replace(/\/\*+(.*)?\*+\//g, function (match, g1) {
      let key = '$' + i++;
      comments[key] = g1;
      return key;
    });

    function parse(str, comment) {
      str.split(';').forEach((s) => {
        s = s.trim();
        if (!s) return;

        if (comment && comments[s]) {
          return parse(comments[s], false);
        }

        styles.push({
          id: ++styleId,
          k: s.split(':')[0],
          v: s.split(':')[1],
          comment,
        });
      });
    }

    parse(innerStyle, true);
  }

  return styles;
}

export function styleToStr(styles) {
  return styles
    .map((style) => {
      let s = style.k + ':' + style.v + ';';
      if (!style.comment) {
        return `/* ${s} */`;
      }
      return s;
    })
    .join('');
}

export function newStyle() {
  return {
    id: ++styleId,
    k: ' ',
    v: ' ',
    comment: true,
  };
}
