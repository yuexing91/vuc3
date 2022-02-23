import { esprimaHelper } from '@';
import { astToCode } from '@/helpers/esprimaHelper';

function genParamsCode(config) {
  return config.params.map(getP);
}

function getP(p) {
  return {
    id: p.id,
    name: p.name,
    code: ( p.type == 'string' ? `'${ p.value }'` : p.value ),
  };
}

function genThenCode(request) {
  let { thenExprs, binds, resultId } = request;
  resultId = resultId || '';

  let getOldBindCode = (path) => {
    let index = binds.findIndex(bind => bind.path === path);
    if (index != -1) {
      return binds.splice(0, index + 1);
    }
    return [];
  };

  let getBindCode = (bind) => {
    return `${ bind.path } = ${ resultId }${ bind.value }`;
  };

  let codes = [];
  thenExprs?.forEach(expr => {
    if (expr.bindPath) {
      getOldBindCode(expr.bindPath).forEach(bind => {
        codes.push(getBindCode(bind));
      });
    } else {
      codes.push(astToCode(expr));
    }
  });

  binds.forEach(bind => codes.push(getBindCode(bind)));

  return `then((${ resultId })=>{ ${ codes.join('\n') } })`;
}

function genCode(request) {
  let { method, url } = request;
  let methodParams = [`'${ url }'`];
  let other;
  let paramsCode = createObjectCode(genParamsCode(request.config));
  if (['post', 'put', 'patch'].includes(method)) {
    other = 'data';
    request.config.data.id = 'data';
    methodParams.push(getP(request.config.data).code);
  } else {
    if (request.config.length == 1) {
      other = 'params';
      methodParams.push(paramsCode);
    }
  }

  let configCodes = [];
  for(let key in request.config) {
    if (key == other) continue;
    let value = request.config[key];
    if (key === 'params') {
      configCodes.push({
        id: 'params',
        code: paramsCode,
      });
    } else {
      value.id = key;
      configCodes.push(getP(value));
    }
  }

  if (configCodes.length) {
    methodParams.push(createObjectCode(configCodes));
  }

  let code = `axios.${ method }(${ methodParams.join(',') })`;

  let thenCode = genThenCode(request);
  if (thenCode) {
    code = code + '.' + thenCode;
  }

  let codes = [];
  if (request.before) {
    codes.push(request.before);
  }
  codes.push(code);
  if (request.after) {
    codes.push(request.after);
  }
  return esprimaHelper.formatCode(codes.join('\n'));
}

function createObjectCode(props) {
  let code = props.map(p => {
    let t = [];
    if (p.name) t.push('//' + p.name);
    t.push(p.id + ':' + p.code);
    return t.join('\n');
  }).join(',');
  return `{${ code }}`;
}

export default genCode;
