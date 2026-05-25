/**
 * Setup.gs
 * 처음 한 번만 실행하면 스프레드시트에 필요한 시트와 시드 데이터를 자동으로 만든다.
 *
 * 사용법:
 *   1) Apps Script 편집기에서 setupSpreadsheet 함수를 실행
 *   2) 권한 승인
 *   3) 실행 로그에서 생성된 스프레드시트 URL 확인
 *   4) (선택) 학생 명단 시트에 학생 이름 입력
 *
 * 시드 데이터는 IdiomData.gs / ProverbData.gs 에 분리되어 있다.
 */

const SHEET_STUDENTS = '학생명단';
const SHEET_IDIOMS   = '관용어';
const SHEET_PROVERBS = '속담';
const SHEET_PROGRESS = '학습기록';

const PROP_SPREADSHEET_ID = 'SPREADSHEET_ID';

/**
 * 자동 연결이 안 될 때 쓰는 수동 연결 함수.
 * 이 함수 안의 ID_HERE 값을 본인 스프레드시트 ID로 바꿔 한 번만 실행한다.
 *
 * 스프레드시트 ID 찾는 법:
 *   스프레드시트 URL이 https://docs.google.com/spreadsheets/d/1ABCxyz.../edit
 *   라면 /d/ 와 /edit 사이의 1ABCxyz... 부분이 ID.
 */
function bindToExistingSpreadsheet() {
  const ID_HERE = '여기에_스프레드시트_ID_붙여넣기';

  if (!ID_HERE || ID_HERE === '여기에_스프레드시트_ID_붙여넣기') {
    throw new Error('Setup.gs의 bindToExistingSpreadsheet 함수를 열어 ID_HERE 변수에 본인 스프레드시트 ID를 붙여넣고 다시 실행하세요.');
  }
  const ss = SpreadsheetApp.openById(ID_HERE); // 유효한지 확인
  PropertiesService.getScriptProperties().setProperty(PROP_SPREADSHEET_ID, ID_HERE);
  Logger.log('연결 완료: ' + ss.getUrl());
  Logger.log('이제 resetIdiomsAndProverbs 를 실행하세요.');
  return ss.getUrl();
}

/**
 * 관용어/속담 시트를 완전히 삭제하고 새 10컬럼 구조로 다시 만든다.
 * 데이터 구조가 5컬럼 → 10컬럼으로 바뀐 뒤 한 번 실행하면 된다.
 *
 * 주의:
 *   - 학생명단/학습기록 시트는 건드리지 않는다.
 *   - 관용어·속담 시트에 사용자가 직접 추가/수정한 내용이 있다면 사라진다.
 *
 * 사용법: Apps Script 편집기에서 resetIdiomsAndProverbs 함수를 한 번 실행.
 */
function resetIdiomsAndProverbs() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty(PROP_SPREADSHEET_ID);
  let ss;
  if (id) {
    ss = SpreadsheetApp.openById(id);
  } else {
    // 컨테이너 바인딩(스프레드시트의 확장 프로그램 → Apps Script로 연 경우) 자동 연결 시도
    ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      throw new Error(
        '스프레드시트를 찾을 수 없습니다.\n' +
        '① 원래 웹앱이 들어 있던 스프레드시트를 브라우저에서 열고,\n' +
        '② 그 스프레드시트에서 "확장 프로그램 → Apps Script" 로 편집기를 열어 다시 실행하세요.\n' +
        '그래도 안 되면 bindToExistingSpreadsheet 함수에 스프레드시트 ID를 넣어 한 번 실행한 뒤 다시 시도하세요.'
      );
    }
    props.setProperty(PROP_SPREADSHEET_ID, ss.getId());
    Logger.log('스프레드시트를 자동 연결했습니다: ' + ss.getUrl());
  }

  // 다른 시트가 남아 있어야 안전하게 삭제할 수 있으므로 임시 시트를 미리 보장
  let buffer = ss.getSheetByName('__reset_buffer__');
  if (!buffer) buffer = ss.insertSheet('__reset_buffer__');

  const idiomSheet = ss.getSheetByName(SHEET_IDIOMS);
  if (idiomSheet) ss.deleteSheet(idiomSheet);
  const proverbSheet = ss.getSheetByName(SHEET_PROVERBS);
  if (proverbSheet) ss.deleteSheet(proverbSheet);

  ensureIdiomsSheet_(ss);
  ensureProverbsSheet_(ss);

  // 임시 시트 정리
  buffer = ss.getSheetByName('__reset_buffer__');
  if (buffer) ss.deleteSheet(buffer);

  Logger.log('완료! 관용어 50개, 속담 50개를 새 6컬럼 예문 구조로 다시 만들었습니다.');
  Logger.log('URL: ' + ss.getUrl());
  return ss.getUrl();
}

function setupSpreadsheet() {
  const props = PropertiesService.getScriptProperties();
  let ss;
  const existingId = props.getProperty(PROP_SPREADSHEET_ID);

  if (existingId) {
    try {
      ss = SpreadsheetApp.openById(existingId);
      Logger.log('기존 스프레드시트를 사용합니다: ' + ss.getUrl());
    } catch (e) {
      ss = SpreadsheetApp.create('관용어속담학습_데이터');
      props.setProperty(PROP_SPREADSHEET_ID, ss.getId());
    }
  } else {
    ss = SpreadsheetApp.create('관용어속담학습_데이터');
    props.setProperty(PROP_SPREADSHEET_ID, ss.getId());
    Logger.log('새 스프레드시트를 만들었습니다: ' + ss.getUrl());
  }

  ensureStudentsSheet_(ss);
  ensureIdiomsSheet_(ss);
  ensureProverbsSheet_(ss);
  ensureProgressSheet_(ss);

  const defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('시트1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }

  // 학생명단의 C~G(요약) 값을 한 번 채워 둔다
  try { refreshAllStudentSummary(); } catch (e) { Logger.log('초기 요약 갱신 실패: ' + e); }

  Logger.log('완료! 스프레드시트 URL: ' + ss.getUrl());
  return ss.getUrl();
}

const STUDENT_HEADERS = ['번호', '이름', '최종 학습일', '학습 시간(분)', '학습한 관용어 수', '학습한 속담 수', '성취도'];

function ensureStudentsSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_STUDENTS);
  const isNew = !sheet;
  if (!sheet) sheet = ss.insertSheet(SHEET_STUDENTS);

  // 헤더 7개 컬럼이 다 들어가 있는지 확인하고 부족하면 채운다 (기존 시트도 안전하게 마이그레이션)
  const lastCol = sheet.getLastColumn();
  let needHeaderUpdate = isNew || sheet.getLastRow() === 0 || lastCol < STUDENT_HEADERS.length;
  if (!needHeaderUpdate) {
    const existing = sheet.getRange(1, 1, 1, STUDENT_HEADERS.length).getValues()[0];
    for (let i = 0; i < STUDENT_HEADERS.length; i++) {
      if (String(existing[i]).trim() !== STUDENT_HEADERS[i]) { needHeaderUpdate = true; break; }
    }
  }
  if (needHeaderUpdate) {
    sheet.getRange(1, 1, 1, STUDENT_HEADERS.length).setValues([STUDENT_HEADERS]);
    sheet.getRange(1, 1, 1, STUDENT_HEADERS.length).setFontWeight('bold').setBackground('#fff3b0');
    sheet.setFrozenRows(1);
  }

  // 첫 생성일 때만 샘플 학생을 추가
  if (sheet.getLastRow() <= 1) {
    const sample = [
      [1, '김민준'],
      [2, '이서연'],
      [3, '박지호'],
      [4, '최수아'],
      [5, '정도윤']
    ];
    sheet.getRange(2, 1, sample.length, 2).setValues(sample);
  }

  sheet.setColumnWidth(1, 60);   // 번호
  sheet.setColumnWidth(2, 100);  // 이름
  sheet.setColumnWidth(3, 110);  // 최종 학습일
  sheet.setColumnWidth(4, 100);  // 학습 시간(분)
  sheet.setColumnWidth(5, 130);  // 학습한 관용어 수
  sheet.setColumnWidth(6, 130);  // 학습한 속담 수
  sheet.setColumnWidth(7, 90);   // 성취도
}

function ensureProgressSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_PROGRESS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_PROGRESS);
  }
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 6).setValues([['일시', '학생이름', '종류', 'ID', '표현', '정답여부']]);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#d6f0ff');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 100);
    sheet.setColumnWidth(3, 80);
    sheet.setColumnWidth(4, 60);
    sheet.setColumnWidth(5, 240);
    sheet.setColumnWidth(6, 80);
  }
}

const ENTRY_COLS = 11; // ID, 주제, 표현, 뜻, 실제1~3, 동화1~3, 이미지

/**
 * 시트 컬럼 순서:
 *   [ID, 주제, 표현, 뜻, 실제1, 실제2, 실제3, 동화1, 동화2, 동화3, 이미지]
 *
 * 두 가지 시드 구조를 자동 감지해 위 시트 순서로 맞춰 준다.
 *   ① 새 시드(현재): [ID, 주제, 표현, 뜻, 실제1~3, 동화1~3, 이미지]
 *   ② 옛 시드:       [ID, 표현, 뜻, 실제1~3, 동화1~3, 주제, 이미지]
 *
 * row[1] 값이 알려진 주제어 목록에 있으면 ①, 아니면 ②로 판단한다.
 */
const KNOWN_TOPICS_ = ['성격','감정','행동','상태','관계','말','노력','사람','교훈','상황'];

function reorderSeedRow_(row) {
  if (KNOWN_TOPICS_.indexOf(String(row[1]).trim()) !== -1) {
    // 새 시드: 그대로
    return row.slice(0, ENTRY_COLS);
  }
  // 옛 시드: 주제(인덱스 9)를 ID 바로 뒤로 옮긴다
  return [
    row[0],                 // ID
    row[9],                 // 주제 (이동)
    row[1],                 // 표현
    row[2],                 // 뜻
    row[3], row[4], row[5], // 실제예문 1~3
    row[6], row[7], row[8], // 동화예문 1~3
    row[10]                 // 이미지
  ];
}

function ensureIdiomsSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_IDIOMS);
  const isNew = !sheet;
  if (!sheet) sheet = ss.insertSheet(SHEET_IDIOMS);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, ENTRY_COLS).setValues([[
      'ID', '주제', '관용어', '뜻',
      '실제예문1', '실제예문2', '실제예문3',
      '동화예문1', '동화예문2', '동화예문3',
      '이미지'
    ]]);
    sheet.getRange(1, 1, 1, ENTRY_COLS).setFontWeight('bold').setBackground('#ffd6d6');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 50);   // ID
    sheet.setColumnWidth(2, 80);   // 주제
    sheet.setColumnWidth(3, 180);  // 관용어
    sheet.setColumnWidth(4, 280);  // 뜻
    sheet.setColumnWidths(5, 6, 280); // 실제 + 동화 예문 (5~10열)
    sheet.setColumnWidth(11, 200); // 이미지
  }

  if (isNew || sheet.getLastRow() <= 1) {
    const reordered = IDIOM_SEED.map(reorderSeedRow_);
    sheet.getRange(2, 1, reordered.length, ENTRY_COLS).setValues(reordered);
  }
}

function ensureProverbsSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_PROVERBS);
  const isNew = !sheet;
  if (!sheet) sheet = ss.insertSheet(SHEET_PROVERBS);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, ENTRY_COLS).setValues([[
      'ID', '주제', '속담', '뜻',
      '실제예문1', '실제예문2', '실제예문3',
      '동화예문1', '동화예문2', '동화예문3',
      '이미지'
    ]]);
    sheet.getRange(1, 1, 1, ENTRY_COLS).setFontWeight('bold').setBackground('#d6ffd9');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 50);   // ID
    sheet.setColumnWidth(2, 80);   // 주제
    sheet.setColumnWidth(3, 240);  // 속담
    sheet.setColumnWidth(4, 280);  // 뜻
    sheet.setColumnWidths(5, 6, 280); // 실제 + 동화 예문 (5~10열)
    sheet.setColumnWidth(11, 200); // 이미지
  }

  if (isNew || sheet.getLastRow() <= 1) {
    const reordered = PROVERB_SEED.map(reorderSeedRow_);
    sheet.getRange(2, 1, reordered.length, ENTRY_COLS).setValues(reordered);
  }
}
