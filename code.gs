/**
 * Code.gs
 * 웹앱 백엔드 — 학생 명단·학습 기록 전용 JSON API.
 *
 * 구조:
 *   - GitHub Pages 가 UI(Index.html)와 정적 자료(관용어/속담/이미지)를 서빙
 *   - Apps Script 는 이 파일의 doGet/doPost 로 JSON API 만 제공
 *   - 스프레드시트는 학생 명단·학습기록 저장소로만 사용
 *
 * 엔드포인트:
 *   GET  ?fn=students                       → 학생 명단
 *   GET  ?fn=studentProgress&name=<이름>    → 한 학생의 학습 진척도
 *   POST { fn: 'logQuiz', record: {...} }   → 학습 결과 한 건 기록
 *
 * 호환:
 *   - fn 파라미터가 없으면 기존 방식대로 Index.html 을 그대로 돌려준다
 *     (옛 Apps Script 배포본 북마크가 깨지지 않도록).
 */

function doGet(e) {
  const fn = (e && e.parameter && e.parameter.fn) || '';

  if (fn === 'students') {
    return _json({ ok: true, data: getStudents() });
  }
  if (fn === 'studentProgress') {
    const name = (e.parameter && e.parameter.name) || '';
    return _json({ ok: true, data: getStudentProgress(name) });
  }
  if (fn === 'imageMap') {
    // 드라이브에 올린 이미지 → 공개 URL 매핑. ImageSetup.gs 의 linkImageDriveFolder 가 한 번 돌아갔어야 함.
    let imageMap = {};
    try {
      if (typeof getImageMap_ === 'function') imageMap = getImageMap_() || {};
    } catch (err) {
      Logger.log('imageMap fetch failed: ' + err);
    }
    return _json({ ok: true, data: imageMap });
  }

  // fn 이 없으면 옛 HTML 앱 방식으로 동작 (호환용)
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('관용어·속담 학습')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  let body = {};
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return _json({ ok: false, error: 'invalid JSON body' });
  }

  const fn = body.fn || '';
  if (fn === 'logQuiz') {
    const ok = logQuizResult(body.record || {});
    return _json({ ok: !!ok });
  }
  return _json({ ok: false, error: 'unknown fn: ' + fn });
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty(PROP_SPREADSHEET_ID);
  if (!id) {
    throw new Error('스프레드시트가 설정되지 않았습니다. Setup.gs의 setupSpreadsheet 함수를 먼저 실행하세요.');
  }
  return SpreadsheetApp.openById(id);
}

function getStudents() {
  const sheet = getSpreadsheet_().getSheetByName(SHEET_STUDENTS);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const maxCols = Math.max(sheet.getLastColumn(), 2);
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, maxCols).getValues();
  
  return values.map(row => {
    const colA = String(row[0] || '').trim();
    const colB = String(row[1] || '').trim();
    
    let number = '';
    let name = '';
    
    // 만약 B열(이름)이 채워져 있다면 기존 방식(A열:번호, B열:이름)으로 처리
    if (colB) {
      number = colA;
      name = colB;
    } 
    // B열이 비어있고 A열만 채워져 있다면, 사용자가 '번호' 열을 지우고 A열에 '이름'만 적었다고 간주
    else if (colA) {
      name = colA;
    }
    return { number: number, name: name };
  }).filter(s => s.name !== ''); // 이름이 있는 학생만 반환
}

function getIdioms() {
  return readEntries_(SHEET_IDIOMS);
}

function getProverbs() {
  return readEntries_(SHEET_PROVERBS);
}

function readEntries_(sheetName) {
  // 시트의 컬럼 순서: [ID(0), 주제(1), 표현(2), 뜻(3), 실제1~3(4~6), 동화1~3(7~9), 이미지(10)]
  const sheet = getSpreadsheet_().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 11).getValues();
  return values
    .filter(row => row[2])
    .map(row => {
      const realExamples = [row[4], row[5], row[6]]
        .map(v => String(v || '').trim())
        .filter(Boolean);
      const folkExamples = [row[7], row[8], row[9]]
        .map(v => String(v || '').trim())
        .filter(Boolean);
      return {
        id:            row[0],
        topic:         String(row[1] || '').trim(),
        term:          String(row[2]).trim(),
        meaning:       String(row[3]).trim(),
        example:       realExamples[0] || '', // 기존 호환용: 첫 번째 실제 예문
        realExamples:  realExamples,
        folkExamples:  folkExamples,
        imageUrl:      String(row[10] || '').trim()
      };
    });
}

// 이 함수가 있어야 프론트엔드의 google.script.run.getInitialData() 가 작동합니다!
function getInitialData() {
  // ImageSetup.gs 가 없거나 getImageMap_ 가 정의되지 않은 환경에서도
  // 학생/관용어/속담은 정상 로딩되도록 안전하게 감싼다.
  let imageMap = {};
  try {
    if (typeof getImageMap_ === 'function') imageMap = getImageMap_() || {};
  } catch (e) {
    Logger.log('getImageMap_ failed: ' + e);
  }
  return {
    students: getStudents(),
    idioms:   getIdioms(),
    proverbs: getProverbs(),
    imageMap: imageMap
  };
}

function logQuizResult(record) {
  if (!record || !record.studentName) return false;
  const sheet = getSpreadsheet_().getSheetByName(SHEET_PROGRESS);
  if (!sheet) return false;
  sheet.appendRow([
    new Date(),
    String(record.studentName),
    String(record.kind || ''),
    record.id || '',
    String(record.term || ''),
    record.correct ? 'O' : 'X'
  ]);
  updateStudentSummary_(record.studentName);
  return true;
}

/**
 * 한 학생의 학습 요약(최종 학습일, 학습 시간, 학습한 개수, 성취도)을 학생명단 시트 C~G열에 기록한다.
 * 학습 시간은 학습기록 항목 사이의 시간 간격이 5분 이내인 것들을 한 세션으로 묶어 합산한다.
 */
function updateStudentSummary_(studentName) {
  try {
    const ss = getSpreadsheet_();
    const progressSheet = ss.getSheetByName(SHEET_PROGRESS);
    const studentSheet  = ss.getSheetByName(SHEET_STUDENTS);
    if (!progressSheet || !studentSheet || studentSheet.getLastRow() < 2) return;

    // 학생 행 찾기 (B열 우선, 없으면 A열에서 이름으로 간주)
    const nameKey = String(studentName).trim();
    const studentValues = studentSheet.getRange(2, 1, studentSheet.getLastRow() - 1, 2).getValues();
    let targetRow = -1;
    for (let i = 0; i < studentValues.length; i++) {
      const colA = String(studentValues[i][0] || '').trim();
      const colB = String(studentValues[i][1] || '').trim();
      const name = colB || colA;
      if (name === nameKey) { targetRow = i + 2; break; }
    }
    if (targetRow === -1) return;

    if (progressSheet.getLastRow() < 2) {
      studentSheet.getRange(targetRow, 3, 1, 5).setValues([['', 0, 0, 0, '0%']]);
      return;
    }
    const all  = progressSheet.getRange(2, 1, progressSheet.getLastRow() - 1, 6).getValues();
    const mine = all.filter(function (r) { return String(r[1]).trim() === nameKey; });
    if (mine.length === 0) {
      studentSheet.getRange(targetRow, 3, 1, 5).setValues([['', 0, 0, 0, '0%']]);
      return;
    }

    // 최종 학습일
    const lastTs = Math.max.apply(null, mine.map(function (r) { return new Date(r[0]).getTime(); }));
    const lastDateStr = Utilities.formatDate(new Date(lastTs), Session.getScriptTimeZone(), 'yyyy-MM-dd');

    // 학습 시간(분): 5분 이내 연속 항목을 한 세션으로 묶어 합산. 단일 항목 세션은 1분으로 본다.
    const times = mine.map(function (r) { return new Date(r[0]).getTime(); }).sort(function (a, b) { return a - b; });
    const SESSION_GAP = 5 * 60 * 1000;
    let totalMin = 0, sessionStart = times[0], sessionLast = times[0];
    for (let i = 1; i < times.length; i++) {
      if (times[i] - sessionLast > SESSION_GAP) {
        totalMin += Math.max(1, Math.round((sessionLast - sessionStart) / 60000) + 1);
        sessionStart = times[i];
      }
      sessionLast = times[i];
    }
    totalMin += Math.max(1, Math.round((sessionLast - sessionStart) / 60000) + 1);

    // 학습한 관용어/속담 수 (중복 ID 제외)
    const idiomIds = {}, proverbIds = {};
    mine.forEach(function (r) {
      const kind = String(r[2] || '').trim();
      const id   = r[3];
      if (kind === 'idiom')   idiomIds[id]   = true;
      else if (kind === 'proverb') proverbIds[id] = true;
    });

    // 성취도 (정답률)
    const correct = mine.filter(function (r) { return r[5] === 'O' || r[5] === true; }).length;
    const rate = Math.round(correct / mine.length * 100);

    studentSheet.getRange(targetRow, 3, 1, 5).setValues([[
      lastDateStr,
      totalMin,
      Object.keys(idiomIds).length,
      Object.keys(proverbIds).length,
      rate + '%'
    ]]);
  } catch (e) {
    Logger.log('updateStudentSummary_ error: ' + e);
  }
}

/**
 * 학생명단의 모든 학생에 대해 요약을 다시 계산한다.
 * 학생을 새로 추가했거나, 학습기록을 손으로 정리했을 때 한 번 실행하면 된다.
 */
function refreshAllStudentSummary() {
  const ss = getSpreadsheet_();
  const studentSheet = ss.getSheetByName(SHEET_STUDENTS);
  if (!studentSheet || studentSheet.getLastRow() < 2) return;
  const values = studentSheet.getRange(2, 1, studentSheet.getLastRow() - 1, 2).getValues();
  let count = 0;
  values.forEach(function (row) {
    const colA = String(row[0] || '').trim();
    const colB = String(row[1] || '').trim();
    const name = colB || colA;
    if (name) { updateStudentSummary_(name); count++; }
  });
  Logger.log('학생 ' + count + '명의 학습 요약을 갱신했습니다.');
}

function getStudentProgress(studentName) {
  if (!studentName) return { total: 0, correct: 0, recent: [] };
  const sheet = getSpreadsheet_().getSheetByName(SHEET_PROGRESS);
  if (!sheet || sheet.getLastRow() < 2) return { total: 0, correct: 0, recent: [] };

  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
  const mine = values.filter(row => String(row[1]).trim() === String(studentName).trim());
  const correct = mine.filter(row => row[5] === 'O' || row[5] === true).length;
  const recent = mine.slice(-10).reverse().map(row => ({
    when:    Utilities.formatDate(new Date(row[0]), Session.getScriptTimeZone(), 'MM-dd HH:mm'),
    kind:    row[2],
    term:    row[4],
    correct: row[5] === 'O' || row[5] === true
  }));
  return { total: mine.length, correct: correct, recent: recent };
}
