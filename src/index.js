import {
  SINO_MAP_ONES,
  SINO_MAP_SMALL,
  SINO_MAP_LARGE,
  NATIVE_MAP_ONES,
  MAP_TENS,
} from "./constants.js";

function extractUnion(extractors) {
  return function (word) {
    const trials = extractors.map((f) => f(word));
    let result = [NaN, word];
    for (const trial of trials) {
      if (trial[1].length < result[1].length) result = trial;
    }
    return result;
  };
}

function extractByPattern(pattern, parser) {
  return function (word) {
    let matched = word.match(pattern);
    if (matched == null) return [NaN, word];
    matched = matched[0];
    const parsed = parser(matched);
    const rest = word.slice(matched.length);
    return [parsed, rest];
  };
}

const extractDecimal = extractByPattern(
  /^[+-]?(?:\d+(?:,\d+)*[.]?\d*|[.]\d+)/,
  (x) => Number(x.replace(/,/g, ""))
);
const extractScientific = extractByPattern(
  /^[+-]?(?:\d+[.]?\d*|[.]\d+)e[+-]?\d+/i,
  Number
);

function cutTable(table, threshold) {
  let newTable = {};
  for (const key in table) {
    if (table[key] < threshold) newTable[key] = table[key];
  }
  return newTable;
}

function extractFromTable(word, table) {
  for (const key in table) {
    if (word.slice(0, key.length) === key)
      return [table[key], word.slice(key.length)];
  }
  return [NaN, word];
}

function extractInGroup(
  unitTable,
  getGroup,
  getGroupLast = null,
  trim = false
) {
  return function (word) {
    let rest = word;
    let parsed = 0;
    let touch = false;
    let _unitTable = unitTable;
    while (true) {
      let group, unit, _rest;
      [group, _rest] = getGroup(rest);
      [unit, _rest] = extractFromTable(_rest, _unitTable);
      if (isNaN(unit) && getGroupLast) {
        [group, _rest] = getGroupLast(rest);
      }
      rest = trim ? _rest.trim() : _rest;

      if (isNaN(group) && isNaN(unit)) break;
      parsed += (isNaN(group) ? 1 : group) * (isNaN(unit) ? 1 : unit);
      touch = true;

      if (isNaN(unit)) break;
      _unitTable = cutTable(_unitTable, unit);
    }
    return [touch ? parsed : NaN, rest];
  };
}

function extractSign(f) {
  return function (word) {
    const _ = ([num, rest]) => ([num, isNaN(num)? word: rest])
    const neg = ([num, rest]) => [-num, rest];
    if (word.slice(0, 3) === "플러스") return _(f(word.slice(3).trim()));
    if (word.slice(0, 4) === "마이너스") return _(neg(f(word.slice(4).trim())));
    if (/^[+]\d/.test(word)) return _(f(word.slice(1)));
    if (/^[-]\d/.test(word)) return _(neg(f(word.slice(1))));
    return f(word);
  };
}

const extractSinoSmall = extractInGroup(SINO_MAP_SMALL, (x) =>
  extractFromTable(x, SINO_MAP_ONES)
);
const extractSinoLarge = extractUnion([
  extractByPattern(/^영/, (_) => 0),
  extractInGroup(SINO_MAP_LARGE, extractSinoSmall, null, true),
]);
const extractSinoFraction = extractByPattern(
  /^\s*점\s*[영일이삼사오육륙칠팔구]+/,
  function (matched) {
    matched = matched.trim().slice(1).trim();
    matched = matched
      .split("")
      .map((x) => SINO_MAP_ONES[x] || "0")
      .join("");
    return Number("0." + matched);
  }
);

function extractSino(word) {
  let [integral, rest] = extractSinoLarge(word);
  if (rest.length === 0 || rest[0] !== "점") return [integral, rest];

  let fraction;
  [fraction, rest] = extractSinoFraction(rest);
  if (isNaN(integral)) return [fraction, rest];
  return [integral + (isNaN(fraction) ? 0 : fraction), rest];
}

const extractDigit = extractByPattern(/^[1-9]/, Number);
const extractMixSmall = extractInGroup(SINO_MAP_SMALL, extractDigit);
const extractMixLarge = extractInGroup(
  SINO_MAP_LARGE,
  extractMixSmall,
  null,
  true
);

const extractDigits = extractByPattern(/^[1-9]\d{0,3}/, Number);
const extractDigitsLarge = extractInGroup(
  SINO_MAP_LARGE,
  extractDigits,
  null,
  true
);

function extractNativeTens(word) {
  if (word.slice(0, 2) === "스무") return [20, word.slice(2)];
  let ten, one, rest;
  [ten, rest] = extractFromTable(word, MAP_TENS);
  [one, rest] = extractFromTable(rest, NATIVE_MAP_ONES);
  if (isNaN(ten)) return [one, rest];
  return [ten + (isNaN(one) ? 0 : one), rest];
}

function extractNativeSmall(word) {
  let rest = word;
  let parsed = 0;
  let _unitTable = { 백: 100, 천: 1000 };
  while (true) {
    let unit, group, _rest;
    [group, _rest] = extractFromTable(rest, SINO_MAP_ONES);
    [unit, _rest] = extractFromTable(_rest, _unitTable);
    if (isNaN(unit)) break;
    rest = _rest;

    parsed += (isNaN(group) ? 1 : group) * (isNaN(unit) ? 1 : unit);
    _unitTable = cutTable(_unitTable, unit);
  }
  let tens;
  [tens, rest] = extractNativeTens(rest);
  if (parsed === 0) return [tens, rest];
  return [parsed + (isNaN(tens) ? 0 : tens), rest];
}

const extractNative = extractInGroup(
  SINO_MAP_LARGE,
  extractSinoSmall,
  extractNativeSmall,
  true
);

const extractFinal = extractUnion([
  extractDecimal,
  extractScientific,
  extractSign(extractMixLarge),
  extractSign(extractDigitsLarge),
  extractSign(extractSino),
  extractNative,
]);

function extractNumber(word) {
  let [parsed, rest] = extractFinal(word.trim());
  return [parsed, rest.trim()];
}

export { extractNumber };
