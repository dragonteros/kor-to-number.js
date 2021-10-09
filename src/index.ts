import {
  MAP_TYPE,
  ORDERED_MAP_TYPE,
  SINO_MAP_ONES,
  SINO_MAP_SMALL,
  SINO_MAP_LARGE,
  NATIVE_MAP_ONES,
  MAP_TENS,
} from "./constants.js";

const isValid = (x: Analysis) => !isNaN(x.parsed);

type Analysis = { consumed: string; parsed: number; rest: string };
type Analyzer = (word: string) => Analysis[];

function unionAnalyzer(...analyzers: Analyzer[]): Analyzer {
  return (word) => analyzers.flatMap((f) => f(word).filter(isValid));
}

function patternAnalyzer(
  pattern: RegExp,
  parser: (x: string) => number
): Analyzer {
  return function (word: string): Analysis[] {
    const match = word.match(pattern);
    if (match == null) return [];
    const matched = match[0];
    const consumed = word.slice(0, matched.length);
    const parsed = parser(matched);
    const rest = word.slice(matched.length);
    return [{ consumed, parsed, rest }];
  };
}

const integerAnalyzer = patternAnalyzer(/^[+-]?\d+(?:,\d+)*/, (x) =>
  Number(x.replace(/,/g, ""))
);
const decimalAnalyzer = patternAnalyzer(
  /^[+-]?(?:\d+(?:,\d+)*[.]\d*|[.]\d+)/,
  (x) => Number(x.replace(/,/g, ""))
);
const scientificAnalyzer = patternAnalyzer(
  /^[+-]?(?:\d+[.]?\d*|[.]\d+)e[+-]?\d+/i,
  Number
);

function tableAnalyzer(table: MAP_TYPE): Analyzer {
  return function (word: string): Analysis[] {
    let analyses = [];
    for (const key in table) {
      if (word.slice(0, key.length) === key) {
        analyses.push({
          consumed: key,
          parsed: table[key],
          rest: word.slice(key.length),
        });
      }
    }
    return analyses;
  };
}

type Combiner = (cumulative: Analysis) => (update: Analysis) => Analysis;

function combineByAddition(cumulative: Analysis) {
  return function (update: Analysis): Analysis {
    return {
      consumed: cumulative.consumed + update.consumed,
      parsed: cumulative.parsed + update.parsed,
      rest: update.rest,
    };
  };
}

function combineByMultiplication(cumulative: Analysis) {
  return function (update: Analysis): Analysis {
    return {
      consumed: cumulative.consumed + update.consumed,
      parsed: cumulative.parsed * update.parsed,
      rest: update.rest,
    };
  };
}

function sequentialAnalyzer(
  analyzers: Analyzer[],
  combiner: Combiner = combineByAddition,
  omissible = true
): Analyzer {
  function binary(a: Analyzer, b: Analyzer): Analyzer {
    return function (word: string): Analysis[] {
      let result = [];
      if (omissible) result.push(...b(word));
      for (const analysis of a(word)) {
        if (omissible) result.push(analysis);
        if (analysis.rest.length >= word.length)
          throw Error("Infinite Recursion");
        result.push(...b(analysis.rest).map(combiner(analysis)));
      }
      return result.filter(isValid);
    };
  }
  const empty: Analyzer = (_) => [];
  return analyzers.length ? analyzers.reduce(binary) : empty;
}

function unitAnalyzer(
  getGroup: Analyzer,
  unitName: string,
  unitValue: number
): Analyzer {
  const getUnit = tableAnalyzer({ [unitName]: unitValue });
  return unionAnalyzer(
    getUnit,
    sequentialAnalyzer([getGroup, getUnit], combineByMultiplication, false)
  );
}
function groupAnalyzer(
  unitTable: ORDERED_MAP_TYPE,
  getGroup: Analyzer,
  getGroupLast?: Analyzer,
  trim = false
): Analyzer {
  function trimRest(x: Analysis): Analysis {
    const split = x.rest.match(/^(\s*)(.*)$/);
    if (split == null) return x;
    return {
      consumed: x.consumed + split[1],
      parsed: x.parsed,
      rest: split[2],
    };
  }
  let mappers = unitTable.map((pair) => unitAnalyzer(getGroup, ...pair));
  if (trim) mappers = mappers.map((f) => (x) => f(x).map(trimRest));
  return sequentialAnalyzer([...mappers, getGroupLast || getGroup]);
}

const sinoAnalyzerSmall = groupAnalyzer(
  SINO_MAP_SMALL,
  tableAnalyzer(SINO_MAP_ONES)
);
const sinoAnalyzerLarge = unionAnalyzer(
  patternAnalyzer(/^영/, (_) => 0),
  groupAnalyzer(SINO_MAP_LARGE, sinoAnalyzerSmall, undefined, true)
);
const sinoAnalyzerFraction = patternAnalyzer(
  /^\s*점\s*[영일이삼사오육륙칠팔구]+/,
  function (matched) {
    const sino = matched.trim().slice(1).trim();
    const digits = sino
      .split("")
      .map((x: string) => SINO_MAP_ONES[x] || "0")
      .join("");
    return Number("0." + digits);
  }
);
const sinoAnalyzer = sequentialAnalyzer([
  sinoAnalyzerLarge,
  sinoAnalyzerFraction,
]);

const digitAnalyzer = patternAnalyzer(/^[1-9]/, Number);
const mixAnalyzerSmall = groupAnalyzer(SINO_MAP_SMALL, digitAnalyzer);
const mixAnalyzerLarge = groupAnalyzer(
  SINO_MAP_LARGE,
  mixAnalyzerSmall,
  undefined,
  true
);

const digitsAnalyzerSmall = patternAnalyzer(/^[1-9]\d{0,3}/, Number);
const digitsAnalyzerLarge = groupAnalyzer(
  SINO_MAP_LARGE,
  digitsAnalyzerSmall,
  undefined,
  true
);

function signAnalyzer(f: Analyzer) {
  const plus = sequentialAnalyzer(
    [patternAnalyzer(/^플러스\s*|^[+](?=\d)/, (_) => +1), f],
    combineByMultiplication,
    false
  );
  const minus = sequentialAnalyzer(
    [patternAnalyzer(/^마이너스\s*|^[-](?=\d)/, (_) => -1), f],
    combineByMultiplication,
    false
  );
  return unionAnalyzer(plus, minus, f);
}

const nativeAnalyzerTens = unionAnalyzer(
  patternAnalyzer(/^스무/, (_) => 20),
  sequentialAnalyzer([tableAnalyzer(MAP_TENS), tableAnalyzer(NATIVE_MAP_ONES)])
);
const nativeAnalyzerSmall = groupAnalyzer(
  [
    ["천", 1000],
    ["백", 100],
  ],
  tableAnalyzer(SINO_MAP_ONES),
  nativeAnalyzerTens
);
const nativeAnalyzer = groupAnalyzer(
  SINO_MAP_LARGE,
  sinoAnalyzerSmall,
  nativeAnalyzerSmall,
  true
);

function getBest(...analyses: (Analysis | null)[]): Analysis | null {
  let best: Analysis | null = null;
  for (const analysis of analyses) {
    if (!analysis) continue;
    else if (!best) best = analysis;
    else if (best.rest.length > analysis.rest.length) best = analysis;
  }
  return best;
}

type formatType = "숫자" | "숫자혼용" | "한자어" | "순우리말";
const analyzerPool = {
  숫자: unionAnalyzer(integerAnalyzer, decimalAnalyzer, scientificAnalyzer),
  숫자혼용: signAnalyzer(unionAnalyzer(mixAnalyzerLarge, digitsAnalyzerLarge)),
  한자어: signAnalyzer(sinoAnalyzer),
  순우리말: nativeAnalyzer,
};

function extractNumber(
  word: string,
  format: formatType[] = ["숫자", "숫자혼용", "한자어", "순우리말"]
): [number, string] {
  word = word.trim();
  const analyzer = unionAnalyzer(
    ...format.map((key) => analyzerPool[key]).filter((x) => x)
  );
  const analyses = analyzer(word);
  const best = getBest(...analyses);
  if (best) return [best.parsed, best.rest.trim()];
  else return [NaN, word];
}

type Mapper<T> = (analysis: Analysis) => T | null;
function extractAndProcessNumber<T>(
  word: string,
  mapper: Mapper<T>,
  format: formatType[] = ["숫자", "숫자혼용", "한자어", "순우리말"],
): T | null {
  word = word.trim();
  const analyzer = unionAnalyzer(
    ...format.map((key) => analyzerPool[key]).filter((x) => x)
  );
  const analyses = analyzer(word);
  const mapped = analyses.map(mapper);

  let best: number | null = null;
  for (let i = 0; i < analyses.length; i++) {
    if (mapped[i] === null) continue;
    else if (best === null) best = i;
    else if (analyses[best].rest.length > analyses[i].rest.length) best = i;
  }
  return best !== null ? mapped[best] : null;
}

export { extractNumber, Analysis, formatType, extractAndProcessNumber, Mapper };
