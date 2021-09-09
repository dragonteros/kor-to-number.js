const assert = require("assert");
const { extractNumber } = require("../src/index.js");

function assertNumber(original, expected) {
  assert.deepStrictEqual(extractNumber(original), expected);
}

describe("숫자만", function () {
  it("쉼표 없이", function () {
    assertNumber("0", [0, ""]);
    assertNumber("1", [1, ""]);
    assertNumber("10", [10, ""]);
    assertNumber("100", [100, ""]);
    assertNumber("1000", [1000, ""]);
    assertNumber("10000", [10000, ""]);
    assertNumber("123", [123, ""]);
    assertNumber("12345", [12345, ""]);
    assertNumber("2147483648", [2147483648, ""]);
  });

  it("쉼표", function () {
    assertNumber("1,000", [1000, ""]);
    assertNumber("10,000", [10000, ""]);
    assertNumber("12,345", [12345, ""]);
    assertNumber("2,147,483,648", [2147483648, ""]);
  });

  it("단위", function () {
    assertNumber("0개", [0, "개"]);
    assertNumber("1층", [1, "층"]);
    assertNumber("10시", [10, "시"]);
    assertNumber("100불", [100, "불"]);
    assertNumber("1,000 km", [1000, "km"]);
    assertNumber("10,000원", [10000, "원"]);
    assertNumber("123 가지", [123, "가지"]);
    assertNumber("12345대", [12345, "대"]);
  });
});

describe("만 단위만 한글", function () {
  it("단위 없이", function () {
    assertNumber("만", [10000, ""]);
    assertNumber("1만", [10000, ""]);
    assertNumber("1만 2345", [12345, ""]);
    assertNumber("1만2345", [12345, ""]);
    assertNumber("만 2345", [12345, ""]);
    assertNumber("만2345", [12345, ""]);
    assertNumber("21억 4748만 3648", [2147483648, ""]);
    assertNumber("21억 4748만3648", [2147483648, ""]);
    assertNumber("21억4748만 3648", [2147483648, ""]);
    assertNumber("12억 7890", [1200007890, ""]);
    assertNumber("12억 3456만", [1234560000, ""]);
    assertNumber("12억 6만 50", [1200060050, ""]);
    assertNumber("10억 60만 5", [1000600005, ""]);
    assertNumber("12억 3456만 7890", [1234567890, ""]);
    assertNumber("123억 4567만 8901", [12345678901, ""]);
    assertNumber("1234억 5678만 9012", [123456789012, ""]);
    assertNumber("1조 2345억 6789만 123", [1234567890123, ""]);
    assertNumber("123조 4567억 8901만 2345", [123456789012345, ""]);
    assertNumber("9007조 1992억 5474만 991", [9007199254740991, ""]);
    assertNumber("12경 450조 7890억", [120450789000000000, ""]);
    assertNumber("12경 7890억 1234만", [120000789012340000, ""]);
    assertNumber("1억", [1e8, ""]);
    assertNumber("1억 2000만", [1.2e8, ""]);
    assertNumber("1조 2345억", [1.2345e12, ""]);
    assertNumber("1경 2345억", [1.00002345e16, ""]);
    assertNumber("1해 2345조", [1.00002345e20, ""]);
    assertNumber("1자 2345경", [1.00002345e24, ""]);
    assertNumber("1양 2345해", [1.00002345e28, ""]);
    assertNumber("167양 2345해", [167.00002345e28, ""]);
  });

  it("단위", function () {
    assertNumber("1만 2345칸", [12345, "칸"]);
    assertNumber("1만2345 마리", [12345, "마리"]);
    assertNumber("만 2345명", [12345, "명"]);
    assertNumber("만2345대", [12345, "대"]);
    assertNumber("21억 4748만 3648바이트", [2147483648, "바이트"]);
    assertNumber("21억 4748만3648척", [2147483648, "척"]);
    assertNumber("21억4748만 3648톤", [2147483648, "톤"]);
    assertNumber("12억 7890정", [1200007890, "정"]);
    assertNumber("12억 3456만대", [1234560000, "대"]);
    assertNumber("12억 6만 50주", [1200060050, "주"]);
    assertNumber("10억 60만 5원", [1000600005, "원"]);
  });
});

describe("십 단위 한글", function () {
  it("단위 없이", function () {
    assertNumber("만", [10000, ""]);
    assertNumber("1만", [10000, ""]);
    assertNumber("1만 2천3백4십5", [12345, ""]);
    assertNumber("1만2천3백4십5", [12345, ""]);
    assertNumber("만 2천3백4십5", [12345, ""]);
    assertNumber("만2천3백4십5", [12345, ""]);
    assertNumber("2십1억 4천7백4십8만 3천6백4십8", [2147483648, ""]);
    assertNumber("2십1억 4천7백4십8만3천6백4십8", [2147483648, ""]);
    assertNumber("2십1억4천7백4십8만 3천6백4십8", [2147483648, ""]);
    assertNumber("1십2억 7천8백9십", [1200007890, ""]);
    assertNumber("십2억 3천4백5십6만", [1234560000, ""]);
    assertNumber("1십2억 6만 5십", [1200060050, ""]);
    assertNumber("십억 6십만 5", [1000600005, ""]);
    assertNumber("1십2억 3천4백5십6만 7천8백9십", [1234567890, ""]);
    assertNumber("1백2십3억 4천5백6십7만 8천9백1", [12345678901, ""]);
    assertNumber("천2백3십4억 5천6백7십8만 9천십2", [123456789012, ""]);
    assertNumber("1조 2천3백4십5억 6천7백8십9만 1백2십3", [1234567890123, ""]);
    assertNumber("1백2십3조 4천5백6십7억 8천9백1만 2천3백4십5", [
      123456789012345,
      "",
    ]);
    assertNumber("9천7조 1천9백9십2억 5천4백7십4만 9백9십1", [
      9007199254740991,
      "",
    ]);
    assertNumber("1십2경 4백5십조 7천8백9십억", [120450789000000000, ""]);
    assertNumber("십2경 7천8백9십억 1천2백3십4만", [120000789012340000, ""]);
    assertNumber("1억", [1e8, ""]);
    assertNumber("1억 2천만", [1.2e8, ""]);
    assertNumber("1조 2천3백4십5억", [1.2345e12, ""]);
    assertNumber("1경 2천3백4십5억", [1.00002345e16, ""]);
    assertNumber("1해 2천3백4십5조", [1.00002345e20, ""]);
    assertNumber("1자 2천3백4십5경", [1.00002345e24, ""]);
    assertNumber("1양 2천3백4십5해", [1.00002345e28, ""]);
    assertNumber("백6십7양 2천3백4십5해", [167.00002345e28, ""]);
  });

  it("단위", function () {
    assertNumber("2십1억 4천7백4십8만 3천6백4십8바이트", [
      2147483648,
      "바이트",
    ]);
    assertNumber("2십1억 4천7백4십8만3천6백4십8척", [2147483648, "척"]);
    assertNumber("2십1억4천7백4십8만 3천6백4십8톤", [2147483648, "톤"]);
    assertNumber("십2억 7천8백9십정", [1200007890, "정"]);
    assertNumber("1십2억 3천4백5십6만대", [1234560000, "대"]);
    assertNumber("십2억 6만 5십주", [1200060050, "주"]);
    assertNumber("십억 6십만 5원", [1000600005, "원"]);
  });
});

describe("한글", function () {
  it("단위 없이", function () {
    assertNumber("영", [0, ""]);
    assertNumber("일", [1, ""]);
    assertNumber("하나", [1, ""]);
    assertNumber("이", [2, ""]);
    assertNumber("둘", [2, ""]);
    assertNumber("삼", [3, ""]);
    assertNumber("셋", [3, ""]);
    assertNumber("사", [4, ""]);
    assertNumber("넷", [4, ""]);
    assertNumber("오", [5, ""]);
    assertNumber("다섯", [5, ""]);
    assertNumber("육", [6, ""]);
    assertNumber("여섯", [6, ""]);
    assertNumber("칠", [7, ""]);
    assertNumber("일곱", [7, ""]);
    assertNumber("팔", [8, ""]);
    assertNumber("여덟", [8, ""]);
    assertNumber("구", [9, ""]);
    assertNumber("아홉", [9, ""]);
    assertNumber("십", [10, ""]);
    assertNumber("열", [10, ""]);
    assertNumber("열일곱", [17, ""]);
    assertNumber("스물하나", [21, ""]);
    assertNumber("서른둘", [32, ""]);
    assertNumber("마흔여덟", [48, ""]);
    assertNumber("쉰셋", [53, ""]);
    assertNumber("예순넷", [64, ""]);
    assertNumber("일흔다섯", [75, ""]);
    assertNumber("여든아홉", [89, ""]);
    assertNumber("아흔둘", [92, ""]);
    assertNumber("백", [100, ""]);
    assertNumber("백스물셋", [123, ""]);
    assertNumber("일천", [1000, ""]);
    assertNumber("천이백서른넷", [1234, ""]);
    assertNumber("만", [10000, ""]);
    assertNumber("만 이천삼백사십다섯", [12345, ""]);
    assertNumber("십이만사백쉰여섯", [120456, ""]);
    assertNumber("일만", [10000, ""]);
    assertNumber("일만 이천삼백사십오", [12345, ""]);
    assertNumber("일만이천삼백사십오", [12345, ""]);
    assertNumber("만 이천삼백사십오", [12345, ""]);
    assertNumber("만이천삼백사십오", [12345, ""]);
    assertNumber("이십일억 사천칠백사십팔만 삼천육백사십팔", [2147483648, ""]);
    assertNumber("이십일억 사천칠백사십팔만삼천륙백사십팔", [2147483648, ""]);
    assertNumber("이십일억사천칠백사십팔만 삼천육백사십팔", [2147483648, ""]);
    assertNumber("일십이억 칠천팔백구십", [1200007890, ""]);
    assertNumber("십이억 삼천사백오십륙만", [1234560000, ""]);
    assertNumber("일십이억 육만 오십", [1200060050, ""]);
    assertNumber("십억 육십만 오", [1000600005, ""]);
    assertNumber("일십이억 삼천사백오십륙만 칠천팔백구십", [1234567890, ""]);
    assertNumber("일백이십삼억 사천오백륙십칠만 팔천구백일", [12345678901, ""]);
    assertNumber("천이백삼십사억 오천륙백칠십팔만 구천십이", [
      123456789012,
      "",
    ]);
    assertNumber("일조 이천삼백사십오억 육천칠백팔십구만 일백이십삼", [
      1234567890123,
      "",
    ]);
    assertNumber("일백이십삼조 사천오백륙십칠억 팔천구백일만 이천삼백사십오", [
      123456789012345,
      "",
    ]);
    assertNumber("구천칠조 일천구백구십이억 오천사백칠십사만 구백구십일", [
      9007199254740991,
      "",
    ]);
    assertNumber("일십이경 사백오십조 칠천팔백구십억", [
      120450789000000000,
      "",
    ]);
    assertNumber("십이경 칠천팔백구십억 일천이백삼십사만", [
      120000789012340000,
      "",
    ]);
    assertNumber("억", [1e8, ""]);
    assertNumber("일억 이천만", [1.2e8, ""]);
    assertNumber("일조 이천삼백사십오억", [1.2345e12, ""]);
    assertNumber("일경 이천삼백사십오억", [1.00002345e16, ""]);
    assertNumber("일해 이천삼백사십오조", [1.00002345e20, ""]);
    assertNumber("일자 이천삼백사십오경", [1.00002345e24, ""]);
    assertNumber("일양 이천삼백사십오해", [1.00002345e28, ""]);
    assertNumber("백육십칠양 이천삼백사십오해", [167.00002345e28, ""]);
  });

  it("단위", function () {
    assertNumber("일만 이천삼백마흔다섯칸", [12345, "칸"]);
    assertNumber("일만이천삼백마흔다섯 마리", [12345, "마리"]);
    assertNumber("만 이천삼백마흔다섯명", [12345, "명"]);
    assertNumber("만이천삼백마흔다섯대", [12345, "대"]);
    assertNumber("이십일억 사천칠백사십팔만 삼천육백사십팔바이트", [
      2147483648,
      "바이트",
    ]);
    assertNumber("이십일억 사천칠백사십팔만삼천륙백마흔여덟척", [
      2147483648,
      "척",
    ]);
    assertNumber("이십일억사천칠백사십팔만 삼천육백사십팔톤", [
      2147483648,
      "톤",
    ]);
    assertNumber("십이억 칠천팔백구십정", [1200007890, "정"]);
    assertNumber("일십이억 삼천사백오십륙만대", [1234560000, "대"]);
    assertNumber("십이억 육만 오십주", [1200060050, "주"]);
    assertNumber("십억 육십만 오원", [1000600005, "원"]);
  });

  it("관형사", function () {
    assertNumber("열한", [11, ""]);
    assertNumber("만 이천삼백여든한명", [12381, "명"]);
    assertNumber("일만 이천삼백쉰두칸", [12352, "칸"]);
    assertNumber("서 말", [3, "말"]);
    assertNumber("만이천삼백석 섬", [12303, "섬"]);
    assertNumber("스물세시", [23, "시"]);
    assertNumber("일만이천세 곳", [12003, "곳"]);
    assertNumber("너 푼", [4, "푼"]);
    assertNumber("만이천삼백서른넉냥", [12334, "냥"]);
    assertNumber("만이천삼백마흔네대", [12344, "대"]);
    assertNumber("만이천삼백아흔닷돈", [12395, "돈"]);
    assertNumber("일만이천삼백스무 마리", [12320, "마리"]);
  });

  it("혼동", function () {
    assertNumber("10일", [10, "일"]);
    assertNumber("100일", [100, "일"]);
    assertNumber("10이", [10, "이"]);
    assertNumber("500이", [500, "이"]);
    assertNumber("서른이다", [30, "이다"]);
    assertNumber("서른둘이다", [32, "이다"]);
    assertNumber("삼십이다", [32, "다"]);
    assertNumber("삼십이이다", [32, "이다"]);
    assertNumber("30일", [30, "일"]);
    assertNumber("30 일", [30, "일"]);
    assertNumber("삼십 일", [30, "일"]);
    assertNumber("삼십일", [31, ""]);
    assertNumber("31일", [31, "일"]);
    assertNumber("31 일", [31, "일"]);
    assertNumber("삼십일 일", [31, "일"]);
    assertNumber("삼십일일", [31, "일"]);
    assertNumber("삼십일이", [31, "이"]);
    assertNumber("삼십 일이", [30, "일이"]);
    assertNumber("200구", [200, "구"]);
    assertNumber("2백구", [200, "구"]);
    assertNumber("2백 구", [200, "구"]);
    assertNumber("이백구", [209, ""]);
    assertNumber("이백 구", [200, "구"]);
    assertNumber("20000구", [20000, "구"]);
    assertNumber("20000 구", [20000, "구"]);
    assertNumber("2만구", [20000, "구"]);
    assertNumber("2만 구", [20000, "구"]);
    assertNumber("이만구", [20009, ""]);
    assertNumber("이만 구", [20009, ""]);
  });
});

describe("부호", function () {
  it("마이너스", function () {
    assertNumber("-2", [-2, ""]);
    assertNumber("-이", [NaN, "-이"]);
    assertNumber("-20", [-20, ""]);
    assertNumber("-2십", [-20, ""]);
    assertNumber("-이십", [NaN, "-이십"]);
    assertNumber("-1백", [-100, ""]);
    assertNumber("-백", [NaN, "-백"]);
    assertNumber("-2백", [-200, ""]);
    assertNumber("-2천", [-2000, ""]);
    assertNumber("-2억 7천만", [-270000000, ""]);
    assertNumber("-2억7천만", [-270000000, ""]);
    assertNumber("-20이", [-20, "이"]);
    assertNumber("-2백이", [-200, "이"]);
    assertNumber("-이십2", [NaN, "-이십2"]);
    assertNumber("-이십이", [NaN, "-이십이"]);
    assertNumber("-서른", [NaN, "-서른"]);
    assertNumber("마이너스 이십", [-20, ""]);
    assertNumber("마이너스 하나", [NaN, "마이너스 하나"]);
    assertNumber("마이너스 이십삼십", [-23, "십"]);
    assertNumber("마이너스2천", [-2000, ""]);
    assertNumber("마이너스만", [-10000, ""]);
    assertNumber("마이너스 만", [-10000, ""]);
    assertNumber("마이너스일만", [-10000, ""]);
    assertNumber("마이너스 일만", [-10000, ""]);
    assertNumber("마이너스1만", [-10000, ""]);
    assertNumber("마이너스 1만", [-10000, ""]);
    assertNumber("마이너스1만이", [-10000, "이"]);
    assertNumber("마이너스일만이", [-10002, ""]);
    assertNumber("마이너스1", [-1, ""]);
  });

  it("플러스", function () {
    assertNumber("+2", [+2, ""]);
    assertNumber("+이", [NaN, "+이"]);
    assertNumber("+20", [+20, ""]);
    assertNumber("+2십", [+20, ""]);
    assertNumber("+이십", [NaN, "+이십"]);
    assertNumber("+1백", [+100, ""]);
    assertNumber("+백", [NaN, "+백"]);
    assertNumber("+2백", [+200, ""]);
    assertNumber("+2천", [+2000, ""]);
    assertNumber("+2억 7천만", [+270000000, ""]);
    assertNumber("+2억7천만", [+270000000, ""]);
    assertNumber("+20이", [+20, "이"]);
    assertNumber("+2백이", [+200, "이"]);
    assertNumber("+이십2", [NaN, "+이십2"]);
    assertNumber("+이십이", [NaN, "+이십이"]);
    assertNumber("+서른", [NaN, "+서른"]);
    assertNumber("플러스 이십", [+20, ""]);
    assertNumber("플러스 하나", [NaN, "플러스 하나"]);
    assertNumber("플러스 이십삼십", [+23, "십"]);
    assertNumber("플러스2천", [+2000, ""]);
    assertNumber("플러스만", [+10000, ""]);
    assertNumber("플러스 만", [+10000, ""]);
    assertNumber("플러스일만", [+10000, ""]);
    assertNumber("플러스 일만", [+10000, ""]);
    assertNumber("플러스1만", [+10000, ""]);
    assertNumber("플러스 1만", [+10000, ""]);
    assertNumber("플러스1만이", [+10000, "이"]);
    assertNumber("플러스일만이", [+10002, ""]);
    assertNumber("플러스1", [+1, ""]);
  });

  it("소수", function () {
    assertNumber("0.0", [0.0, ""]);
    assertNumber("0.1", [0.1, ""]);
    assertNumber("1.0", [1.0, ""]);
    assertNumber("1.0124", [1.0124, ""]);
    assertNumber("10,455.0124", [10455.0124, ""]);
    assertNumber("10,455.0124.", [10455.0124, "."]);
    assertNumber("1.", [1.0, ""]);
    assertNumber("1..", [1.0, "."]);
    assertNumber(".5", [0.5, ""]);
    assertNumber(".5.", [0.5, "."]);
  });

  it("소수 한글", function () {
    assertNumber("영점 오", [0.5, ""]);
    assertNumber("영점일", [0.1, ""]);
    assertNumber("일 점영", [1.0, ""]);
    assertNumber("이십일점삼도", [21.3, "도"]);
    assertNumber("점칠배", [0.7, "배"]);
    assertNumber("점영", [0.0, ""]);

    assertNumber("3점", [3, "점"]);
    assertNumber("삼.", [3, "."]);
    assertNumber("삼점", [3, "점"]);

    assertNumber("점5", [NaN, "점5"]);
    assertNumber(".오", [NaN, ".오"]);
    assertNumber("점오", [0.5, ""]);

    assertNumber("영점3", [0, "점3"]);
    assertNumber("영.사", [0, ".사"]);
    assertNumber("영.7", [0, ".7"]);
    assertNumber("3점오", [3, "점오"]);
    assertNumber("3점4", [3, "점4"]);
    assertNumber("3.오", [3.0, "오"]);
  });
});
