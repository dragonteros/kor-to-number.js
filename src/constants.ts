type MAP_TYPE = {
  [key: string]: number;
};
type ORDERED_MAP_TYPE = [string, number][];
const SINO_MAP_ONES: MAP_TYPE = {
  일: 1,
  이: 2,
  삼: 3,
  사: 4,
  오: 5,
  육: 6,
  륙: 6,
  칠: 7,
  팔: 8,
  구: 9,
};
const SINO_MAP_SMALL: ORDERED_MAP_TYPE = [
  ["천", 1000],
  ["백", 100],
  ["십", 10],
];
const SINO_MAP_LARGE: ORDERED_MAP_TYPE = [
  ["양", 1e28],
  ["자", 1e24],
  ["해", 1e20],
  ["경", 1e16],
  ["조", 1e12],
  ["억", 1e8],
  ["만", 1e4],
];
const NATIVE_MAP_ONES: MAP_TYPE = {
  하나: 1,
  둘: 2,
  셋: 3,
  넷: 4,
  다섯: 5,
  여섯: 6,
  일곱: 7,
  여덟: 8,
  아홉: 9,
  한: 1,
  두: 2,
  세: 3,
  석: 3,
  서: 3,
  네: 4,
  넉: 4,
  너: 4,
  닷: 5,
  엿: 6,
};
const MAP_TENS: MAP_TYPE = {
  열: 10,
  스물: 20,
  서른: 30,
  마흔: 40,
  쉰: 50,
  예순: 60,
  일흔: 70,
  여든: 80,
  아흔: 90,
  십: 10,
  일십: 10,
  이십: 20,
  삼삽: 30,
  사십: 40,
  오십: 50,
  육십: 60,
  륙십: 60,
  칠십: 70,
  팔십: 80,
  구십: 90,
};

export {
  MAP_TYPE,
  ORDERED_MAP_TYPE,
  SINO_MAP_ONES,
  SINO_MAP_SMALL,
  SINO_MAP_LARGE,
  NATIVE_MAP_ONES,
  MAP_TENS,
};
