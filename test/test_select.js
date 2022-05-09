import assert from "assert";
import {
  extractNumber,
  extractAndProcessNumber,
} from "kor-to-number";

function assertIncludes(original, allowed, expected) {
  function mapper(analysis) {
    const rest = analysis.rest;
    const result = [analysis.parsed, analysis.rest.trim()];
    if (/(^|\s)$/.test(analysis.consumed)) return result;
    if (!rest) return result;
    return allowed.includes(rest.split(" ")[0]) ? result : null;
  }
  assert.deepStrictEqual(
    extractAndProcessNumber(original, mapper),
    expected
  );
}

function assertFormat(original, format, expected) {
  assert.deepStrictEqual(extractNumber(original, format), expected);
}

describe("선별", function () {
  it("조사", function () {
    const particles = " 은 는 이 가 을 를".split(" ");
    assertIncludes("0을", particles, [0, "을"]);
    assertIncludes("영을", particles, [0, "을"]);
    assertIncludes("1234를", particles, [1234, "를"]);
    assertIncludes("천이백삼십사를", particles, [1234, "를"]);
    assertIncludes("1234km", particles, null);
    assertIncludes("1234 km", particles, [1234, "km"]);
    assertIncludes("1234개", particles, null);
    assertIncludes("1234 개", particles, [1234, "개"]);
    assertIncludes("천이백삼십개", particles, null);
    assertIncludes("천이백삼십 개", particles, [1230, "개"]);
    assertIncludes("한 개", particles, [1, "개"]);
    assertIncludes("한 개 더", particles, [1, "개 더"]);
    assertIncludes("한개", particles, null);
    assertIncludes("일만 개", particles, [10000, "개"]);
    assertIncludes("일만 한개", particles, [10000, "한개"]);
    assertIncludes("하나가", particles, [1, "가"]);
    assertIncludes("하나가 다", particles, [1, "가 다"]);
    assertIncludes("일만 하나가", particles, [10001, "가"]);
  });
});

describe("형식", function () {
  it("숫자만", function () {
    assertFormat("1", ["숫자"], [1, ""]);
    assertFormat("1E4", ["숫자"], [10000, ""]);
    assertFormat("-0.1e+4", ["숫자"], [-1000, ""]);
    assertFormat("3십", ["숫자"], [3, "십"]);
    assertFormat("3만", ["숫자"], [3, "만"]);
    assertFormat("십", ["숫자"], [NaN, "십"]);
    assertFormat("만", ["숫자"], [NaN, "만"]);
    assertFormat("삼", ["숫자"], [NaN, "삼"]);
    assertFormat("셋", ["숫자"], [NaN, "셋"]);
  });
  it("숫자혼용만", function () {
    assertFormat("1", ["숫자혼용"], [1, ""]);
    assertFormat("1E4", ["숫자혼용"], [1, "E4"]);
    assertFormat("-0.1e+4", ["숫자혼용"], [NaN, "-0.1e+4"]);
    assertFormat("3십", ["숫자혼용"], [30, ""]);
    assertFormat("3만", ["숫자혼용"], [30000, ""]);
    assertFormat("십", ["숫자혼용"], [10, ""]);
    assertFormat("만", ["숫자혼용"], [10000, ""]);
    assertFormat("삼", ["숫자혼용"], [NaN, "삼"]);
    assertFormat("셋", ["숫자혼용"], [NaN, "셋"]);
  });
  it("한자어만", function () {
    assertFormat("1", ["한자어"], [NaN, "1"]);
    assertFormat("1E4", ["한자어"], [NaN, "1E4"]);
    assertFormat("-0.1e+4", ["한자어"], [NaN, "-0.1e+4"]);
    assertFormat("3십", ["한자어"], [NaN, "3십"]);
    assertFormat("3만", ["한자어"], [NaN, "3만"]);
    assertFormat("십", ["한자어"], [10, ""]);
    assertFormat("만", ["한자어"], [10000, ""]);
    assertFormat("삼", ["한자어"], [3, ""]);
    assertFormat("셋", ["한자어"], [NaN, "셋"]);
  });
  it("순우리말만", function () {
    assertFormat("1", ["순우리말"], [NaN, "1"]);
    assertFormat("1E4", ["순우리말"], [NaN, "1E4"]);
    assertFormat("-0.1e+4", ["순우리말"], [NaN, "-0.1e+4"]);
    assertFormat("3십", ["순우리말"], [NaN, "3십"]);
    assertFormat("3만", ["순우리말"], [NaN, "3만"]);
    assertFormat("십", ["순우리말"], [10, ""]);
    assertFormat("만", ["순우리말"], [10000, ""]);
    assertFormat("삼", ["순우리말"], [NaN, "삼"]);
    assertFormat("셋", ["순우리말"], [3, ""]);
  });
});
