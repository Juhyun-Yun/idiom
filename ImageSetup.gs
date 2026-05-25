/**
 * ImageSetup.gs
 * 로컬 images/ 폴더에 있던 그림 파일들을 구글 드라이브에 올린 뒤,
 * 그 폴더 ID를 이 스크립트에 알려 주면
 *   ① 폴더 안의 모든 파일을 "링크가 있는 모든 사용자: 보기" 로 공개하고
 *   ② {파일이름 → 공개 URL} 표를 만들어 ScriptProperties 에 저장한다.
 * 저장된 표는 Code.gs 의 getInitialData() 가 클라이언트로 함께 보내고,
 * Index.html 의 renderImg/renderCutscene 가 파일이름을 받아 URL 로 바꿔 사용한다.
 *
 * ── 사용법 ────────────────────────────────────────────
 *   1) 구글 드라이브에 폴더를 하나 만들고, 로컬 images/ 폴더 안의
 *      png 파일 전부(idiom_01.png ~ proverb_50.png, 그리고 intro_*.png,
 *      friend_*.png, chapter_*.png, ending_*.png) 를 그대로 업로드한다.
 *   2) 그 드라이브 폴더의 URL 에서 폴더 ID 를 복사한다.
 *      예) https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz
 *          → 1AbCdEfGhIjKlMnOpQrStUvWxYz  가 ID.
 *   3) Apps Script 편집기에서 아래 IMAGE_FOLDER_ID 상수에 ID 를 넣고
 *      linkImageDriveFolder 함수를 한 번 실행한다.
 *   4) 실행 후 로그에 "OK : 112개 이미지 URL 저장 완료" 처럼 찍히면 끝.
 *      웹앱을 새로고침하면 그림이 보인다.
 *
 *  ※ 처음 실행할 때 Drive 권한 동의창이 한 번 뜨고, appsscript.json 에
 *    drive 권한이 이미 추가되어 있다.
 */

const IMAGE_FOLDER_ID = '1WqYXJtmhBIYK0TE3xv8_wjBixpRkfiVb';
const PROP_IMAGE_MAP  = 'IMAGE_URL_MAP';

function linkImageDriveFolder() {
  if (!IMAGE_FOLDER_ID || IMAGE_FOLDER_ID.indexOf('붙여넣기') !== -1) {
    throw new Error(
      'ImageSetup.gs 의 IMAGE_FOLDER_ID 상수에 구글 드라이브 이미지 폴더 ID 를 넣고 다시 실행하세요.'
    );
  }
  const folder = DriveApp.getFolderById(IMAGE_FOLDER_ID);
  const files = folder.getFiles();

  const map = {};
  let count = 0, skipped = 0;
  while (files.hasNext()) {
    const f = files.next();
    const name = f.getName();
    if (!/\.(png|jpg|jpeg|gif|webp)$/i.test(name)) { skipped++; continue; }

    try {
      f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (e) {
      Logger.log('공유 설정 실패(' + name + '): ' + e);
    }
    map[name] = 'https://lh3.googleusercontent.com/d/' + f.getId();
    count++;
  }

  PropertiesService.getScriptProperties().setProperty(PROP_IMAGE_MAP, JSON.stringify(map));
  Logger.log('OK : ' + count + '개 이미지 URL 저장 완료 (' + (skipped ? skipped + '개 건너뜀' : '') + ')');
  return { count: count, sample: Object.keys(map).slice(0, 5) };
}

/**
 * 저장된 URL 표를 그대로 돌려준다. (Code.gs 에서 사용)
 */
function getImageMap_() {
  const raw = PropertiesService.getScriptProperties().getProperty(PROP_IMAGE_MAP);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch (e) { return {}; }
}

/**
 * 저장된 표가 잘 만들어졌는지 확인용. 실행하면 로그에 처음 다섯 개 항목이 찍힌다.
 */
function debugShowImageMap() {
  const map = getImageMap_();
  const keys = Object.keys(map);
  Logger.log('총 ' + keys.length + '개 항목');
  keys.slice(0, 10).forEach(k => Logger.log(k + '  →  ' + map[k]));
}

/**
 * 저장된 표를 지운다. 폴더를 다시 만들거나 ID 가 바뀌었을 때 한 번 실행.
 */
function clearImageMap() {
  PropertiesService.getScriptProperties().deleteProperty(PROP_IMAGE_MAP);
  Logger.log('이미지 URL 표를 비웠습니다. linkImageDriveFolder 를 다시 실행하세요.');
}
