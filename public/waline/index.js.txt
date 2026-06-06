var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// (disabled):crypto
var require_crypto = __commonJS({
  "(disabled):crypto"() {
  }
});

// node_modules/hono/dist/compose.js
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/hono/dist/utils/body.js
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");

// node_modules/hono/dist/utils/url.js
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
var HonoRequest = class {
  static {
    __name(this, "HonoRequest");
  }
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = /* @__PURE__ */ __name((key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  }, "#cachedBody");
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * `.bytes()` parses the request body as a `Uint8Array`.
   *
   * @see {@link https://hono.dev/docs/api/request#bytes}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.bytes()
   * })
   * ```
   */
  bytes() {
    return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var createResponseInstance = /* @__PURE__ */ __name((body, init) => new Response(body, init), "createResponseInstance");
var Context = class {
  static {
    __name(this, "Context");
  }
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = /* @__PURE__ */ __name((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, "render");
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = /* @__PURE__ */ __name((layout) => this.#layout = layout, "setLayout");
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = /* @__PURE__ */ __name(() => this.#layout, "getLayout");
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = /* @__PURE__ */ __name((renderer) => {
    this.#renderer = renderer;
  }, "setRenderer");
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = /* @__PURE__ */ __name((name, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  }, "header");
  status = /* @__PURE__ */ __name((status) => {
    this.#status = status;
  }, "status");
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = /* @__PURE__ */ __name((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, "set");
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = /* @__PURE__ */ __name((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, "get");
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, { status, headers: responseHeaders });
  }
  newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), "newResponse");
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = /* @__PURE__ */ __name((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = /* @__PURE__ */ __name((text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  }, "text");
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = /* @__PURE__ */ __name((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  }, "json");
  html = /* @__PURE__ */ __name((html, arg, headers) => {
    const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  }, "html");
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = /* @__PURE__ */ __name((location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, "redirect");
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name(() => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  }, "notFound");
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = class _Hono {
  static {
    __name(this, "_Hono");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler, r.basePath);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = /* @__PURE__ */ __name((handler) => {
    this.errorHandler = handler;
    return this;
  }, "onError");
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name((handler) => {
    this.#notFoundHandler = handler;
    return this;
  }, "notFound");
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler, baseRoutePath) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = {
      basePath: baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
      path,
      method,
      handler
    };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = /* @__PURE__ */ __name((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, "fetch");
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, "request");
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, "fire");
};

// node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = /* @__PURE__ */ __name(((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  }), "match2");
  this.match = match2;
  return match2(method, path);
}
__name(match, "match");

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = class _Node {
  static {
    __name(this, "_Node");
  }
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node();
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  static {
    __name(this, "Trie");
  }
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = class {
  static {
    __name(this, "RegExpRouter");
  }
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  static {
    __name(this, "SmartRouter");
  }
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = /* @__PURE__ */ __name((children) => {
  for (const _ in children) {
    return true;
  }
  return false;
}, "hasChildren");
var Node2 = class _Node2 {
  static {
    __name(this, "_Node");
  }
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          if (matcher instanceof RegExp) {
            if (partOffsets === null) {
              partOffsets = new Array(len);
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.substring(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (hasChildren(child.#children)) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  static {
    __name(this, "TrieRouter");
  }
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  static {
    __name(this, "Hono");
  }
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// node_modules/hono/dist/middleware/cors/index.js
var cors = /* @__PURE__ */ __name((options) => {
  const opts = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: [],
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        if (opts.credentials) {
          return (origin) => origin || null;
        }
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return /* @__PURE__ */ __name(async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    __name(set, "set");
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*" || opts.credentials) {
        set("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*" || opts.credentials) {
      c.header("Vary", "Origin", { append: true });
    }
  }, "cors2");
}, "cors");

// node_modules/hono/dist/helper/factory/index.js
var createMiddleware = /* @__PURE__ */ __name((middleware) => middleware, "createMiddleware");

// src/middleware/auth.ts
var auth = createMiddleware(async (c, next) => {
  const header = c.req.header("Authorization");
  let token;
  if (header?.startsWith("Bearer ")) {
    token = header.slice(7);
  }
  if (!token) {
    const urlToken = new URL(c.req.url).searchParams.get("token");
    if (urlToken) token = urlToken;
  }
  if (!token) return next();
  try {
    const jwtSecret = c.env.JWT_SECRET;
    if (!jwtSecret) return next();
    const payload = await verifyJwt(token, jwtSecret);
    if (!payload?.id) return next();
    const user = await c.env.DB.prepare(
      'SELECT id, display_name, email, type, url, avatar, label, github, twitter, facebook, google, weibo, qq, "2fa" FROM wl_Users WHERE id = ?'
    ).bind(payload.id).first();
    if (user && user.type !== "banned") {
      c.set("userInfo", {
        objectId: user.id,
        display_name: user.display_name,
        email: user.email,
        type: user.type,
        url: user.url,
        avatar: user.avatar,
        label: user.label,
        github: user.github,
        twitter: user.twitter,
        facebook: user.facebook,
        google: user.google,
        weibo: user.weibo,
        qq: user.qq,
        "2fa": user["2fa"]
      });
    }
  } catch {
  }
  return next();
});
async function signJwt(payload, secret, expiresIn = 86400 * 30) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1e3);
  const body = { ...payload, iat: now, exp: now + expiresIn };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(body));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(signingInput)
  );
  return `${signingInput}.${base64UrlEncode(signature)}`;
}
__name(signJwt, "signJwt");
async function verifyJwt(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, payload, sig] = parts;
  const signingInput = `${header}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const signatureBytes = base64UrlDecode(sig);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    new TextEncoder().encode(signingInput)
  );
  if (!valid) return null;
  const decoded = JSON.parse(
    new TextDecoder().decode(base64UrlDecode(payload))
  );
  if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1e3)) {
    return null;
  }
  return decoded;
}
__name(verifyJwt, "verifyJwt");
function base64UrlEncode(data) {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
__name(base64UrlEncode, "base64UrlEncode");
function base64UrlDecode(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
__name(base64UrlDecode, "base64UrlDecode");

// src/utils/hash.ts
async function md5(text) {
  const data = new TextEncoder().encode(text);
  const hash2 = await crypto.subtle.digest("MD5", data);
  return Array.from(new Uint8Array(hash2)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(md5, "md5");

// src/utils/avatar.ts
async function getAvatar(email) {
  if (!email) return "";
  const hash2 = await md5(email.trim().toLowerCase());
  return `https://gravatar.com/avatar/${hash2}?d=mp`;
}
__name(getAvatar, "getAvatar");

// src/utils/ua.ts
function parseUA(ua) {
  if (!ua) return { browser: "", os: "" };
  return { browser: parseBrowser(ua), os: parseOS(ua) };
}
__name(parseUA, "parseUA");
function parseBrowser(ua) {
  const browsers = [
    [/Edg(?:e|A|iOS)?\/(\d+[\.\d]*)/, "Edge"],
    [/OPR\/(\d+[\.\d]*)/, "Opera"],
    [/Vivaldi\/(\d+[\.\d]*)/, "Vivaldi"],
    [/Firefox\/(\d+[\.\d]*)/, "Firefox"],
    [/Chrome\/(\d+[\.\d]*)/, "Chrome"],
    [/Version\/(\d+[\.\d]*).*Safari/, "Safari"],
    [/MSIE (\d+[\.\d]*)/, "IE"],
    [/Trident\/.*rv:(\d+[\.\d]*)/, "IE"]
  ];
  for (const [re, name] of browsers) {
    const m = ua.match(re);
    if (m) return `${name} ${m[1]}`;
  }
  return "";
}
__name(parseBrowser, "parseBrowser");
function parseOS(ua) {
  if (/Windows NT 10/.test(ua)) return "Windows 10";
  if (/Windows NT 6\.3/.test(ua)) return "Windows 8.1";
  if (/Windows NT 6\.2/.test(ua)) return "Windows 8";
  if (/Windows NT 6\.1/.test(ua)) return "Windows 7";
  if (/Windows/.test(ua)) return "Windows";
  if (/Mac OS X (\d+[._]\d+)/.test(ua)) {
    const v = ua.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace(/_/g, ".");
    return `macOS ${v}`;
  }
  if (/Macintosh/.test(ua)) return "macOS";
  if (/Android (\d+[\.\d]*)/.test(ua)) {
    return `Android ${ua.match(/Android (\d+[\.\d]*)/)?.[1]}`;
  }
  if (/iPhone OS (\d+[_\d]*)/.test(ua)) {
    const v = ua.match(/iPhone OS (\d+[_\d]*)/)?.[1]?.replace(/_/g, ".");
    return `iOS ${v}`;
  }
  if (/iPad/.test(ua)) return "iPadOS";
  if (/Linux/.test(ua)) return "Linux";
  return "";
}
__name(parseOS, "parseOS");

// src/utils/markdown.ts
function renderMarkdown(text) {
  if (!text) return "";
  let html = text;
  html = escapeHtml(html);
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang, code) => {
    return `<pre><code class="language-${lang || ""}">${code.trim()}</code></pre>`;
  });
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" loading="lazy" />'
  );
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
  html = html.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, "<em>$1</em>");
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");
  html = html.replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>");
  html = html.replace(/<\/blockquote>\n<blockquote>/g, "\n");
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");
  html = html.replace(/^(-{3,}|\*{3,}|_{3,})$/gm, "<hr />");
  html = html.replace(/^[\*\-\+]\s+(.+)$/gm, "<li>$1</li>");
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>");
  html = html.replace(
    /(?<!="|'|>)(https?:\/\/[^\s<)"']+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  html = html.split(/\n{2,}/).map((block) => {
    block = block.trim();
    if (!block) return "";
    if (/^<(h[1-6]|ul|ol|li|blockquote|pre|hr|p|div|table)/.test(block)) {
      return block;
    }
    return `<p>${block}</p>`;
  }).join("\n");
  html = html.replace(/(?<!\n)\n(?!\n)/g, "<br />\n");
  return html.trim();
}
__name(renderMarkdown, "renderMarkdown");
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
__name(escapeHtml, "escapeHtml");

// src/router/settings.ts
var settingsRoutes = new Hono2();
var ALLOWED_KEYS = /* @__PURE__ */ new Set([
  "waline_client_version",
  "comment_default_status",
  "user_comment_default_status",
  "worker_display",
  "llm_mode",
  "llm_skip_admin",
  "llm_endpoint",
  "llm_api_key",
  "llm_model",
  "llm_prompt"
]);
settingsRoutes.get("/", async (c) => {
  const userInfo = c.get("userInfo");
  if (userInfo?.type !== "administrator") {
    return c.json({ errno: 1, errmsg: "Unauthorized" }, 403);
  }
  const result = await c.env.DB.prepare(
    "SELECT key, value FROM wl_Settings"
  ).all();
  const MASKED_KEYS = /* @__PURE__ */ new Set(["llm_api_key"]);
  const settings = {};
  for (const row of result.results) {
    const key = row.key;
    const value = row.value;
    if (MASKED_KEYS.has(key) && value) {
      settings[key] = value.length > 7 ? value.slice(0, 3) + "****" + value.slice(-4) : "****";
    } else {
      settings[key] = value;
    }
  }
  return c.json({ errno: 0, errmsg: "", data: settings });
});
settingsRoutes.put("/", async (c) => {
  const userInfo = c.get("userInfo");
  if (userInfo?.type !== "administrator") {
    return c.json({ errno: 1, errmsg: "Unauthorized" }, 403);
  }
  const body = await c.req.json();
  const stmts = [];
  for (const [key, value] of Object.entries(body)) {
    if (!ALLOWED_KEYS.has(key)) continue;
    stmts.push(
      c.env.DB.prepare(
        `INSERT INTO wl_Settings (key, value, updatedAt) VALUES (?, ?, datetime('now'))
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt`
      ).bind(key, String(value))
    );
  }
  if (stmts.length > 0) {
    await c.env.DB.batch(stmts);
  }
  return c.json({ errno: 0, errmsg: "" });
});
async function getSetting(db, key) {
  const row = await db.prepare(
    "SELECT value FROM wl_Settings WHERE key = ?"
  ).bind(key).first();
  return row ? row.value : null;
}
__name(getSetting, "getSetting");
async function getSettings(db, keys) {
  const placeholders = keys.map(() => "?").join(",");
  const result = await db.prepare(
    `SELECT key, value FROM wl_Settings WHERE key IN (${placeholders})`
  ).bind(...keys).all();
  const settings = {};
  for (const row of result.results) {
    settings[row.key] = row.value;
  }
  return settings;
}
__name(getSettings, "getSettings");

// src/utils/llm-review.ts
async function reviewComment(db, commentText, nick, url, defaultStatus) {
  const settings = await getSettings(db, [
    "llm_endpoint",
    "llm_api_key",
    "llm_model",
    "llm_prompt"
  ]);
  if (!settings.llm_endpoint || !settings.llm_api_key) return defaultStatus;
  const systemPrompt = settings.llm_prompt || "You are a review bot. Your task is to review the comments according to following rules: 1. Any contact information should not be included, including qq number, email, phone number, etc. 2. Any content with advertising or sensitive information should not be included. 3. Any other content that is not suitable for public display should not be included. 4. Output should be a single word(approved/spam).";
  try {
    const response = await fetch(settings.llm_endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${settings.llm_api_key}`
      },
      body: JSON.stringify({
        model: settings.llm_model || "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: commentText }
        ]
      })
    });
    if (!response.ok) return defaultStatus;
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content?.trim()?.toLowerCase();
    if (!content) return defaultStatus;
    if (content === "approved" || content === "spam") return content;
    return "waiting";
  } catch {
    return defaultStatus;
  }
}
__name(reviewComment, "reviewComment");

// src/router/comment.ts
var commentRoutes = new Hono2();
commentRoutes.get("/", async (c) => {
  const type = c.req.query("type");
  switch (type) {
    case "recent":
      return getRecentComments(c);
    case "count":
      return getCommentCount(c);
    case "list":
      return getAdminCommentList(c);
    default:
      return getCommentList(c);
  }
});
commentRoutes.post("/", async (c) => {
  const body = await c.req.json();
  const { comment, nick, mail, link, url, ua, pid, rid, at } = body;
  if (!url) {
    return c.json({ errno: 1, errmsg: "url is required" }, 400);
  }
  if (!comment) {
    return c.json({ errno: 1, errmsg: "comment is required" }, 400);
  }
  if (typeof comment !== "string" || comment.length > 65536) {
    return c.json({ errno: 1, errmsg: "comment is too long (max 64KB)" }, 400);
  }
  if (nick && (typeof nick !== "string" || nick.length > 255)) {
    return c.json({ errno: 1, errmsg: "nick is too long (max 255 chars)" }, 400);
  }
  if (mail && (typeof mail !== "string" || mail.length > 255)) {
    return c.json({ errno: 1, errmsg: "mail is too long (max 255 chars)" }, 400);
  }
  if (link && (typeof link !== "string" || link.length > 255)) {
    return c.json({ errno: 1, errmsg: "link is too long (max 255 chars)" }, 400);
  }
  if (url && (typeof url !== "string" || url.length > 1024)) {
    return c.json({ errno: 1, errmsg: "url is too long (max 1024 chars)" }, 400);
  }
  if (ua && (typeof ua !== "string" || ua.length > 1024)) {
    return c.json({ errno: 1, errmsg: "ua is too long (max 1024 chars)" }, 400);
  }
  const ip = c.req.header("CF-Connecting-IP") || "";
  const userInfo = c.get("userInfo");
  let status;
  if (userInfo) {
    const userDefault = await getSetting(c.env.DB, "user_comment_default_status").catch(() => null);
    status = userDefault === "waiting" ? "waiting" : "approved";
  } else {
    const defaultStatus = await getSetting(c.env.DB, "comment_default_status").catch(() => null);
    if (defaultStatus === "waiting" || defaultStatus === "approved") {
      status = defaultStatus;
    } else if (c.env.AUDIT) {
      status = "waiting";
    } else {
      status = "approved";
    }
  }
  const renderedComment = renderMarkdown(comment);
  const result = await c.env.DB.prepare(
    `INSERT INTO wl_Comment (user_id, comment, orig, ip, link, mail, nick, pid, rid, sticky, status, "like", ua, url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 0, ?, ?)`
  ).bind(
    userInfo?.objectId ?? null,
    renderedComment,
    comment,
    ip,
    link || "",
    userInfo?.email || mail || "",
    userInfo?.display_name || nick || "",
    pid || null,
    rid || null,
    status,
    ua || "",
    url
  ).run();
  if (!result.success) {
    return c.json({ errno: 1, errmsg: "Failed to create comment" }, 500);
  }
  const newComment = await c.env.DB.prepare(
    "SELECT * FROM wl_Comment WHERE id = last_insert_rowid()"
  ).first();
  if (newComment) {
    const commentId = newComment.id;
    const db = c.env.DB;
    c.executionCtx.waitUntil(
      (async () => {
        const llmMode = await getSetting(db, "llm_mode").catch(() => null) || "off";
        if (llmMode === "off") return;
        if (llmMode === "anonymous" && userInfo) return;
        if (userInfo?.type === "administrator") {
          const skip = await getSetting(db, "llm_skip_admin").catch(() => null);
          if (skip !== "0") return;
        }
        const newStatus = await reviewComment(db, comment, nick || "", url, status);
        if (newStatus === status) return;
        await db.prepare(
          `UPDATE wl_Comment SET status = ?, updatedAt = datetime('now')
           WHERE id = ? AND status = ?`
        ).bind(newStatus, commentId, status).run();
      })().catch((err) => console.error("[LLM Review Error]", err?.message || err))
    );
  }
  return c.json({
    errno: 0,
    errmsg: "",
    data: await formatComment(newComment)
  }, 201);
});
commentRoutes.put("/:id", async (c) => {
  const id = c.req.param("id");
  const userInfo = c.get("userInfo");
  const body = await c.req.json();
  const isAdmin = userInfo?.type === "administrator";
  if (body.like !== void 0 && typeof body.like === "boolean") {
    await c.env.DB.prepare(
      `UPDATE wl_Comment SET "like" = MAX(0, "like" + 1), updatedAt = datetime('now') WHERE id = ?`
    ).bind(id).run();
    const updated2 = await c.env.DB.prepare(
      "SELECT * FROM wl_Comment WHERE id = ?"
    ).bind(id).first();
    return c.json({ errno: 0, errmsg: "", data: await formatComment(updated2) });
  }
  if (!isAdmin) {
    return c.json({ errno: 1, errmsg: "Unauthorized" }, 403);
  }
  const updates = [];
  const values = [];
  if (body.status !== void 0) {
    updates.push("status = ?");
    values.push(body.status);
  }
  if (body.comment !== void 0) {
    updates.push("comment = ?");
    values.push(renderMarkdown(body.comment));
    updates.push("orig = ?");
    values.push(body.comment);
  }
  if (body.sticky !== void 0) {
    updates.push("sticky = ?");
    values.push(body.sticky ? 1 : 0);
  }
  if (body.nick !== void 0) {
    updates.push("nick = ?");
    values.push(body.nick);
  }
  if (body.mail !== void 0) {
    updates.push("mail = ?");
    values.push(body.mail);
  }
  if (body.link !== void 0) {
    updates.push("link = ?");
    values.push(body.link);
  }
  if (body.url !== void 0) {
    updates.push("url = ?");
    values.push(body.url);
  }
  if (body.ua !== void 0) {
    updates.push("ua = ?");
    values.push(body.ua);
  }
  if (body.ip !== void 0) {
    updates.push("ip = ?");
    values.push(body.ip);
  }
  if (body.user_id !== void 0) {
    updates.push("user_id = ?");
    values.push(body.user_id);
  }
  if (body.pid !== void 0) {
    updates.push("pid = ?");
    values.push(body.pid);
  }
  if (body.rid !== void 0) {
    updates.push("rid = ?");
    values.push(body.rid);
  }
  if (typeof body.like === "number") {
    updates.push('"like" = ?');
    values.push(Math.max(0, body.like));
  }
  if (updates.length === 0) {
    return c.json({ errno: 1, errmsg: "No fields to update" }, 400);
  }
  updates.push("updatedAt = datetime('now')");
  values.push(id);
  await c.env.DB.prepare(
    `UPDATE wl_Comment SET ${updates.join(", ")} WHERE id = ?`
  ).bind(...values).run();
  const updated = await c.env.DB.prepare(
    "SELECT * FROM wl_Comment WHERE id = ?"
  ).bind(id).first();
  return c.json({ errno: 0, errmsg: "", data: await formatComment(updated) });
});
commentRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const userInfo = c.get("userInfo");
  if (userInfo?.type !== "administrator") {
    return c.json({ errno: 1, errmsg: "Unauthorized" }, 403);
  }
  await c.env.DB.batch([
    c.env.DB.prepare("DELETE FROM wl_Comment WHERE rid = ?").bind(id),
    c.env.DB.prepare("DELETE FROM wl_Comment WHERE id = ?").bind(id)
  ]);
  return c.json({ errno: 0, errmsg: "" });
});
commentRoutes.get("/rss", async (c) => {
  const path = c.req.query("path");
  const email = c.req.query("email");
  const userId = c.req.query("user_id");
  const count = parseInt(c.req.query("count") || "20");
  const limit = Math.min(Math.max(Number.isFinite(count) ? count : 20, 1), 50);
  const siteUrl = c.env.SITE_URL || "";
  const siteName = c.env.SITE_NAME || "Waline";
  let comments;
  if (path) {
    const result = await c.env.DB.prepare(
      `SELECT id, comment, insertedAt, link, nick, url, user_id FROM wl_Comment
       WHERE url = ? AND status NOT IN ('waiting', 'spam')
       ORDER BY insertedAt DESC LIMIT ?`
    ).bind(path, limit).all();
    comments = result.results;
  } else if (email || userId) {
    let parentQuery;
    const parentParams = [];
    if (email && userId) {
      parentQuery = `SELECT id FROM wl_Comment WHERE status NOT IN ('waiting', 'spam') AND (mail = ? OR user_id = ?)`;
      parentParams.push(email, userId);
    } else if (email) {
      parentQuery = `SELECT id FROM wl_Comment WHERE status NOT IN ('waiting', 'spam') AND mail = ?`;
      parentParams.push(email);
    } else {
      parentQuery = `SELECT id FROM wl_Comment WHERE status NOT IN ('waiting', 'spam') AND user_id = ?`;
      parentParams.push(userId);
    }
    const parents = await c.env.DB.prepare(parentQuery).bind(...parentParams).all();
    const parentIds = parents.results.map((r) => r.id);
    if (parentIds.length === 0) {
      return rssResponse(c, buildRssXml({
        title: `${siteName} Reply Comments`,
        link: siteUrl,
        description: "Recent reply comments.",
        items: []
      }));
    }
    const placeholders = parentIds.map(() => "?").join(",");
    const result = await c.env.DB.prepare(
      `SELECT id, comment, insertedAt, link, nick, url, user_id FROM wl_Comment
       WHERE pid IN (${placeholders}) AND status NOT IN ('waiting', 'spam')
       ORDER BY insertedAt DESC LIMIT ?`
    ).bind(...parentIds, limit).all();
    comments = result.results;
  } else {
    const result = await c.env.DB.prepare(
      `SELECT id, comment, insertedAt, link, nick, url, user_id FROM wl_Comment
       WHERE status NOT IN ('waiting', 'spam')
       ORDER BY insertedAt DESC LIMIT ?`
    ).bind(limit).all();
    comments = result.results;
  }
  const userIds = [...new Set(comments.map((r) => r.user_id).filter(Boolean))];
  let users = [];
  if (userIds.length > 0) {
    const placeholders = userIds.map(() => "?").join(",");
    const userResult = await c.env.DB.prepare(
      `SELECT id, display_name, url FROM wl_Users WHERE id IN (${placeholders})`
    ).bind(...userIds).all();
    users = userResult.results;
  }
  const items = comments.map((comment) => {
    const user = users.find((u) => u.id === comment.user_id);
    const nick = user?.display_name || comment.nick || "Anonymous";
    const commentUrl = buildAbsoluteUrl(siteUrl, comment.url);
    const itemLink = commentUrl ? `${commentUrl}#${comment.id}` : "";
    return {
      title: `${nick} commented${comment.url ? ` on ${comment.url}` : ""}`,
      link: itemLink || commentUrl,
      guid: String(comment.id),
      pubDate: comment.insertedAt ? (/* @__PURE__ */ new Date(comment.insertedAt + "Z")).toUTCString() : (/* @__PURE__ */ new Date()).toUTCString(),
      description: comment.comment || ""
    };
  });
  const title = path ? `${siteName} Comments for ${path}` : email || userId ? `${siteName} Reply Comments` : `${siteName} Recent Comments`;
  const description = path ? `Recent comments for ${path}.` : email || userId ? "Recent reply comments." : "Recent comments.";
  return rssResponse(c, buildRssXml({ title, link: siteUrl, description, items }));
});
async function getCommentList(c) {
  const path = c.req.query("path");
  if (!path) {
    return c.json({ errno: 1, errmsg: "path is required" }, 400);
  }
  const page = Math.max(1, parseInt(c.req.query("page") || "1") || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(c.req.query("pageSize") || "10") || 10));
  const sortBy = c.req.query("sortBy") || "insertedAt_desc";
  const orderMap = {
    insertedAt_desc: "insertedAt DESC",
    insertedAt_asc: "insertedAt ASC",
    like_desc: '"like" DESC'
  };
  const orderBy = orderMap[sortBy] || "insertedAt DESC";
  const offset = (page - 1) * pageSize;
  const countResult = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM wl_Comment WHERE url = ? AND rid IS NULL AND pid IS NULL AND status = 'approved'"
  ).bind(path).first();
  const totalCount = countResult?.count || 0;
  const rootComments = await c.env.DB.prepare(
    `SELECT * FROM wl_Comment
     WHERE url = ? AND rid IS NULL AND pid IS NULL AND status = 'approved'
     ORDER BY sticky DESC, ${orderBy}
     LIMIT ? OFFSET ?`
  ).bind(path, pageSize, offset).all();
  const rootIds = rootComments.results.map((r) => r.id);
  let children = [];
  if (rootIds.length > 0) {
    const placeholders = rootIds.map(() => "?").join(",");
    const childResult = await c.env.DB.prepare(
      `SELECT * FROM wl_Comment
       WHERE rid IN (${placeholders}) AND status = 'approved'
       ORDER BY insertedAt ASC`
    ).bind(...rootIds).all();
    children = childResult.results;
  }
  const data = await Promise.all(
    rootComments.results.map(async (root) => ({
      ...await formatComment(root),
      children: await Promise.all(
        children.filter((child) => child.rid === root.id).map((child) => formatComment(child))
      )
    }))
  );
  return c.json({
    errno: 0,
    errmsg: "",
    data: {
      page,
      pageSize,
      count: totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      data
    }
  });
}
__name(getCommentList, "getCommentList");
async function getRecentComments(c) {
  const count = Math.min(50, Math.max(1, parseInt(c.req.query("count") || "10") || 10));
  const result = await c.env.DB.prepare(
    `SELECT * FROM wl_Comment WHERE status = 'approved'
     ORDER BY insertedAt DESC LIMIT ?`
  ).bind(count).all();
  return c.json({
    errno: 0,
    errmsg: "",
    data: await Promise.all(result.results.map((r) => formatComment(r)))
  });
}
__name(getRecentComments, "getRecentComments");
async function getCommentCount(c) {
  const paths = c.req.queries("path") || c.req.queries("path[]") || [];
  if (paths.length === 0) {
    return c.json({ errno: 0, errmsg: "", data: 0 });
  }
  if (paths.length === 1) {
    const result2 = await c.env.DB.prepare(
      "SELECT COUNT(*) as count FROM wl_Comment WHERE url = ? AND status = 'approved'"
    ).bind(paths[0]).first();
    return c.json({
      errno: 0,
      errmsg: "",
      data: [result2?.count || 0]
    });
  }
  const placeholders = paths.map(() => "?").join(",");
  const result = await c.env.DB.prepare(
    `SELECT url, COUNT(*) as count FROM wl_Comment
     WHERE url IN (${placeholders}) AND status = 'approved'
     GROUP BY url`
  ).bind(...paths).all();
  const countMap = Object.fromEntries(
    result.results.map((r) => [r.url, r.count])
  );
  return c.json({
    errno: 0,
    errmsg: "",
    data: paths.map((u) => countMap[u] || 0)
  });
}
__name(getCommentCount, "getCommentCount");
async function getAdminCommentList(c) {
  const userInfo = c.get("userInfo");
  if (userInfo?.type !== "administrator") {
    return c.json({ errno: 1, errmsg: "Unauthorized" }, 403);
  }
  const page = Math.max(1, parseInt(c.req.query("page") || "1") || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(c.req.query("pageSize") || "10") || 10));
  const status = c.req.query("status") || "";
  const keyword = c.req.query("keyword") || "";
  const owner = c.req.query("owner") || "";
  const offset = (page - 1) * pageSize;
  let where = "1=1";
  const params = [];
  if (owner === "mine") {
    where += " AND mail = ?";
    params.push(userInfo.email);
  }
  if (status) {
    where += " AND status = ?";
    params.push(status);
  }
  if (keyword) {
    const escaped = keyword.replace(/[%_\\]/g, "\\$&");
    where += " AND comment LIKE ? ESCAPE '\\'";
    params.push(`%${escaped}%`);
  }
  const countResult = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM wl_Comment WHERE ${where}`
  ).bind(...params).first();
  const result = await c.env.DB.prepare(
    `SELECT * FROM wl_Comment WHERE ${where}
     ORDER BY insertedAt DESC LIMIT ? OFFSET ?`
  ).bind(...params, pageSize, offset).all();
  return c.json({
    errno: 0,
    errmsg: "",
    data: {
      page,
      pageSize,
      spamCount: 0,
      waitingCount: 0,
      totalPages: Math.ceil((countResult?.count || 0) / pageSize),
      data: await Promise.all(result.results.map((r) => formatComment(r, true)))
    }
  });
}
__name(getAdminCommentList, "getAdminCommentList");
async function formatComment(row, isAdmin = false) {
  if (!row) return null;
  const { browser, os } = parseUA(row.ua || "");
  const avatar = await getAvatar(row.mail || "");
  const result = {
    objectId: row.id,
    comment: row.comment || "",
    orig: row.orig || row.comment || "",
    nick: row.nick || "",
    link: row.link || "",
    avatar,
    browser,
    os,
    time: (/* @__PURE__ */ new Date(row.insertedAt + "Z")).getTime(),
    insertedAt: row.insertedAt ? row.insertedAt + "Z" : "",
    createdAt: row.createdAt ? row.createdAt + "Z" : "",
    status: row.status,
    like: row.like || 0,
    url: row.url,
    pid: row.pid,
    rid: row.rid,
    sticky: Boolean(row.sticky),
    user_id: row.user_id
  };
  if (isAdmin) {
    result.mail = row.mail || "";
    result.ip = row.ip || "";
    result.ua = row.ua || "";
  }
  return result;
}
__name(formatComment, "formatComment");
function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
__name(escapeXml, "escapeXml");
function buildAbsoluteUrl(baseUrl, path) {
  if (!path) return baseUrl || "";
  if (/^(https?:)?\/\//i.test(path)) return path;
  if (!baseUrl) return path;
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}
__name(buildAbsoluteUrl, "buildAbsoluteUrl");
function buildRssXml({ title, link, description, items }) {
  const now = (/* @__PURE__ */ new Date()).toUTCString();
  const itemsXml = items.map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid>${escapeXml(item.guid)}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description><![CDATA[${item.description}]]></description>
    </item>`
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(link)}</link>
    <description>${escapeXml(description)}</description>
    <pubDate>${now}</pubDate>
${itemsXml}
  </channel>
</rss>`;
}
__name(buildRssXml, "buildRssXml");
function rssResponse(c, xml) {
  return c.body(xml, 200, {
    "Content-Type": "application/rss+xml; charset=utf-8"
  });
}
__name(rssResponse, "rssResponse");

// src/router/article.ts
var articleRoutes = new Hono2();
var VALID_FIELDS = /* @__PURE__ */ new Set([
  "time",
  "reaction0",
  "reaction1",
  "reaction2",
  "reaction3",
  "reaction4",
  "reaction5",
  "reaction6",
  "reaction7",
  "reaction8"
]);
articleRoutes.get("/", async (c) => {
  const paths = c.req.queries("path") || c.req.queries("path[]") || [];
  if (paths.length === 0) {
    return c.json({ errno: 0, errmsg: "", data: 0 });
  }
  const types = c.req.queries("type") || c.req.queries("type[]") || ["time"];
  const validTypes = types.filter((t) => VALID_FIELDS.has(t));
  if (validTypes.length === 0) {
    return c.json({ errno: 0, errmsg: "", data: paths.map(() => ({})) });
  }
  const placeholders = paths.map(() => "?").join(",");
  const result = await c.env.DB.prepare(
    `SELECT * FROM wl_Counter WHERE url IN (${placeholders})`
  ).bind(...paths).all();
  const respObj = {};
  for (const row of result.results) {
    respObj[row.url] = row;
  }
  const data = paths.map((url) => {
    const counters = {};
    for (const field of validTypes) {
      counters[field] = respObj[url]?.[field] || 0;
    }
    return counters;
  });
  return c.json({ errno: 0, errmsg: "", data });
});
articleRoutes.post("/", async (c) => {
  const body = await c.req.json();
  const { path, type = "time", action = "inc" } = body;
  if (!path) {
    return c.json({ errno: 1, errmsg: "path is required" }, 400);
  }
  if (!VALID_FIELDS.has(type)) {
    return c.json({ errno: 1, errmsg: "invalid type" }, 400);
  }
  const existing = await c.env.DB.prepare(
    "SELECT * FROM wl_Counter WHERE url = ?"
  ).bind(path).first();
  if (!existing) {
    if (action === "desc") {
      return c.json({ errno: 0, errmsg: "", data: [{ [type]: 0 }] });
    }
    await c.env.DB.prepare(
      `INSERT INTO wl_Counter (url, ${type}) VALUES (?, 1)`
    ).bind(path).run();
    return c.json({ errno: 0, errmsg: "", data: [{ [type]: 1 }] });
  }
  const currentVal = existing[type] || 0;
  const newVal = action === "desc" ? Math.max(0, currentVal - 1) : currentVal + 1;
  await c.env.DB.prepare(
    `UPDATE wl_Counter SET ${type} = ?, updatedAt = datetime('now') WHERE url = ?`
  ).bind(newVal, path).run();
  return c.json({ errno: 0, errmsg: "", data: [{ [type]: newVal }] });
});

// node_modules/bcryptjs/index.js
var import_crypto = __toESM(require_crypto(), 1);
var randomFallback = null;
function randomBytes(len) {
  try {
    return crypto.getRandomValues(new Uint8Array(len));
  } catch {
  }
  try {
    return import_crypto.default.randomBytes(len);
  } catch {
  }
  if (!randomFallback) {
    throw Error(
      "Neither WebCryptoAPI nor a crypto module is available. Use bcrypt.setRandomFallback to set an alternative"
    );
  }
  return randomFallback(len);
}
__name(randomBytes, "randomBytes");
function setRandomFallback(random) {
  randomFallback = random;
}
__name(setRandomFallback, "setRandomFallback");
function genSaltSync(rounds, seed_length) {
  rounds = rounds || GENSALT_DEFAULT_LOG2_ROUNDS;
  if (typeof rounds !== "number")
    throw Error(
      "Illegal arguments: " + typeof rounds + ", " + typeof seed_length
    );
  if (rounds < 4) rounds = 4;
  else if (rounds > 31) rounds = 31;
  var salt = [];
  salt.push("$2b$");
  if (rounds < 10) salt.push("0");
  salt.push(rounds.toString());
  salt.push("$");
  salt.push(base64_encode(randomBytes(BCRYPT_SALT_LEN), BCRYPT_SALT_LEN));
  return salt.join("");
}
__name(genSaltSync, "genSaltSync");
function genSalt(rounds, seed_length, callback) {
  if (typeof seed_length === "function")
    callback = seed_length, seed_length = void 0;
  if (typeof rounds === "function") callback = rounds, rounds = void 0;
  if (typeof rounds === "undefined") rounds = GENSALT_DEFAULT_LOG2_ROUNDS;
  else if (typeof rounds !== "number")
    throw Error("illegal arguments: " + typeof rounds);
  function _async(callback2) {
    nextTick(function() {
      try {
        callback2(null, genSaltSync(rounds));
      } catch (err) {
        callback2(err);
      }
    });
  }
  __name(_async, "_async");
  if (callback) {
    if (typeof callback !== "function")
      throw Error("Illegal callback: " + typeof callback);
    _async(callback);
  } else
    return new Promise(function(resolve, reject) {
      _async(function(err, res) {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
}
__name(genSalt, "genSalt");
function hashSync(password, salt) {
  if (typeof salt === "undefined") salt = GENSALT_DEFAULT_LOG2_ROUNDS;
  if (typeof salt === "number") salt = genSaltSync(salt);
  if (typeof password !== "string" || typeof salt !== "string")
    throw Error("Illegal arguments: " + typeof password + ", " + typeof salt);
  return _hash(password, salt);
}
__name(hashSync, "hashSync");
function hash(password, salt, callback, progressCallback) {
  function _async(callback2) {
    if (typeof password === "string" && typeof salt === "number")
      genSalt(salt, function(err, salt2) {
        _hash(password, salt2, callback2, progressCallback);
      });
    else if (typeof password === "string" && typeof salt === "string")
      _hash(password, salt, callback2, progressCallback);
    else
      nextTick(
        callback2.bind(
          this,
          Error("Illegal arguments: " + typeof password + ", " + typeof salt)
        )
      );
  }
  __name(_async, "_async");
  if (callback) {
    if (typeof callback !== "function")
      throw Error("Illegal callback: " + typeof callback);
    _async(callback);
  } else
    return new Promise(function(resolve, reject) {
      _async(function(err, res) {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
}
__name(hash, "hash");
function safeStringCompare(known, unknown) {
  var diff = known.length ^ unknown.length;
  for (var i = 0; i < known.length; ++i) {
    diff |= known.charCodeAt(i) ^ unknown.charCodeAt(i);
  }
  return diff === 0;
}
__name(safeStringCompare, "safeStringCompare");
function compareSync(password, hash2) {
  if (typeof password !== "string" || typeof hash2 !== "string")
    throw Error("Illegal arguments: " + typeof password + ", " + typeof hash2);
  if (hash2.length !== 60) return false;
  return safeStringCompare(
    hashSync(password, hash2.substring(0, hash2.length - 31)),
    hash2
  );
}
__name(compareSync, "compareSync");
function compare(password, hashValue, callback, progressCallback) {
  function _async(callback2) {
    if (typeof password !== "string" || typeof hashValue !== "string") {
      nextTick(
        callback2.bind(
          this,
          Error(
            "Illegal arguments: " + typeof password + ", " + typeof hashValue
          )
        )
      );
      return;
    }
    if (hashValue.length !== 60) {
      nextTick(callback2.bind(this, null, false));
      return;
    }
    hash(
      password,
      hashValue.substring(0, 29),
      function(err, comp) {
        if (err) callback2(err);
        else callback2(null, safeStringCompare(comp, hashValue));
      },
      progressCallback
    );
  }
  __name(_async, "_async");
  if (callback) {
    if (typeof callback !== "function")
      throw Error("Illegal callback: " + typeof callback);
    _async(callback);
  } else
    return new Promise(function(resolve, reject) {
      _async(function(err, res) {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
}
__name(compare, "compare");
function getRounds(hash2) {
  if (typeof hash2 !== "string")
    throw Error("Illegal arguments: " + typeof hash2);
  return parseInt(hash2.split("$")[2], 10);
}
__name(getRounds, "getRounds");
function getSalt(hash2) {
  if (typeof hash2 !== "string")
    throw Error("Illegal arguments: " + typeof hash2);
  if (hash2.length !== 60)
    throw Error("Illegal hash length: " + hash2.length + " != 60");
  return hash2.substring(0, 29);
}
__name(getSalt, "getSalt");
function truncates(password) {
  if (typeof password !== "string")
    throw Error("Illegal arguments: " + typeof password);
  return utf8Length(password) > 72;
}
__name(truncates, "truncates");
var nextTick = typeof setImmediate === "function" ? setImmediate : typeof scheduler === "object" && typeof scheduler.postTask === "function" ? scheduler.postTask.bind(scheduler) : setTimeout;
function utf8Length(string) {
  var len = 0, c = 0;
  for (var i = 0; i < string.length; ++i) {
    c = string.charCodeAt(i);
    if (c < 128) len += 1;
    else if (c < 2048) len += 2;
    else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
      ++i;
      len += 4;
    } else len += 3;
  }
  return len;
}
__name(utf8Length, "utf8Length");
function utf8Array(string) {
  var offset = 0, c1, c2;
  var buffer = new Array(utf8Length(string));
  for (var i = 0, k = string.length; i < k; ++i) {
    c1 = string.charCodeAt(i);
    if (c1 < 128) {
      buffer[offset++] = c1;
    } else if (c1 < 2048) {
      buffer[offset++] = c1 >> 6 | 192;
      buffer[offset++] = c1 & 63 | 128;
    } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
      c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
      ++i;
      buffer[offset++] = c1 >> 18 | 240;
      buffer[offset++] = c1 >> 12 & 63 | 128;
      buffer[offset++] = c1 >> 6 & 63 | 128;
      buffer[offset++] = c1 & 63 | 128;
    } else {
      buffer[offset++] = c1 >> 12 | 224;
      buffer[offset++] = c1 >> 6 & 63 | 128;
      buffer[offset++] = c1 & 63 | 128;
    }
  }
  return buffer;
}
__name(utf8Array, "utf8Array");
var BASE64_CODE = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
var BASE64_INDEX = [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  0,
  1,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  62,
  63,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  -1,
  -1,
  -1,
  -1,
  -1
];
function base64_encode(b, len) {
  var off = 0, rs = [], c1, c2;
  if (len <= 0 || len > b.length) throw Error("Illegal len: " + len);
  while (off < len) {
    c1 = b[off++] & 255;
    rs.push(BASE64_CODE[c1 >> 2 & 63]);
    c1 = (c1 & 3) << 4;
    if (off >= len) {
      rs.push(BASE64_CODE[c1 & 63]);
      break;
    }
    c2 = b[off++] & 255;
    c1 |= c2 >> 4 & 15;
    rs.push(BASE64_CODE[c1 & 63]);
    c1 = (c2 & 15) << 2;
    if (off >= len) {
      rs.push(BASE64_CODE[c1 & 63]);
      break;
    }
    c2 = b[off++] & 255;
    c1 |= c2 >> 6 & 3;
    rs.push(BASE64_CODE[c1 & 63]);
    rs.push(BASE64_CODE[c2 & 63]);
  }
  return rs.join("");
}
__name(base64_encode, "base64_encode");
function base64_decode(s, len) {
  var off = 0, slen = s.length, olen = 0, rs = [], c1, c2, c3, c4, o, code;
  if (len <= 0) throw Error("Illegal len: " + len);
  while (off < slen - 1 && olen < len) {
    code = s.charCodeAt(off++);
    c1 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    code = s.charCodeAt(off++);
    c2 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    if (c1 == -1 || c2 == -1) break;
    o = c1 << 2 >>> 0;
    o |= (c2 & 48) >> 4;
    rs.push(String.fromCharCode(o));
    if (++olen >= len || off >= slen) break;
    code = s.charCodeAt(off++);
    c3 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    if (c3 == -1) break;
    o = (c2 & 15) << 4 >>> 0;
    o |= (c3 & 60) >> 2;
    rs.push(String.fromCharCode(o));
    if (++olen >= len || off >= slen) break;
    code = s.charCodeAt(off++);
    c4 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
    o = (c3 & 3) << 6 >>> 0;
    o |= c4;
    rs.push(String.fromCharCode(o));
    ++olen;
  }
  var res = [];
  for (off = 0; off < olen; off++) res.push(rs[off].charCodeAt(0));
  return res;
}
__name(base64_decode, "base64_decode");
var BCRYPT_SALT_LEN = 16;
var GENSALT_DEFAULT_LOG2_ROUNDS = 10;
var BLOWFISH_NUM_ROUNDS = 16;
var MAX_EXECUTION_TIME = 100;
var P_ORIG = [
  608135816,
  2242054355,
  320440878,
  57701188,
  2752067618,
  698298832,
  137296536,
  3964562569,
  1160258022,
  953160567,
  3193202383,
  887688300,
  3232508343,
  3380367581,
  1065670069,
  3041331479,
  2450970073,
  2306472731
];
var S_ORIG = [
  3509652390,
  2564797868,
  805139163,
  3491422135,
  3101798381,
  1780907670,
  3128725573,
  4046225305,
  614570311,
  3012652279,
  134345442,
  2240740374,
  1667834072,
  1901547113,
  2757295779,
  4103290238,
  227898511,
  1921955416,
  1904987480,
  2182433518,
  2069144605,
  3260701109,
  2620446009,
  720527379,
  3318853667,
  677414384,
  3393288472,
  3101374703,
  2390351024,
  1614419982,
  1822297739,
  2954791486,
  3608508353,
  3174124327,
  2024746970,
  1432378464,
  3864339955,
  2857741204,
  1464375394,
  1676153920,
  1439316330,
  715854006,
  3033291828,
  289532110,
  2706671279,
  2087905683,
  3018724369,
  1668267050,
  732546397,
  1947742710,
  3462151702,
  2609353502,
  2950085171,
  1814351708,
  2050118529,
  680887927,
  999245976,
  1800124847,
  3300911131,
  1713906067,
  1641548236,
  4213287313,
  1216130144,
  1575780402,
  4018429277,
  3917837745,
  3693486850,
  3949271944,
  596196993,
  3549867205,
  258830323,
  2213823033,
  772490370,
  2760122372,
  1774776394,
  2652871518,
  566650946,
  4142492826,
  1728879713,
  2882767088,
  1783734482,
  3629395816,
  2517608232,
  2874225571,
  1861159788,
  326777828,
  3124490320,
  2130389656,
  2716951837,
  967770486,
  1724537150,
  2185432712,
  2364442137,
  1164943284,
  2105845187,
  998989502,
  3765401048,
  2244026483,
  1075463327,
  1455516326,
  1322494562,
  910128902,
  469688178,
  1117454909,
  936433444,
  3490320968,
  3675253459,
  1240580251,
  122909385,
  2157517691,
  634681816,
  4142456567,
  3825094682,
  3061402683,
  2540495037,
  79693498,
  3249098678,
  1084186820,
  1583128258,
  426386531,
  1761308591,
  1047286709,
  322548459,
  995290223,
  1845252383,
  2603652396,
  3431023940,
  2942221577,
  3202600964,
  3727903485,
  1712269319,
  422464435,
  3234572375,
  1170764815,
  3523960633,
  3117677531,
  1434042557,
  442511882,
  3600875718,
  1076654713,
  1738483198,
  4213154764,
  2393238008,
  3677496056,
  1014306527,
  4251020053,
  793779912,
  2902807211,
  842905082,
  4246964064,
  1395751752,
  1040244610,
  2656851899,
  3396308128,
  445077038,
  3742853595,
  3577915638,
  679411651,
  2892444358,
  2354009459,
  1767581616,
  3150600392,
  3791627101,
  3102740896,
  284835224,
  4246832056,
  1258075500,
  768725851,
  2589189241,
  3069724005,
  3532540348,
  1274779536,
  3789419226,
  2764799539,
  1660621633,
  3471099624,
  4011903706,
  913787905,
  3497959166,
  737222580,
  2514213453,
  2928710040,
  3937242737,
  1804850592,
  3499020752,
  2949064160,
  2386320175,
  2390070455,
  2415321851,
  4061277028,
  2290661394,
  2416832540,
  1336762016,
  1754252060,
  3520065937,
  3014181293,
  791618072,
  3188594551,
  3933548030,
  2332172193,
  3852520463,
  3043980520,
  413987798,
  3465142937,
  3030929376,
  4245938359,
  2093235073,
  3534596313,
  375366246,
  2157278981,
  2479649556,
  555357303,
  3870105701,
  2008414854,
  3344188149,
  4221384143,
  3956125452,
  2067696032,
  3594591187,
  2921233993,
  2428461,
  544322398,
  577241275,
  1471733935,
  610547355,
  4027169054,
  1432588573,
  1507829418,
  2025931657,
  3646575487,
  545086370,
  48609733,
  2200306550,
  1653985193,
  298326376,
  1316178497,
  3007786442,
  2064951626,
  458293330,
  2589141269,
  3591329599,
  3164325604,
  727753846,
  2179363840,
  146436021,
  1461446943,
  4069977195,
  705550613,
  3059967265,
  3887724982,
  4281599278,
  3313849956,
  1404054877,
  2845806497,
  146425753,
  1854211946,
  1266315497,
  3048417604,
  3681880366,
  3289982499,
  290971e4,
  1235738493,
  2632868024,
  2414719590,
  3970600049,
  1771706367,
  1449415276,
  3266420449,
  422970021,
  1963543593,
  2690192192,
  3826793022,
  1062508698,
  1531092325,
  1804592342,
  2583117782,
  2714934279,
  4024971509,
  1294809318,
  4028980673,
  1289560198,
  2221992742,
  1669523910,
  35572830,
  157838143,
  1052438473,
  1016535060,
  1802137761,
  1753167236,
  1386275462,
  3080475397,
  2857371447,
  1040679964,
  2145300060,
  2390574316,
  1461121720,
  2956646967,
  4031777805,
  4028374788,
  33600511,
  2920084762,
  1018524850,
  629373528,
  3691585981,
  3515945977,
  2091462646,
  2486323059,
  586499841,
  988145025,
  935516892,
  3367335476,
  2599673255,
  2839830854,
  265290510,
  3972581182,
  2759138881,
  3795373465,
  1005194799,
  847297441,
  406762289,
  1314163512,
  1332590856,
  1866599683,
  4127851711,
  750260880,
  613907577,
  1450815602,
  3165620655,
  3734664991,
  3650291728,
  3012275730,
  3704569646,
  1427272223,
  778793252,
  1343938022,
  2676280711,
  2052605720,
  1946737175,
  3164576444,
  3914038668,
  3967478842,
  3682934266,
  1661551462,
  3294938066,
  4011595847,
  840292616,
  3712170807,
  616741398,
  312560963,
  711312465,
  1351876610,
  322626781,
  1910503582,
  271666773,
  2175563734,
  1594956187,
  70604529,
  3617834859,
  1007753275,
  1495573769,
  4069517037,
  2549218298,
  2663038764,
  504708206,
  2263041392,
  3941167025,
  2249088522,
  1514023603,
  1998579484,
  1312622330,
  694541497,
  2582060303,
  2151582166,
  1382467621,
  776784248,
  2618340202,
  3323268794,
  2497899128,
  2784771155,
  503983604,
  4076293799,
  907881277,
  423175695,
  432175456,
  1378068232,
  4145222326,
  3954048622,
  3938656102,
  3820766613,
  2793130115,
  2977904593,
  26017576,
  3274890735,
  3194772133,
  1700274565,
  1756076034,
  4006520079,
  3677328699,
  720338349,
  1533947780,
  354530856,
  688349552,
  3973924725,
  1637815568,
  332179504,
  3949051286,
  53804574,
  2852348879,
  3044236432,
  1282449977,
  3583942155,
  3416972820,
  4006381244,
  1617046695,
  2628476075,
  3002303598,
  1686838959,
  431878346,
  2686675385,
  1700445008,
  1080580658,
  1009431731,
  832498133,
  3223435511,
  2605976345,
  2271191193,
  2516031870,
  1648197032,
  4164389018,
  2548247927,
  300782431,
  375919233,
  238389289,
  3353747414,
  2531188641,
  2019080857,
  1475708069,
  455242339,
  2609103871,
  448939670,
  3451063019,
  1395535956,
  2413381860,
  1841049896,
  1491858159,
  885456874,
  4264095073,
  4001119347,
  1565136089,
  3898914787,
  1108368660,
  540939232,
  1173283510,
  2745871338,
  3681308437,
  4207628240,
  3343053890,
  4016749493,
  1699691293,
  1103962373,
  3625875870,
  2256883143,
  3830138730,
  1031889488,
  3479347698,
  1535977030,
  4236805024,
  3251091107,
  2132092099,
  1774941330,
  1199868427,
  1452454533,
  157007616,
  2904115357,
  342012276,
  595725824,
  1480756522,
  206960106,
  497939518,
  591360097,
  863170706,
  2375253569,
  3596610801,
  1814182875,
  2094937945,
  3421402208,
  1082520231,
  3463918190,
  2785509508,
  435703966,
  3908032597,
  1641649973,
  2842273706,
  3305899714,
  1510255612,
  2148256476,
  2655287854,
  3276092548,
  4258621189,
  236887753,
  3681803219,
  274041037,
  1734335097,
  3815195456,
  3317970021,
  1899903192,
  1026095262,
  4050517792,
  356393447,
  2410691914,
  3873677099,
  3682840055,
  3913112168,
  2491498743,
  4132185628,
  2489919796,
  1091903735,
  1979897079,
  3170134830,
  3567386728,
  3557303409,
  857797738,
  1136121015,
  1342202287,
  507115054,
  2535736646,
  337727348,
  3213592640,
  1301675037,
  2528481711,
  1895095763,
  1721773893,
  3216771564,
  62756741,
  2142006736,
  835421444,
  2531993523,
  1442658625,
  3659876326,
  2882144922,
  676362277,
  1392781812,
  170690266,
  3921047035,
  1759253602,
  3611846912,
  1745797284,
  664899054,
  1329594018,
  3901205900,
  3045908486,
  2062866102,
  2865634940,
  3543621612,
  3464012697,
  1080764994,
  553557557,
  3656615353,
  3996768171,
  991055499,
  499776247,
  1265440854,
  648242737,
  3940784050,
  980351604,
  3713745714,
  1749149687,
  3396870395,
  4211799374,
  3640570775,
  1161844396,
  3125318951,
  1431517754,
  545492359,
  4268468663,
  3499529547,
  1437099964,
  2702547544,
  3433638243,
  2581715763,
  2787789398,
  1060185593,
  1593081372,
  2418618748,
  4260947970,
  69676912,
  2159744348,
  86519011,
  2512459080,
  3838209314,
  1220612927,
  3339683548,
  133810670,
  1090789135,
  1078426020,
  1569222167,
  845107691,
  3583754449,
  4072456591,
  1091646820,
  628848692,
  1613405280,
  3757631651,
  526609435,
  236106946,
  48312990,
  2942717905,
  3402727701,
  1797494240,
  859738849,
  992217954,
  4005476642,
  2243076622,
  3870952857,
  3732016268,
  765654824,
  3490871365,
  2511836413,
  1685915746,
  3888969200,
  1414112111,
  2273134842,
  3281911079,
  4080962846,
  172450625,
  2569994100,
  980381355,
  4109958455,
  2819808352,
  2716589560,
  2568741196,
  3681446669,
  3329971472,
  1835478071,
  660984891,
  3704678404,
  4045999559,
  3422617507,
  3040415634,
  1762651403,
  1719377915,
  3470491036,
  2693910283,
  3642056355,
  3138596744,
  1364962596,
  2073328063,
  1983633131,
  926494387,
  3423689081,
  2150032023,
  4096667949,
  1749200295,
  3328846651,
  309677260,
  2016342300,
  1779581495,
  3079819751,
  111262694,
  1274766160,
  443224088,
  298511866,
  1025883608,
  3806446537,
  1145181785,
  168956806,
  3641502830,
  3584813610,
  1689216846,
  3666258015,
  3200248200,
  1692713982,
  2646376535,
  4042768518,
  1618508792,
  1610833997,
  3523052358,
  4130873264,
  2001055236,
  3610705100,
  2202168115,
  4028541809,
  2961195399,
  1006657119,
  2006996926,
  3186142756,
  1430667929,
  3210227297,
  1314452623,
  4074634658,
  4101304120,
  2273951170,
  1399257539,
  3367210612,
  3027628629,
  1190975929,
  2062231137,
  2333990788,
  2221543033,
  2438960610,
  1181637006,
  548689776,
  2362791313,
  3372408396,
  3104550113,
  3145860560,
  296247880,
  1970579870,
  3078560182,
  3769228297,
  1714227617,
  3291629107,
  3898220290,
  166772364,
  1251581989,
  493813264,
  448347421,
  195405023,
  2709975567,
  677966185,
  3703036547,
  1463355134,
  2715995803,
  1338867538,
  1343315457,
  2802222074,
  2684532164,
  233230375,
  2599980071,
  2000651841,
  3277868038,
  1638401717,
  4028070440,
  3237316320,
  6314154,
  819756386,
  300326615,
  590932579,
  1405279636,
  3267499572,
  3150704214,
  2428286686,
  3959192993,
  3461946742,
  1862657033,
  1266418056,
  963775037,
  2089974820,
  2263052895,
  1917689273,
  448879540,
  3550394620,
  3981727096,
  150775221,
  3627908307,
  1303187396,
  508620638,
  2975983352,
  2726630617,
  1817252668,
  1876281319,
  1457606340,
  908771278,
  3720792119,
  3617206836,
  2455994898,
  1729034894,
  1080033504,
  976866871,
  3556439503,
  2881648439,
  1522871579,
  1555064734,
  1336096578,
  3548522304,
  2579274686,
  3574697629,
  3205460757,
  3593280638,
  3338716283,
  3079412587,
  564236357,
  2993598910,
  1781952180,
  1464380207,
  3163844217,
  3332601554,
  1699332808,
  1393555694,
  1183702653,
  3581086237,
  1288719814,
  691649499,
  2847557200,
  2895455976,
  3193889540,
  2717570544,
  1781354906,
  1676643554,
  2592534050,
  3230253752,
  1126444790,
  2770207658,
  2633158820,
  2210423226,
  2615765581,
  2414155088,
  3127139286,
  673620729,
  2805611233,
  1269405062,
  4015350505,
  3341807571,
  4149409754,
  1057255273,
  2012875353,
  2162469141,
  2276492801,
  2601117357,
  993977747,
  3918593370,
  2654263191,
  753973209,
  36408145,
  2530585658,
  25011837,
  3520020182,
  2088578344,
  530523599,
  2918365339,
  1524020338,
  1518925132,
  3760827505,
  3759777254,
  1202760957,
  3985898139,
  3906192525,
  674977740,
  4174734889,
  2031300136,
  2019492241,
  3983892565,
  4153806404,
  3822280332,
  352677332,
  2297720250,
  60907813,
  90501309,
  3286998549,
  1016092578,
  2535922412,
  2839152426,
  457141659,
  509813237,
  4120667899,
  652014361,
  1966332200,
  2975202805,
  55981186,
  2327461051,
  676427537,
  3255491064,
  2882294119,
  3433927263,
  1307055953,
  942726286,
  933058658,
  2468411793,
  3933900994,
  4215176142,
  1361170020,
  2001714738,
  2830558078,
  3274259782,
  1222529897,
  1679025792,
  2729314320,
  3714953764,
  1770335741,
  151462246,
  3013232138,
  1682292957,
  1483529935,
  471910574,
  1539241949,
  458788160,
  3436315007,
  1807016891,
  3718408830,
  978976581,
  1043663428,
  3165965781,
  1927990952,
  4200891579,
  2372276910,
  3208408903,
  3533431907,
  1412390302,
  2931980059,
  4132332400,
  1947078029,
  3881505623,
  4168226417,
  2941484381,
  1077988104,
  1320477388,
  886195818,
  18198404,
  3786409e3,
  2509781533,
  112762804,
  3463356488,
  1866414978,
  891333506,
  18488651,
  661792760,
  1628790961,
  3885187036,
  3141171499,
  876946877,
  2693282273,
  1372485963,
  791857591,
  2686433993,
  3759982718,
  3167212022,
  3472953795,
  2716379847,
  445679433,
  3561995674,
  3504004811,
  3574258232,
  54117162,
  3331405415,
  2381918588,
  3769707343,
  4154350007,
  1140177722,
  4074052095,
  668550556,
  3214352940,
  367459370,
  261225585,
  2610173221,
  4209349473,
  3468074219,
  3265815641,
  314222801,
  3066103646,
  3808782860,
  282218597,
  3406013506,
  3773591054,
  379116347,
  1285071038,
  846784868,
  2669647154,
  3771962079,
  3550491691,
  2305946142,
  453669953,
  1268987020,
  3317592352,
  3279303384,
  3744833421,
  2610507566,
  3859509063,
  266596637,
  3847019092,
  517658769,
  3462560207,
  3443424879,
  370717030,
  4247526661,
  2224018117,
  4143653529,
  4112773975,
  2788324899,
  2477274417,
  1456262402,
  2901442914,
  1517677493,
  1846949527,
  2295493580,
  3734397586,
  2176403920,
  1280348187,
  1908823572,
  3871786941,
  846861322,
  1172426758,
  3287448474,
  3383383037,
  1655181056,
  3139813346,
  901632758,
  1897031941,
  2986607138,
  3066810236,
  3447102507,
  1393639104,
  373351379,
  950779232,
  625454576,
  3124240540,
  4148612726,
  2007998917,
  544563296,
  2244738638,
  2330496472,
  2058025392,
  1291430526,
  424198748,
  50039436,
  29584100,
  3605783033,
  2429876329,
  2791104160,
  1057563949,
  3255363231,
  3075367218,
  3463963227,
  1469046755,
  985887462
];
var C_ORIG = [
  1332899944,
  1700884034,
  1701343084,
  1684370003,
  1668446532,
  1869963892
];
function _encipher(lr, off, P, S) {
  var n, l = lr[off], r = lr[off + 1];
  l ^= P[0];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[1];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[2];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[3];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[4];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[5];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[6];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[7];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[8];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[9];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[10];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[11];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[12];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[13];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[14];
  n = S[l >>> 24];
  n += S[256 | l >> 16 & 255];
  n ^= S[512 | l >> 8 & 255];
  n += S[768 | l & 255];
  r ^= n ^ P[15];
  n = S[r >>> 24];
  n += S[256 | r >> 16 & 255];
  n ^= S[512 | r >> 8 & 255];
  n += S[768 | r & 255];
  l ^= n ^ P[16];
  lr[off] = r ^ P[BLOWFISH_NUM_ROUNDS + 1];
  lr[off + 1] = l;
  return lr;
}
__name(_encipher, "_encipher");
function _streamtoword(data, offp) {
  for (var i = 0, word = 0; i < 4; ++i)
    word = word << 8 | data[offp] & 255, offp = (offp + 1) % data.length;
  return { key: word, offp };
}
__name(_streamtoword, "_streamtoword");
function _key(key, P, S) {
  var offset = 0, lr = [0, 0], plen = P.length, slen = S.length, sw;
  for (var i = 0; i < plen; i++)
    sw = _streamtoword(key, offset), offset = sw.offp, P[i] = P[i] ^ sw.key;
  for (i = 0; i < plen; i += 2)
    lr = _encipher(lr, 0, P, S), P[i] = lr[0], P[i + 1] = lr[1];
  for (i = 0; i < slen; i += 2)
    lr = _encipher(lr, 0, P, S), S[i] = lr[0], S[i + 1] = lr[1];
}
__name(_key, "_key");
function _ekskey(data, key, P, S) {
  var offp = 0, lr = [0, 0], plen = P.length, slen = S.length, sw;
  for (var i = 0; i < plen; i++)
    sw = _streamtoword(key, offp), offp = sw.offp, P[i] = P[i] ^ sw.key;
  offp = 0;
  for (i = 0; i < plen; i += 2)
    sw = _streamtoword(data, offp), offp = sw.offp, lr[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr[1] ^= sw.key, lr = _encipher(lr, 0, P, S), P[i] = lr[0], P[i + 1] = lr[1];
  for (i = 0; i < slen; i += 2)
    sw = _streamtoword(data, offp), offp = sw.offp, lr[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr[1] ^= sw.key, lr = _encipher(lr, 0, P, S), S[i] = lr[0], S[i + 1] = lr[1];
}
__name(_ekskey, "_ekskey");
function _crypt(b, salt, rounds, callback, progressCallback) {
  var cdata = C_ORIG.slice(), clen = cdata.length, err;
  if (rounds < 4 || rounds > 31) {
    err = Error("Illegal number of rounds (4-31): " + rounds);
    if (callback) {
      nextTick(callback.bind(this, err));
      return;
    } else throw err;
  }
  if (salt.length !== BCRYPT_SALT_LEN) {
    err = Error(
      "Illegal salt length: " + salt.length + " != " + BCRYPT_SALT_LEN
    );
    if (callback) {
      nextTick(callback.bind(this, err));
      return;
    } else throw err;
  }
  rounds = 1 << rounds >>> 0;
  var P, S, i = 0, j;
  if (typeof Int32Array === "function") {
    P = new Int32Array(P_ORIG);
    S = new Int32Array(S_ORIG);
  } else {
    P = P_ORIG.slice();
    S = S_ORIG.slice();
  }
  _ekskey(salt, b, P, S);
  function next() {
    if (progressCallback) progressCallback(i / rounds);
    if (i < rounds) {
      var start = Date.now();
      for (; i < rounds; ) {
        i = i + 1;
        _key(b, P, S);
        _key(salt, P, S);
        if (Date.now() - start > MAX_EXECUTION_TIME) break;
      }
    } else {
      for (i = 0; i < 64; i++)
        for (j = 0; j < clen >> 1; j++) _encipher(cdata, j << 1, P, S);
      var ret = [];
      for (i = 0; i < clen; i++)
        ret.push((cdata[i] >> 24 & 255) >>> 0), ret.push((cdata[i] >> 16 & 255) >>> 0), ret.push((cdata[i] >> 8 & 255) >>> 0), ret.push((cdata[i] & 255) >>> 0);
      if (callback) {
        callback(null, ret);
        return;
      } else return ret;
    }
    if (callback) nextTick(next);
  }
  __name(next, "next");
  if (typeof callback !== "undefined") {
    next();
  } else {
    var res;
    while (true) if (typeof (res = next()) !== "undefined") return res || [];
  }
}
__name(_crypt, "_crypt");
function _hash(password, salt, callback, progressCallback) {
  var err;
  if (typeof password !== "string" || typeof salt !== "string") {
    err = Error("Invalid string / salt: Not a string");
    if (callback) {
      nextTick(callback.bind(this, err));
      return;
    } else throw err;
  }
  var minor, offset;
  if (salt.charAt(0) !== "$" || salt.charAt(1) !== "2") {
    err = Error("Invalid salt version: " + salt.substring(0, 2));
    if (callback) {
      nextTick(callback.bind(this, err));
      return;
    } else throw err;
  }
  if (salt.charAt(2) === "$") minor = String.fromCharCode(0), offset = 3;
  else {
    minor = salt.charAt(2);
    if (minor !== "a" && minor !== "b" && minor !== "y" || salt.charAt(3) !== "$") {
      err = Error("Invalid salt revision: " + salt.substring(2, 4));
      if (callback) {
        nextTick(callback.bind(this, err));
        return;
      } else throw err;
    }
    offset = 4;
  }
  if (salt.charAt(offset + 2) > "$") {
    err = Error("Missing salt rounds");
    if (callback) {
      nextTick(callback.bind(this, err));
      return;
    } else throw err;
  }
  var r1 = parseInt(salt.substring(offset, offset + 1), 10) * 10, r2 = parseInt(salt.substring(offset + 1, offset + 2), 10), rounds = r1 + r2, real_salt = salt.substring(offset + 3, offset + 25);
  password += minor >= "a" ? "\0" : "";
  var passwordb = utf8Array(password), saltb = base64_decode(real_salt, BCRYPT_SALT_LEN);
  function finish(bytes) {
    var res = [];
    res.push("$2");
    if (minor >= "a") res.push(minor);
    res.push("$");
    if (rounds < 10) res.push("0");
    res.push(rounds.toString());
    res.push("$");
    res.push(base64_encode(saltb, saltb.length));
    res.push(base64_encode(bytes, C_ORIG.length * 4 - 1));
    return res.join("");
  }
  __name(finish, "finish");
  if (typeof callback == "undefined")
    return finish(_crypt(passwordb, saltb, rounds));
  else {
    _crypt(
      passwordb,
      saltb,
      rounds,
      function(err2, bytes) {
        if (err2) callback(err2, null);
        else callback(null, finish(bytes));
      },
      progressCallback
    );
  }
}
__name(_hash, "_hash");
function encodeBase64(bytes, length) {
  return base64_encode(bytes, length);
}
__name(encodeBase64, "encodeBase64");
function decodeBase64(string, length) {
  return base64_decode(string, length);
}
__name(decodeBase64, "decodeBase64");
var bcryptjs_default = {
  setRandomFallback,
  genSaltSync,
  genSalt,
  hashSync,
  hash,
  compareSync,
  compare,
  getRounds,
  getSalt,
  truncates,
  encodeBase64,
  decodeBase64
};

// src/utils/password.ts
var ITERATIONS = 1e5;
var SALT_LENGTH = 16;
var KEY_LENGTH = 32;
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const key = await deriveKey(password, salt);
  const hashBuffer = await crypto.subtle.exportKey("raw", key);
  const hashArray = new Uint8Array(hashBuffer);
  return `$pbkdf2$${ITERATIONS}$${uint8ToBase64(salt)}$${uint8ToBase64(hashArray)}`;
}
__name(hashPassword, "hashPassword");
async function verifyPassword(password, stored) {
  if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
    return bcryptjs_default.compareSync(password, stored);
  }
  if (stored.startsWith("$P$") || stored.startsWith("$H$")) {
    return false;
  }
  if (!stored.startsWith("$pbkdf2$")) {
    return false;
  }
  const parts = stored.split("$");
  if (parts.length !== 5) return false;
  const iterations = parseInt(parts[2]);
  const salt = base64ToUint8(parts[3]);
  const expectedHash = base64ToUint8(parts[4]);
  const key = await deriveKey(password, salt, iterations);
  const actualHash = new Uint8Array(await crypto.subtle.exportKey("raw", key));
  if (actualHash.length !== expectedHash.length) return false;
  let diff = 0;
  for (let i = 0; i < actualHash.length; i++) {
    diff |= actualHash[i] ^ expectedHash[i];
  }
  return diff === 0;
}
__name(verifyPassword, "verifyPassword");
async function deriveKey(password, salt, iterations = ITERATIONS) {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    baseKey,
    { name: "HMAC", hash: "SHA-256", length: KEY_LENGTH * 8 },
    true,
    ["sign"]
  );
}
__name(deriveKey, "deriveKey");
function uint8ToBase64(arr) {
  let binary = "";
  for (const byte of arr) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}
__name(uint8ToBase64, "uint8ToBase64");
function base64ToUint8(str) {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
__name(base64ToUint8, "base64ToUint8");

// src/router/user.ts
var userRoutes = new Hono2();
userRoutes.get("/", async (c) => {
  const userInfo = c.get("userInfo");
  const isAdmin = userInfo?.type === "administrator";
  const emailQuery = c.req.query("email");
  if (isAdmin && emailQuery) {
    const user = await c.env.DB.prepare(
      "SELECT id, display_name, email, type FROM wl_Users WHERE email = ?"
    ).bind(emailQuery).first();
    if (user) {
      return c.json({ errno: 0, objectId: String(user.id), ...user });
    }
    return c.json({ errno: 0 });
  }
  if (isAdmin) {
    const page = Math.max(1, parseInt(c.req.query("page") || "1") || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(c.req.query("pageSize") || "10") || 10));
    const offset = (page - 1) * pageSize;
    const countResult = await c.env.DB.prepare(
      "SELECT COUNT(*) as count FROM wl_Users"
    ).first();
    const total = countResult?.count || 0;
    const result2 = await c.env.DB.prepare(
      "SELECT id, display_name, email, type, url, avatar, label, createdAt FROM wl_Users ORDER BY createdAt DESC LIMIT ? OFFSET ?"
    ).bind(pageSize, offset).all();
    return c.json({
      errno: 0,
      errmsg: "",
      data: {
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        data: await Promise.all(result2.results.map((u) => formatUser(u)))
      }
    });
  }
  const count = Math.min(50, Math.max(1, parseInt(c.req.query("count") || "10") || 10));
  const result = await c.env.DB.prepare(
    `SELECT u.id, u.display_name, u.url, u.avatar, u.label,
            COUNT(c.id) as comment_count
     FROM wl_Users u
     LEFT JOIN wl_Comment c ON c.user_id = u.id AND c.status = 'approved'
     GROUP BY u.id
     ORDER BY comment_count DESC
     LIMIT ?`
  ).bind(count).all();
  return c.json({
    errno: 0,
    errmsg: "",
    data: result.results.map((u) => ({
      objectId: u.id,
      display_name: u.display_name,
      url: u.url || "",
      avatar: u.avatar || "",
      label: u.label || "",
      count: u.comment_count
    }))
  });
});
userRoutes.post("/", async (c) => {
  const body = await c.req.json();
  const { display_name, email, password, url } = body;
  if (!email || !password) {
    return c.json({ errno: 1, errmsg: "email and password are required" }, 400);
  }
  const existing = await c.env.DB.prepare(
    "SELECT id FROM wl_Users WHERE email = ?"
  ).bind(email).first();
  if (existing) {
    return c.json({ errno: 1, errmsg: "Registration failed" }, 409);
  }
  const userCount = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM wl_Users"
  ).first();
  const isFirst = (userCount?.count || 0) === 0;
  const hashedPassword = await hashPassword(password);
  await c.env.DB.prepare(
    `INSERT INTO wl_Users (display_name, email, password, type, url)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(
    display_name || email.split("@")[0],
    email,
    hashedPassword,
    isFirst ? "administrator" : "guest",
    url || ""
  ).run();
  const newUser = await c.env.DB.prepare(
    "SELECT id, display_name, email, type, url, avatar FROM wl_Users WHERE email = ?"
  ).bind(email).first();
  return c.json({
    errno: 0,
    errmsg: "",
    data: await formatUser(newUser)
  }, 201);
});
userRoutes.put("/:id", async (c) => {
  const id = c.req.param("id");
  const userInfo = c.get("userInfo");
  if (!userInfo) {
    return c.json({ errno: 1, errmsg: "Unauthorized" }, 401);
  }
  const isAdmin = userInfo.type === "administrator";
  const isSelf = userInfo.objectId === parseInt(id);
  if (!isAdmin && !isSelf) {
    return c.json({ errno: 1, errmsg: "Forbidden" }, 403);
  }
  const body = await c.req.json();
  const updates = [];
  const values = [];
  const allowedFields = ["display_name", "url", "avatar", "label"];
  for (const field of allowedFields) {
    if (body[field] !== void 0) {
      updates.push(`${field} = ?`);
      values.push(body[field]);
    }
  }
  if (body.password) {
    updates.push("password = ?");
    values.push(await hashPassword(body.password));
  }
  if (isAdmin && body.type !== void 0) {
    updates.push("type = ?");
    values.push(body.type);
  }
  if (updates.length === 0) {
    return c.json({ errno: 1, errmsg: "No fields to update" }, 400);
  }
  updates.push("updatedAt = datetime('now')");
  values.push(id);
  await c.env.DB.prepare(
    `UPDATE wl_Users SET ${updates.join(", ")} WHERE id = ?`
  ).bind(...values).run();
  const updated = await c.env.DB.prepare(
    "SELECT id, display_name, email, type, url, avatar, label FROM wl_Users WHERE id = ?"
  ).bind(id).first();
  return c.json({ errno: 0, errmsg: "", data: await formatUser(updated) });
});
userRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const userInfo = c.get("userInfo");
  if (userInfo?.type !== "administrator") {
    return c.json({ errno: 1, errmsg: "Unauthorized" }, 403);
  }
  const target = await c.env.DB.prepare(
    "SELECT type FROM wl_Users WHERE id = ?"
  ).bind(id).first();
  if (!target) {
    return c.json({ errno: 1, errmsg: "User not found" }, 404);
  }
  if (target.type.startsWith("verify:") || target.type === "guest") {
    await c.env.DB.prepare("DELETE FROM wl_Users WHERE id = ?").bind(id).run();
  } else {
    await c.env.DB.prepare(
      "UPDATE wl_Users SET type = 'banned', updatedAt = datetime('now') WHERE id = ?"
    ).bind(id).run();
  }
  return c.json({ errno: 0, errmsg: "" });
});
async function formatUser(row) {
  if (!row) return null;
  return {
    objectId: row.id,
    display_name: row.display_name || "",
    email: row.email || "",
    type: row.type || "guest",
    url: row.url || "",
    avatar: row.avatar || await getAvatar(row.email || ""),
    label: row.label || ""
  };
}
__name(formatUser, "formatUser");

// src/utils/totp.ts
var BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function base32Encode(data) {
  let bits = "";
  for (const byte of data) {
    bits += byte.toString(2).padStart(8, "0");
  }
  let result = "";
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5).padEnd(5, "0");
    result += BASE32_ALPHABET[parseInt(chunk, 2)];
  }
  return result;
}
__name(base32Encode, "base32Encode");
function base32Decode(input) {
  const cleaned = input.replace(/=+$/, "").toUpperCase();
  let bits = "";
  for (const char of cleaned) {
    const val = BASE32_ALPHABET.indexOf(char);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
  }
  return bytes;
}
__name(base32Decode, "base32Decode");
function generateSecret(length = 20) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return base32Encode(bytes);
}
__name(generateSecret, "generateSecret");
async function hmacSha1(key, data) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, data);
  return new Uint8Array(sig);
}
__name(hmacSha1, "hmacSha1");
async function generateHotp(secret, counter) {
  const buf = new ArrayBuffer(8);
  const view = new DataView(buf);
  view.setUint32(0, Math.floor(counter / 4294967296));
  view.setUint32(4, counter >>> 0);
  const mac = await hmacSha1(secret, new Uint8Array(buf));
  const offset = mac[mac.length - 1] & 15;
  const code = (mac[offset] & 127) << 24 | (mac[offset + 1] & 255) << 16 | (mac[offset + 2] & 255) << 8 | mac[offset + 3] & 255;
  return (code % 1e6).toString().padStart(6, "0");
}
__name(generateHotp, "generateHotp");
async function verifyTotp(secret, token, window = 2) {
  const secretBytes = base32Decode(secret);
  const step = 30;
  const counter = Math.floor(Date.now() / 1e3 / step);
  for (let i = -window; i <= window; i++) {
    const expected = await generateHotp(secretBytes, counter + i);
    if (expected === token) return true;
  }
  return false;
}
__name(verifyTotp, "verifyTotp");

// src/router/token.ts
var tokenRoutes = new Hono2();
tokenRoutes.get("/", async (c) => {
  const userInfo = c.get("userInfo");
  if (!userInfo) {
    return c.json({ errno: 1, errmsg: "Unauthorized" }, 401);
  }
  return c.json({
    errno: 0,
    errmsg: "",
    data: {
      objectId: userInfo.objectId,
      display_name: userInfo.display_name,
      email: userInfo.email,
      type: userInfo.type,
      url: userInfo.url,
      avatar: userInfo.avatar || await getAvatar(userInfo.email),
      label: userInfo.label || "",
      github: userInfo.github,
      twitter: userInfo.twitter,
      facebook: userInfo.facebook,
      google: userInfo.google,
      weibo: userInfo.weibo,
      qq: userInfo.qq,
      "2fa": userInfo["2fa"] ? true : void 0,
      mailMd5: await md5(userInfo.email.toLowerCase())
    }
  });
});
tokenRoutes.post("/", async (c) => {
  const body = await c.req.json();
  const { email, password } = body;
  if (!email || !password) {
    return c.json({ errno: 1, errmsg: "email and password are required" }, 400);
  }
  const user = await c.env.DB.prepare(
    "SELECT * FROM wl_Users WHERE email = ?"
  ).bind(email).first();
  if (!user) {
    return c.json({ errno: 1, errmsg: "Invalid credentials" }, 401);
  }
  if (user.type === "banned") {
    return c.json({ errno: 1, errmsg: "Invalid credentials" }, 401);
  }
  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return c.json({ errno: 1, errmsg: "Invalid credentials" }, 401);
  }
  if (user["2fa"]) {
    if (!body.code) {
      return c.json({ errno: 1, errmsg: "2FA required", data: { "2fa": true } }, 401);
    }
    const verified2fa = await verifyTotp(user["2fa"], body.code);
    if (!verified2fa) {
      return c.json({ errno: 1, errmsg: "Two factor auth verify failed, please try again" }, 401);
    }
  }
  const jwtSecret = c.env.JWT_SECRET;
  if (!jwtSecret) {
    return c.json({ errno: 1, errmsg: "JWT_SECRET not configured" }, 500);
  }
  const token = await signJwt({ id: user.id }, jwtSecret);
  return c.json({
    errno: 0,
    errmsg: "",
    data: {
      token,
      objectId: user.id,
      display_name: user.display_name,
      email: user.email,
      type: user.type,
      url: user.url || "",
      avatar: user.avatar || await getAvatar(user.email),
      label: user.label || "",
      mailMd5: await md5(user.email.toLowerCase())
    }
  });
});
tokenRoutes.delete("/", async (c) => {
  return c.json({ errno: 0, errmsg: "" });
});
tokenRoutes.get("/2fa", async (c) => {
  const userInfo = c.get("userInfo");
  const email = c.req.query("email");
  if (!userInfo && email) {
    const user = await c.env.DB.prepare(
      'SELECT "2fa" FROM wl_Users WHERE email = ?'
    ).bind(email).first();
    return c.json({
      errno: 0,
      data: { enable: !!user && !!user["2fa"] }
    });
  }
  if (!userInfo) {
    return c.json({ errno: 0, data: { enable: false } });
  }
  const name = `waline_${userInfo.objectId}`;
  if (userInfo["2fa"] && userInfo["2fa"].length === 32) {
    return c.json({
      errno: 0,
      data: {
        otpauth_url: `otpauth://totp/${name}?secret=${userInfo["2fa"]}`,
        secret: userInfo["2fa"]
      }
    });
  }
  const secret = generateSecret(20);
  return c.json({
    errno: 0,
    data: {
      otpauth_url: `otpauth://totp/${name}?secret=${secret}`,
      secret
    }
  });
});
tokenRoutes.post("/2fa", async (c) => {
  const userInfo = c.get("userInfo");
  if (!userInfo) {
    return c.json({ errno: 1, errmsg: "Unauthorized" }, 401);
  }
  const { secret, code } = await c.req.json();
  if (!secret || !code || !/^\d{6}$/.test(code)) {
    return c.json({ errno: 1, errmsg: "Invalid 2FA code" }, 400);
  }
  const verified = await verifyTotp(secret, code);
  if (!verified) {
    return c.json({ errno: 1, errmsg: "Two factor auth verify failed, please try again" }, 401);
  }
  await c.env.DB.prepare(
    'UPDATE wl_Users SET "2fa" = ? WHERE id = ?'
  ).bind(secret, userInfo.objectId).run();
  return c.json({ errno: 0, errmsg: "" });
});

// src/router/oauth.ts
var oauthRoutes = new Hono2();
var DEFAULT_OAUTH_URL = "https://oauth.lithub.cc";
oauthRoutes.get("/", async (c) => {
  const type = c.req.query("type");
  const code = c.req.query("code");
  const state = c.req.query("state") || "";
  const redirect = sanitizeRedirect(c.req.query("redirect"));
  const oauthUrl = c.env.OAUTH_URL || DEFAULT_OAUTH_URL;
  if (!type) {
    return c.json({ errno: 1, errmsg: "type is required" }, 400);
  }
  if (!code) {
    const reqUrl = new URL(c.req.url);
    const callbackUrl = `${reqUrl.origin}/api/oauth?redirect=${encodeURIComponent(redirect)}&type=${encodeURIComponent(type)}`;
    const loginUrl = `${oauthUrl}/${type}?redirect=${encodeURIComponent(callbackUrl)}&state=${encodeURIComponent(state)}`;
    return c.redirect(loginUrl);
  }
  try {
    const params = new URLSearchParams({ code });
    if (state) params.set("state", state);
    const userInfoUrl = `${oauthUrl}/${type}?${params.toString()}`;
    const resp = await fetch(userInfoUrl, {
      headers: { "User-Agent": "@waline" }
    });
    if (!resp.ok) {
      return c.redirect(`${redirect}?error=oauth_failed`);
    }
    const oauthUser = await resp.json();
    const socialId = String(oauthUser.id || oauthUser.login || oauthUser.name || "");
    const socialName = String(oauthUser.name || oauthUser.login || oauthUser.display_name || "");
    const socialEmail = String(oauthUser.email || "");
    const socialAvatar = String(oauthUser.avatar_url || oauthUser.avatar || "");
    const socialUrl = String(oauthUser.html_url || oauthUser.url || oauthUser.blog || "");
    if (!socialId) {
      return c.redirect(`${redirect}?error=oauth_no_id`);
    }
    const socialField = getSocialField(type);
    let user = null;
    if (socialField) {
      user = await c.env.DB.prepare(
        `SELECT * FROM wl_Users WHERE ${socialField} = ?`
      ).bind(socialId).first();
    }
    if (!user && socialEmail) {
      user = await c.env.DB.prepare(
        "SELECT * FROM wl_Users WHERE email = ?"
      ).bind(socialEmail).first();
      if (user && socialField) {
        await c.env.DB.prepare(
          `UPDATE wl_Users SET ${socialField} = ?, updatedAt = datetime('now') WHERE id = ?`
        ).bind(socialId, user.id).run();
      }
    }
    if (!user) {
      const userCount = await c.env.DB.prepare(
        "SELECT COUNT(*) as count FROM wl_Users"
      ).first();
      const isFirst = (userCount?.count || 0) === 0;
      const email = socialEmail || `${type}_${socialId}@oauth.local`;
      await c.env.DB.prepare(
        `INSERT INTO wl_Users (display_name, email, password, type, url, avatar, ${socialField || "github"})
         VALUES (?, ?, '', ?, ?, ?, ?)`
      ).bind(
        socialName || socialId,
        email,
        isFirst ? "administrator" : "guest",
        socialUrl,
        socialAvatar,
        socialId
      ).run();
      user = await c.env.DB.prepare(
        "SELECT * FROM wl_Users WHERE email = ?"
      ).bind(email).first();
    }
    if (!user) {
      return c.redirect(`${redirect}?error=oauth_create_failed`);
    }
    if (user.type === "banned") {
      return c.redirect(`${redirect}?error=account_banned`);
    }
    const jwtSecret = c.env.JWT_SECRET;
    if (!jwtSecret) {
      return c.redirect(`${redirect}?error=server_error`);
    }
    const token = await signJwt({ id: user.id }, jwtSecret);
    const sep = redirect.includes("?") ? "&" : "?";
    return c.redirect(`${redirect}${sep}token=${encodeURIComponent(token)}`);
  } catch {
    return c.redirect(`${redirect}?error=oauth_error`);
  }
});
function sanitizeRedirect(input) {
  if (!input || !input.startsWith("/") || input.startsWith("//")) return "/ui";
  return input;
}
__name(sanitizeRedirect, "sanitizeRedirect");
function getSocialField(type) {
  const map = {
    github: "github",
    twitter: "twitter",
    facebook: "facebook",
    google: "google",
    weibo: "weibo",
    qq: "qq"
  };
  return map[type] || null;
}
__name(getSocialField, "getSocialField");

// src/router/db.ts
var dbRoutes = new Hono2();
var TABLE_MAP = {
  Comment: "wl_Comment",
  Counter: "wl_Counter",
  Users: "wl_Users"
};
var ALLOWED_COLUMNS = {
  Comment: /* @__PURE__ */ new Set([
    "user_id",
    "comment",
    "orig",
    "insertedAt",
    "ip",
    "link",
    "mail",
    "nick",
    "pid",
    "rid",
    "sticky",
    "status",
    "like",
    "ua",
    "url",
    "createdAt",
    "updatedAt"
  ]),
  Counter: /* @__PURE__ */ new Set([
    "time",
    "reaction0",
    "reaction1",
    "reaction2",
    "reaction3",
    "reaction4",
    "reaction5",
    "reaction6",
    "reaction7",
    "reaction8",
    "url",
    "createdAt",
    "updatedAt"
  ]),
  Users: /* @__PURE__ */ new Set([
    "display_name",
    "email",
    "password",
    "type",
    "label",
    "url",
    "avatar",
    "github",
    "twitter",
    "facebook",
    "google",
    "weibo",
    "qq",
    "2fa",
    "createdAt",
    "updatedAt"
  ])
};
dbRoutes.use("*", async (c, next) => {
  const userInfo = c.get("userInfo");
  if (!userInfo) return c.json({ errno: 401, errmsg: "Unauthorized" }, 401);
  if (userInfo.type !== "administrator") return c.json({ errno: 403, errmsg: "Forbidden" }, 403);
  await next();
});
dbRoutes.get("/", async (c) => {
  const exportData = {
    type: "waline",
    version: 1,
    time: Date.now(),
    tables: ["Comment", "Counter", "Users"],
    data: {
      Comment: [],
      Counter: [],
      Users: []
    }
  };
  for (const logicalName of exportData.tables) {
    const tableName = TABLE_MAP[logicalName];
    const { results } = await c.env.DB.prepare(`SELECT * FROM "${tableName}"`).all();
    exportData.data[logicalName] = (results || []).map((row) => ({
      ...row,
      objectId: String(row.id)
    }));
  }
  return c.json({ errno: 0, data: exportData });
});
dbRoutes.post("/", async (c) => {
  const table = c.req.query("table");
  if (!table || !TABLE_MAP[table]) {
    return c.json({ errno: 1, errmsg: "Invalid table" }, 400);
  }
  const tableName = TABLE_MAP[table];
  const allowedCols = ALLOWED_COLUMNS[table];
  const body = await c.req.json();
  delete body.objectId;
  delete body.id;
  const keys = Object.keys(body).filter(
    (k) => allowedCols.has(k) && body[k] !== null && body[k] !== void 0
  );
  if (keys.length === 0) {
    return c.json({ errno: 1, errmsg: "Empty data" }, 400);
  }
  const cols = keys.map((k) => `"${k}"`).join(", ");
  const placeholders = keys.map(() => "?").join(", ");
  const values = keys.map((k) => body[k]);
  const result = await c.env.DB.prepare(
    `INSERT INTO "${tableName}" (${cols}) VALUES (${placeholders})`
  ).bind(...values).run();
  if (!result.success) {
    return c.json({ errno: 1, errmsg: "Insert failed" }, 500);
  }
  const row = await c.env.DB.prepare(
    `SELECT id FROM "${tableName}" WHERE rowid = last_insert_rowid()`
  ).first();
  return c.json({ errno: 0, data: { objectId: row ? String(row.id) : null } });
});
dbRoutes.put("/", async (c) => {
  const table = c.req.query("table");
  const objectId = c.req.query("objectId");
  if (!table || !TABLE_MAP[table] || !objectId) {
    return c.json({ errno: 1, errmsg: "Invalid table or objectId" }, 400);
  }
  const tableName = TABLE_MAP[table];
  const allowedCols = ALLOWED_COLUMNS[table];
  const body = await c.req.json();
  delete body.objectId;
  delete body.id;
  delete body.createdAt;
  const keys = Object.keys(body).filter(
    (k) => allowedCols.has(k) && body[k] !== null && body[k] !== void 0
  );
  if (keys.length === 0) {
    return c.json({ errno: 0 });
  }
  const setClauses = keys.map((k) => `"${k}" = ?`).join(", ");
  const values = keys.map((k) => body[k]);
  await c.env.DB.prepare(
    `UPDATE "${tableName}" SET ${setClauses}, "updatedAt" = datetime('now') WHERE id = ?`
  ).bind(...values, Number(objectId)).run();
  return c.json({ errno: 0 });
});
dbRoutes.delete("/", async (c) => {
  const table = c.req.query("table");
  if (!table || !TABLE_MAP[table]) {
    return c.json({ errno: 1, errmsg: "Invalid table" }, 400);
  }
  const tableName = TABLE_MAP[table];
  await c.env.DB.prepare(`DELETE FROM "${tableName}"`).run();
  return c.json({ errno: 0 });
});

// src/ui/waline-page.ts
function getWalinePage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Waline Example</title>
</head>
<body>
  <div id="waline" style="max-width: 800px;margin: 0 auto;"></div>
  <link href='//unpkg.com/@waline/client@v3/dist/waline.css' rel='stylesheet' />
  <script type="module">
    import { init } from 'https://unpkg.com/@waline/client@v3/dist/waline.js';

    console.log(
      '%c @waline/server %c v1.32.3 ',
      'color: white; background: #0078E7; padding:5px 0;',
      'padding:4px;border:1px solid #0078E7;'
    );
    const params = new URLSearchParams(location.search.slice(1));
    const waline = init({
      el: '#waline',
      path: params.get('path') || '/',
      lang: params.get('lng') || undefined,
      serverURL: location.protocol + '//' + location.host + location.pathname.replace(/\\/+$/, ''),
      recaptchaV3Key: '',
      turnstileKey: '',
    });
  <\/script>
</body>
</html>`;
}
__name(getWalinePage, "getWalinePage");

// src/ui/admin-panel.ts
async function getAdminPage(env, requestUrl) {
  const workerDisplay = await getSetting(env.DB, "worker_display").catch(() => null) || "admin";
  const url = new URL(requestUrl);
  const serverURL = `${url.origin}/api/`;
  const siteName = env.SITE_NAME || "";
  const siteUrl = env.SITE_URL || "";
  const recaptchaV3Key = env.RECAPTCHA_V3_KEY || "";
  const turnstileKey = env.TURNSTILE_KEY || "";
  const origin = url.origin;
  const showWorker = workerDisplay !== "disabled";
  const showAlways = workerDisplay === "always";
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Waline Management System</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
${showWorker ? `  <style>.wk-badge{display:inline-block;margin-right:8px;padding:1px 8px;background:#f97316;color:#fff;font-size:11px;border-radius:10px;vertical-align:middle;font-weight:normal;letter-spacing:.5px;line-height:18px}</style>` : ""}
</head>
<body>
  <script>
    window.serverURL = ${JSON.stringify(serverURL)};
    window.SITE_NAME = ${JSON.stringify(siteName || void 0)};
    window.SITE_URL = ${JSON.stringify(siteUrl || void 0)};
    window.recaptchaV3Key = ${JSON.stringify(recaptchaV3Key || void 0)};
    window.turnstileKey = ${JSON.stringify(turnstileKey || void 0)};
  <\/script>
  <script src="//unpkg.com/@waline/admin"><\/script>
${showWorker ? `  <script>
  (function(){
    var ORIGIN = ${JSON.stringify(origin)};
    var ALWAYS = ${JSON.stringify(showAlways)};
    var menuDone = false, badgeDone = false;

    function addBadge() {
      if (badgeDone) return;
      var op = document.querySelector('.typecho-head-nav .operate');
      if (!op) return;
      badgeDone = true;
      var s = document.createElement('span');
      s.className = 'wk-badge';
      s.textContent = 'Worker v1.0.0';
      op.insertBefore(s, op.firstChild);
    }

    function addMenu(tk) {
      if (menuDone) return;
      var nav = document.querySelector('#typecho-nav-list .child');
      if (!nav) return;
      menuDone = true;
      var li = document.createElement('li');
      li.className = 'last';
      var a = document.createElement('a');
      a.href = '/ui/worker-setting?token=' + encodeURIComponent(tk);
      a.textContent = 'Worker';
      li.appendChild(a);
      nav.appendChild(li);
    }

    function tryInject() {
      if (ALWAYS && !badgeDone) addBadge();
      if (menuDone && badgeDone) return;
      var tk = window.TOKEN || localStorage.getItem('TOKEN') || sessionStorage.getItem('TOKEN');
      if (!tk && !ALWAYS) return;
      if (tk && !menuDone) {
        fetch(ORIGIN + '/api/token', {
          headers: { Authorization: 'Bearer ' + tk }
        }).then(function(r){ return r.json(); }).then(function(d){
          if (d.errno === 0 && d.data && d.data.type === 'administrator') {
            addMenu(tk);
            addBadge();
          }
        }).catch(function(){});
      }
    }

    var ob = new MutationObserver(function(){ tryInject(); });
    ob.observe(document.body, { childList: true, subtree: true });
    var iv = setInterval(function(){ tryInject(); if (menuDone) clearInterval(iv); }, 2000);
    setTimeout(tryInject, 500);
  })();
  <\/script>` : ""}
</body>
</html>`;
}
__name(getAdminPage, "getAdminPage");

// src/ui/custom-admin.ts
function get404Page() {
  return `<!doctype html>
<html>
<head><meta charset="utf-8"><title>404 Not Found</title></head>
<body style="font-family:sans-serif;text-align:center;margin-top:120px;color:#656d76">
<h1 style="font-size:48px;margin-bottom:8px">404</h1><p>Not Found</p>
</body>
</html>`;
}
__name(get404Page, "get404Page");
function getCustomSettingsPage(requestUrl) {
  const url = new URL(requestUrl);
  const apiBase = url.origin;
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Worker Settings - Waline Management</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
/* Typecho admin theme */
*{box-sizing:border-box}
body{margin:0;font:87.5%/1.5 'Helvetica Neue',Helvetica,Arial,sans-serif;background:#f6f6f3;color:#444}
a{color:#467b96;text-decoration:none}a:hover{color:#499bc3}

/* Navigation */
.typecho-head-nav{padding:0 10px;background:#292d33;height:36px;line-height:36px}
.typecho-head-nav .inner{max-width:960px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
.typecho-head-nav .nav-links{display:flex;align-items:center;gap:0}
.typecho-head-nav a{color:#bbb;padding:0 20px;display:inline-block;height:36px;line-height:36px;font-size:13px}
.typecho-head-nav a:hover,.typecho-head-nav a.focus{color:#fff;background:#202328;text-decoration:none}
.typecho-head-nav .nav-sep{border-right:1px solid #383d45}
.typecho-head-nav .operate{margin-left:auto}

/* Page title */
.typecho-page-title{max-width:960px;margin:30px auto 0;padding:0 10px}
.typecho-page-title h2{font-size:1.28571em;margin:0 0 10px;font-weight:400}

/* Content */
.container{max-width:960px;margin:20px auto;padding:0 10px}

/* Options/form */
.typecho-option-tabs{list-style:none;margin:0 0 -1px;padding:0;display:flex;border-bottom:1px solid #d9d9d6}
.typecho-option-tabs li{margin:0}
.typecho-option-tabs li a{display:block;padding:8px 20px;color:#444;border:1px solid transparent;border-bottom:none;margin-bottom:-1px;font-size:13px}
.typecho-option-tabs li.active a{background:#fff;border-color:#d9d9d6;border-bottom-color:#fff;font-weight:bold}
.typecho-option-tabs li a:hover{color:#467b96;text-decoration:none}

.typecho-table-wrap{padding:30px;background:#fff;border:1px solid #d9d9d6;border-top:none}

.typecho-option{margin-bottom:20px}
.typecho-option .typecho-label{display:block;margin-bottom:.5em;font-weight:bold;font-size:13px}
.typecho-option .description{margin:.5em 0 0;color:#999;font-size:12px}

input[type="text"],input[type="password"],input[type="url"],textarea,select{
  background:#fff;border:1px solid #d9d9d6;padding:7px;border-radius:2px;font-size:13px;font-family:inherit;outline:none;
}
input[type="text"]:focus,input[type="password"]:focus,input[type="url"]:focus,textarea:focus,select:focus{
  border-color:#467b96;box-shadow:0 0 0 2px rgba(70,123,150,.15);
}
input[type="text"],input[type="password"],input[type="url"]{width:100%;max-width:480px}
textarea{width:100%;max-width:480px;resize:vertical;min-height:80px;line-height:1.5}
select{height:32px;min-width:200px}

/* Version picker */
.version-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.version-row input{flex:1;max-width:320px}
.version-row select{flex:0 0 auto;max-width:200px}
.version-row .btn{flex:0 0 auto}

/* Toggle */
.toggle-row{display:flex;align-items:center;gap:10px}
.toggle{position:relative;display:inline-block;width:40px;height:22px;vertical-align:middle}
.toggle input{opacity:0;width:0;height:0}
.toggle-slider{position:absolute;cursor:pointer;inset:0;background:#ccc;border-radius:22px;transition:.2s}
.toggle-slider:before{content:"";position:absolute;height:16px;width:16px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:.2s}
.toggle input:checked+.toggle-slider{background:#467b96}
.toggle input:checked+.toggle-slider:before{transform:translateX(18px)}
.toggle-label{font-size:13px;color:#666}

/* Buttons */
.btn{border:none;background:#e9e9e6;cursor:pointer;border-radius:2px;display:inline-block;padding:0 12px;height:32px;color:#666;font-size:13px;vertical-align:middle;line-height:32px}
.btn:hover{background:#dbdbd6;transition:.2s}
.primary{background:#467b96;color:#fff}
.primary:hover{background:#3c6a81}
.btn-warn{background:#b94a48;color:#fff}
.btn-warn:hover{background:#a4403f}
.btn-xs{padding:0 10px;height:25px;font-size:12px;line-height:25px}
.actions{margin-top:20px;display:flex;gap:8px}

/* Toast */
.toast{position:fixed;top:16px;right:16px;padding:10px 16px;border-radius:2px;font-size:13px;z-index:100;animation:fadeIn .2s}
.toast-ok{background:#e6efc2;color:#264409}.toast-err{background:#fbe3e4;color:#8a1f11}
@keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}

/* Loading spinner */
.spinner{display:inline-block;width:14px;height:14px;border:2px solid #ccc;border-top-color:#467b96;border-radius:50%;animation:spin .6s linear infinite;vertical-align:middle;margin-left:6px}
@keyframes spin{to{transform:rotate(360deg)}}
</style>
</head>
<body>

<!-- Navigation -->
<div class="typecho-head-nav">
  <div class="inner">
    <div class="nav-links">
      <span style="color:#fff;font-size:13px;padding:0 20px">Waline On Worker \u8BBE\u7F6E</span>
    </div>
    <div class="operate">
      <a href="/ui">\u2190 \u8FD4\u56DE\u7BA1\u7406\u9762\u677F</a>
    </div>
  </div>
</div>

<!-- Content -->
<div class="container">
  <!-- Tab bar -->
  <ul class="typecho-option-tabs" id="tabs">
    <li class="active"><a href="#" data-tab="frontend">\u524D\u7AEF\u7248\u672C</a></li>
    <li><a href="#" data-tab="comment">\u8BC4\u8BBA\u7B56\u7565</a></li>
  </ul>

  <!-- Tab: Frontend Version -->
  <div class="typecho-table-wrap tab-panel" id="tab-frontend">
    <div class="typecho-option">
      <label class="typecho-label">@waline/client CDN \u7248\u672C</label>
      <div class="version-row">
        <input type="text" id="set-version" placeholder="v3" />
        <select id="version-select">
          <option value="">\u9009\u62E9\u7248\u672C\u2026</option>
          <option value="latest">latest</option>
        </select>
        <button class="btn btn-xs" id="refresh-versions" title="\u5237\u65B0\u7248\u672C\u5217\u8868">\u21BB \u5237\u65B0</button>
      </div>
      <p class="description">\u4ECE unpkg CDN \u52A0\u8F7D\u7684 @waline/client \u7248\u672C\u3002\u53EF\u8F93\u5165\u7248\u672C\u53F7\uFF08\u5982 <code>v3</code>\u3001<code>3.3.2</code>\uFF09\u6216\u4ECE\u4E0B\u62C9\u83DC\u5355\u9009\u62E9\u3002</p>
    </div>
    <div class="typecho-option">
      <label class="typecho-label">Worker \u4FE1\u606F\u663E\u793A</label>
      <select id="set-worker-display">
        <option value="always">\u59CB\u7EC8\u663E\u793A</option>
        <option value="admin" selected>\u4EC5\u7BA1\u7406\u5458\u767B\u5F55</option>
        <option value="disabled">\u7981\u7528</option>
      </select>
      <p class="description">\u63A7\u5236 Waline on Worker \u6807\u8BC6\u5728\u9875\u9762\u548C\u63A7\u5236\u53F0\u4E2D\u7684\u53EF\u89C1\u6027\u3002\u300C\u59CB\u7EC8\u300D\u5BF9\u6240\u6709\u4EBA\u53EF\u89C1\uFF0C\u300C\u4EC5\u7BA1\u7406\u5458\u300D\u4EC5\u7BA1\u7406\u5458\u767B\u5F55\u540E\u53EF\u89C1\uFF0C\u300C\u7981\u7528\u300D\u5B8C\u5168\u9690\u85CF\u3002</p>
    </div>
  </div>

  <!-- Tab: Comment Policy + LLM Review -->
  <div class="typecho-table-wrap tab-panel" id="tab-comment" style="display:none">
    <h4 style="margin:0 0 16px;font-size:14px;color:#444;border-bottom:1px solid #eee;padding-bottom:8px">\u9ED8\u8BA4\u72B6\u6001</h4>
    <div class="typecho-option">
      <label class="typecho-label">\u533F\u540D\u8BC4\u8BBA\u9ED8\u8BA4\u72B6\u6001</label>
      <select id="set-comment-status">
        <option value="approved">\u76F4\u63A5\u901A\u8FC7 (approved)</option>
        <option value="waiting">\u7B49\u5F85\u5BA1\u6838 (waiting)</option>
      </select>
      <p class="description">\u672A\u767B\u5F55\u7528\u6237\u53D1\u8868\u8BC4\u8BBA\u7684\u9ED8\u8BA4\u72B6\u6001\u3002\u6B64\u8BBE\u7F6E\u4F18\u5148\u4E8E\u73AF\u5883\u53D8\u91CF AUDIT\u3002</p>
    </div>
    <div class="typecho-option">
      <label class="typecho-label">\u7528\u6237\u8BC4\u8BBA\u9ED8\u8BA4\u72B6\u6001</label>
      <select id="set-user-comment-status">
        <option value="approved">\u76F4\u63A5\u901A\u8FC7 (approved)</option>
        <option value="waiting">\u7B49\u5F85\u5BA1\u6838 (waiting)</option>
      </select>
      <p class="description">\u5DF2\u767B\u5F55\u7528\u6237\u53D1\u8868\u8BC4\u8BBA\u7684\u9ED8\u8BA4\u72B6\u6001\u3002</p>
    </div>
    <h4 style="margin:24px 0 16px;font-size:14px;color:#444;border-bottom:1px solid #eee;padding-bottom:8px">LLM \u5BA1\u67E5</h4>
    <div class="typecho-option">
      <label class="typecho-label">LLM \u5BA1\u67E5\u6A21\u5F0F</label>
      <select id="set-llm-mode">
        <option value="off">\u5173\u95ED</option>
        <option value="anonymous">\u4EC5\u5BF9\u533F\u540D\u8BC4\u8BBA\u542F\u7528</option>
        <option value="all" selected>\u5168\u90E8\u8BC4\u8BBA (\u9ED8\u8BA4)</option>
      </select>
      <p class="description">\u9009\u62E9 LLM \u81EA\u52A8\u5BA1\u67E5\u7684\u9002\u7528\u8303\u56F4\u3002\u300C\u5173\u95ED\u300D\u4E0D\u8FDB\u884C\u5BA1\u67E5\uFF1B\u300C\u4EC5\u533F\u540D\u300D\u4EC5\u5BA1\u67E5\u672A\u767B\u5F55\u7528\u6237\u7684\u8BC4\u8BBA\uFF1B\u300C\u5168\u90E8\u300D\u5BA1\u67E5\u6240\u6709\u8BC4\u8BBA\u3002</p>
    </div>
    <div class="typecho-option">
      <label class="typecho-label">\u7BA1\u7406\u5458\u8DF3\u8FC7\u5BA1\u67E5</label>
      <div class="toggle-row">
        <label class="toggle"><input type="checkbox" id="set-llm-skip-admin" checked /><span class="toggle-slider"></span></label>
        <span class="toggle-label">\u7BA1\u7406\u5458\u53D1\u8868\u7684\u8BC4\u8BBA\u8DF3\u8FC7 LLM \u5BA1\u67E5\uFF08\u9ED8\u8BA4\u5F00\u542F\uFF09</span>
      </div>
    </div>
    <div class="typecho-option">
      <label class="typecho-label">API Endpoint</label>
      <input type="url" id="set-llm-ep" placeholder="https://api.openai.com/v1/chat/completions" />
      <p class="description">OpenAI \u517C\u5BB9\u7684 Chat Completions \u7AEF\u70B9</p>
    </div>
    <div class="typecho-option">
      <label class="typecho-label">API Key</label>
      <input type="password" id="set-llm-key" placeholder="sk-..." />
    </div>
    <div class="typecho-option">
      <label class="typecho-label">Model</label>
      <input type="text" id="set-llm-model" placeholder="gpt-4o-mini" />
    </div>
    <div class="typecho-option">
      <label class="typecho-label">System Prompt</label>
      <textarea id="set-llm-prompt" rows="6" placeholder="You are a review bot. Output a single word: approved or spam."></textarea>
    </div>
    <p class="description" style="margin-top:10px;color:#888">LLM \u8C03\u7528\u5931\u8D25\u65F6\uFF0C\u5C06\u9075\u5FAA\u5BF9\u5E94\u7684\u8BC4\u8BBA\u9ED8\u8BA4\u72B6\u6001\u8BBE\u7F6E\uFF08\u533F\u540D/\u7528\u6237\uFF09\u3002</p>
    <div style="margin-top:16px">
      <button class="btn" id="test-btn">\u6D4B\u8BD5 LLM \u8FDE\u63A5</button>
    </div>
  </div>

  <!-- Actions -->
  <div class="actions">
    <button class="btn primary" id="save-btn">\u4FDD\u5B58\u8BBE\u7F6E</button>
  </div>
</div>

<script>
(function(){
  var API = ${JSON.stringify(apiBase)};
  var token = localStorage.getItem('TOKEN') || sessionStorage.getItem('TOKEN');

  function esc(s) { if (!s) return ''; var d = document.createElement('div'); d.textContent = String(s); return d.innerHTML; }

  function toast(msg, ok) {
    var el = document.createElement('div');
    el.className = 'toast ' + (ok ? 'toast-ok' : 'toast-err');
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function(){ el.remove(); }, 3000);
  }

  function api(path, opts) {
    opts = opts || {};
    var headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    if (token) headers['Authorization'] = 'Bearer ' + token;
    return fetch(API + '/api' + path, Object.assign({}, opts, { headers: headers })).then(function(r){ return r.json(); });
  }

  // Tab switching
  var tabs = document.querySelectorAll('.typecho-option-tabs a');
  var panels = document.querySelectorAll('.tab-panel');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      var target = this.getAttribute('data-tab');
      tabs.forEach(function(t){ t.parentElement.classList.remove('active'); });
      this.parentElement.classList.add('active');
      panels.forEach(function(p){ p.style.display = 'none'; });
      document.getElementById('tab-' + target).style.display = '';
    });
  });

  // Fetch npm versions via jsdelivr API
  function fetchVersions() {
    var btn = document.getElementById('refresh-versions');
    var sel = document.getElementById('version-select');
    btn.disabled = true;
    btn.innerHTML = '\u21BB<span class="spinner"></span>';
    fetch('https://data.jsdelivr.com/v1/packages/npm/@waline/client')
      .then(function(r){ return r.json(); })
      .then(function(data) {
        sel.innerHTML = '<option value="">\u9009\u62E9\u7248\u672C\u2026</option><option value="latest">latest' +
          (data.tags && data.tags.latest ? ' (' + esc(data.tags.latest) + ')' : '') + '</option>';
        if (data.versions) {
          data.versions.slice(0, 30).forEach(function(v) {
            var opt = document.createElement('option');
            opt.value = v.version;
            opt.textContent = v.version;
            sel.appendChild(opt);
          });
        }
        toast('\u7248\u672C\u5217\u8868\u5DF2\u5237\u65B0', true);
      })
      .catch(function(e){ toast('\u83B7\u53D6\u7248\u672C\u5931\u8D25: ' + e.message, false); })
      .finally(function(){ btn.disabled = false; btn.textContent = '\u21BB \u5237\u65B0'; });
  }

  document.getElementById('refresh-versions').addEventListener('click', fetchVersions);
  document.getElementById('version-select').addEventListener('change', function() {
    if (this.value) document.getElementById('set-version').value = this.value;
  });

  // Load settings
  api('/settings').then(function(sr) {
    var s = sr.data || {};
    document.getElementById('set-version').value = s.waline_client_version || 'v3';
    document.getElementById('set-comment-status').value = s.comment_default_status || 'approved';
    document.getElementById('set-user-comment-status').value = s.user_comment_default_status || 'approved';
    document.getElementById('set-worker-display').value = s.worker_display || 'admin';
    // llm_mode: migrate from old llm_enabled if present
    var mode = s.llm_mode || (s.llm_enabled === '1' ? 'anonymous' : 'off');
    document.getElementById('set-llm-mode').value = mode;
    document.getElementById('set-llm-skip-admin').checked = s.llm_skip_admin !== '0';
    document.getElementById('set-llm-ep').value = s.llm_endpoint || '';
    document.getElementById('set-llm-key').value = s.llm_api_key || '';
    document.getElementById('set-llm-model').value = s.llm_model || 'gpt-4o-mini';
    document.getElementById('set-llm-prompt').value = s.llm_prompt || 'You are a review bot. Output a single word: approved or spam.';

    // Match selected version in dropdown
    var sel = document.getElementById('version-select');
    var ver = s.waline_client_version || 'v3';
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === ver) { sel.selectedIndex = i; break; }
    }
  }).catch(function(){ toast('\u52A0\u8F7D\u8BBE\u7F6E\u5931\u8D25', false); });

  // Auto-fetch versions on load
  fetchVersions();

  // Save
  document.getElementById('save-btn').addEventListener('click', function() {
    var settings = {
      waline_client_version: document.getElementById('set-version').value.trim() || 'v3',
      comment_default_status: document.getElementById('set-comment-status').value,
      user_comment_default_status: document.getElementById('set-user-comment-status').value,
      worker_display: document.getElementById('set-worker-display').value,
      llm_mode: document.getElementById('set-llm-mode').value,
      llm_skip_admin: document.getElementById('set-llm-skip-admin').checked ? '1' : '0',
      llm_endpoint: document.getElementById('set-llm-ep').value.trim(),
      llm_api_key: document.getElementById('set-llm-key').value.trim(),
      llm_model: document.getElementById('set-llm-model').value.trim(),
      llm_prompt: document.getElementById('set-llm-prompt').value.trim(),
    };
    api('/settings', { method: 'PUT', body: JSON.stringify(settings) }).then(function(r) {
      toast(r.errno ? (r.errmsg || '\u4FDD\u5B58\u5931\u8D25') : '\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\uFF01', !r.errno);
    }).catch(function(){ toast('\u4FDD\u5B58\u5931\u8D25', false); });
  });

  // Test LLM
  document.getElementById('test-btn').addEventListener('click', function() {
    var ep = document.getElementById('set-llm-ep').value.trim();
    var key = document.getElementById('set-llm-key').value.trim();
    var model = document.getElementById('set-llm-model').value.trim();
    if (!ep || !key) { toast('\u8BF7\u5148\u586B\u5199 Endpoint \u548C Key', false); return; }
    fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({ model: model || 'gpt-4o-mini', messages: [{ role: 'user', content: 'Hello, respond with OK' }], max_tokens: 10 }) })
    .then(function(r) { toast(r.ok ? 'LLM \u8FDE\u63A5\u6B63\u5E38\uFF01' : '\u5931\u8D25: ' + r.status, r.ok); })
    .catch(function(e) { toast('\u9519\u8BEF: ' + e.message, false); });
  });
})();
<\/script>
</body>
</html>`;
}
__name(getCustomSettingsPage, "getCustomSettingsPage");

// src/index.ts
var app = new Hono2();
app.use(
  "*",
  cors({
    origin: /* @__PURE__ */ __name((origin, c) => {
      const secureDomains = c.env.SECURE_DOMAINS;
      if (!secureDomains) return origin;
      const allowed = secureDomains.split(",").map((d) => d.trim());
      if (allowed.some((d) => origin === d || origin.endsWith(`.${d}`))) {
        return origin;
      }
      return "";
    }, "origin"),
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "x-waline-version"],
    credentials: true
  })
);
app.use("*", async (c, next) => {
  await next();
  c.header("x-waline-version", "1.0.0");
});
app.use("*", auth);
app.onError((err, c) => {
  if (err instanceof SyntaxError) {
    return c.json({ errno: 1, errmsg: "Invalid JSON body" }, 400);
  }
  console.error("[Unhandled Error]", err?.message || err);
  return c.json({ errno: 1, errmsg: "Internal Server Error" }, 500);
});
app.route("/api/comment", commentRoutes);
app.route("/api/article", articleRoutes);
app.route("/api/user", userRoutes);
app.route("/api/token", tokenRoutes);
app.route("/api/settings", settingsRoutes);
app.route("/api/oauth", oauthRoutes);
app.route("/api/db", dbRoutes);
app.get("/ui/worker-setting", async (c) => {
  const userInfo = c.get("userInfo");
  if (userInfo?.type !== "administrator") {
    return c.html(get404Page(), 404);
  }
  return c.html(getCustomSettingsPage(c.req.url));
});
app.get("/ui", async (c) => {
  return c.html(await getAdminPage(c.env, c.req.url));
});
app.get("/ui/*", async (c) => {
  return c.html(await getAdminPage(c.env, c.req.url));
});
app.get("/", (c) => {
  return c.html(getWalinePage());
});
var index_default = app;
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
