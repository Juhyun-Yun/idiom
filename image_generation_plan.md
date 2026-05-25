# 🎨 오즈의 마법사 테마 3D 클레이모피즘 이미지 생성 및 교정 계획서

본 계획서는 사용자의 피드백을 완벽히 수렴하여 **그림 내 한글 문구(관용어/속담)를 자연스럽게 포함**하고, **`idiom_18`의 도로시 중복 문제를 해결**하며, **나머지 56개(관용어 20개, 속담 36개)의 일러스트를 이어서 그리기 위한 마스터 플랜**입니다.

> [!NOTE]
> **진행 상황 공지 (2026-05-20 기준 - 최종 완료 업데이트)**
> 1. **사용자 요청 교정본 (총 19종) 100% 완료**: `idiom_18`, `idiom_21~30` (한글 표지판 내장 교정본), `proverb_08~14` 이미지 생성 및 `images/` 폴더 연동 복사 완료!
> 2. **전체 관용어 (50종) 100% 완료**: 모든 관용어 일러스트 생성 및 복사 완료!
> 3. **전체 속담 (50종) 100% 완료**: 모든 속담 일러스트 생성 및 `images/` 폴더 복사 100% 완료! (마지막 잔여 분 `proverb_44~50` 완료)



---

## 🛠️ 사전 완료된 소스 코드 개선 사항

이미지 파일들의 경로 연동과 로컬 프리뷰 환경에서의 버그를 완벽하게 선제 해결했습니다.

1. **`Index.html` 이미지 경로 문제 해결 ([Index.html:L1222-1245](file:///c:/Users/bacus/Desktop/작업/관용어/Index.html#L1222-1245))**
   * 기존에는 `item.imageUrl`이 단순히 `'idiom_01.png'`로 되어 있어, 브라우저가 루트에서 이미지를 찾아 로딩에 실패하고 엑스박스(또는 이모지 대체)로 표시되던 현상을 해결했습니다.
   * `renderImg`와 `renderCutscene` 함수가 상대 경로 이미지 파일명을 감지하면 자동으로 앞에 `images/` 폴더 경로를 붙여주도록 수정했습니다.
2. **`IdiomData.gs` 및 `ProverbData.gs` 전체 50개 이미지 매핑 선행 완료 ([IdiomData.gs](file:///c:/Users/bacus/Desktop/작업/관용어/IdiomData.gs) / [ProverbData.gs](file:///c:/Users/bacus/Desktop/작업/관용어/ProverbData.gs))**
   * 아직 그려지지 않은 후반부 관용어(31~50번)와 속담(15~50번)에 해당하는 이미지 경로 필드가 기존에는 빈 문자열(`''`)이었던 것을 `idiom_31.png`~`idiom_50.png` 및 `proverb_15.png`~`proverb_50.png`로 미리 매핑을 마쳤습니다.
   * 이에 따라 이미지가 물리적으로 저장되는 즉시 스프레드시트 초기화(`resetIdiomsAndProverbs`) 후 앱에 바로 노출됩니다.

---

## 🎯 1부: 이미지 교정 마스터 프롬프트 (총 12종)

기존 이미지 중 한글 문구가 빠져 있거나(`idiom_27~30`, `proverb_08~14`) 인물 묘사 오류가 있던(`idiom_18` 도로시 2명) 삽화들을 수정하기 위한 최적화 프롬프트입니다.
모든 프롬프트는 3D 클레이모피즘 일러스트레이션 중앙/전경에 **나무 표지판, 돌판, 울타리, 마법의 양철판 등을 배치하여 한글 표현이 정갈하고 또렷하게 표시**되도록 설계했습니다.

```carousel
### 18. 손에 땀을 쥐다 (관용어)
**파일명:** `idiom_18.png`
**프롬프트:**
```text
3D claymorphism style, "The Wizard of Oz" theme. Dorothy (only one single cute girl with brown pigtails) looking extremely tense and tightly holding the Tin Woodman's arm as shadowy flying monkeys approach in the background. In the foreground, a prominent, clean rustic wooden sign clearly and legibly displays the Korean text "손에 땀을 쥐다" in clean, neat writing. Soft clay texture, vibrant colors, magical forest background. High quality 3D render.
```
<!-- slide -->
### 27. 손을 떼다 (관용어)
**파일명:** `idiom_27.png`
**프롬프트:**
```text
3D claymorphism style, "The Wizard of Oz" theme. The Wizard of Oz taking his hands off a giant green mechanical control panel and stepping away with a relieved expression. A prominent, clean rustic wooden sign attached to the panel clearly and legibly displays the Korean text "손을 떼다" in neat, clear writing. Soft clay texture, vibrant emerald colors, whimsical background. High quality 3D render.
```
<!-- slide -->
### 28. 입을 모으다 (관용어)
**파일명:** `idiom_28.png`
**프롬프트:**
```text
3D claymorphism style, "The Wizard of Oz" theme. Dorothy, the Scarecrow, the Tin Woodman, and the Cowardly Lion all nodding and speaking together in unison with open mouths. A prominent, clean rustic wooden banner in front of them clearly and legibly displays the Korean text "입을 모으다" in clean, neat writing. Soft clay texture, vibrant colors, whimsical yellow brick road background. High quality 3D render.
```
<!-- slide -->
### 29. 목이 빠지게 기다리다 (관용어)
**파일명:** `idiom_29.png`
**프롬프트:**
```text
3D claymorphism style, "The Wizard of Oz" theme. Dorothy looking longingly at the sky, waiting for the green hot air balloon. In the foreground, a prominent, clean rustic wooden sign on a post clearly and legibly displays the Korean text "목이 빠지게 기다리다" in clean, neat writing. Soft clay texture, sunset colors, magical background. High quality 3D render.
```
<!-- slide -->
### 30. 마음을 먹다 (관용어)
**파일명:** `idiom_30.png`
**프롬프트:**
```text
3D claymorphism style, "The Wizard of Oz" theme. The Cowardly Lion looking very brave, determined, and focused, standing in a heroic pose with a glowing gold aura. A prominent, clean rustic wooden sign at his feet clearly and legibly displays the Korean text "마음을 먹다" in clean, neat writing. Soft clay texture, vibrant colors, magical background. High quality 3D render.
```
<!-- slide -->
### 08. 티끌 모아 태산 (속담)
**파일명:** `proverb_08.png`
**프롬프트:**
```text
3D claymorphism style, "The Wizard of Oz" theme. Small colorful Munchkins stacking tiny bread loaves into a massive, mountain-like pile. In the foreground, a prominent, clean rustic wooden sign clearly and legibly displays the Korean text "티끌 모아 태산" in clean, neat writing. Soft clay texture, vibrant colors, magical village background. High quality 3D render.
```
<!-- slide -->
### 09. 천 리 길도 한 걸음부터 (속담)
**파일명:** `proverb_09.png`
**프롬프트:**
```text
3D claymorphism style, "The Wizard of Oz" theme. Dorothy taking her very first step onto the Yellow Brick Road, looking determined. A prominent, clean rustic wooden sign by the road clearly and legibly displays the Korean text "천 리 길도 한 걸음부터" in clean, neat writing. Soft clay texture, beautiful landscape, vibrant colors. High quality 3D render.
```
<!-- slide -->
### 10. 공든 탑이 무너지랴 (속담)
**파일명:** `proverb_10.png`
**프롬프트:**
```text
3D claymorphism style, "The Wizard of Oz" theme. The Scarecrow carefully building a tall, neat tower of colorful blocks. In the foreground, a prominent, clean rustic wooden sign clearly and legibly displays the Korean text "공든 탑이 무너지랴" in clean, neat writing. Soft clay texture, stable and bright composition, vibrant colors. High quality 3D render.
```
<!-- slide -->
### 11. 첫술에 배부르랴 (속담)
**파일명:** `proverb_11.png`
**프롬프트:**
```text
3D claymorphism style, "The Wizard of Oz" theme. The Cowardly Lion looking patient and focused as he paints a picture on a canvas with a tiny paintbrush. A prominent, clean rustic wooden sign near his easel clearly and legibly displays the Korean text "첫술에 배부르랴" in clean, neat writing. Soft clay texture, educational and cute, vibrant colors. High quality 3D render.
```
<!-- slide -->
### 12. 열 번 찍어 안 넘어가는 나무 없다 (속담)
**파일명:** `proverb_12.png`
**프롬프트:**
```text
3D claymorphism style, "The Wizard of Oz" theme. The Tin Woodman persistently swinging his axe at a large green magical tree in a forest. A prominent, clean rustic wooden sign on the tree trunk clearly and legibly displays the Korean text "열 번 찍어 안 넘어가는 나무 없다" in clean, neat writing. Soft clay texture, vibrant forest background. High quality 3D render.
```
<!-- slide -->
### 13. 우물을 파도 한 우물을 파라 (속담)
**파일명:** `proverb_13.png`
**프롬프트:**
```text
3D claymorphism style, "The Wizard of Oz" theme. The Tin Woodman focused on digging one deep well in the ground with a spade, ignoring other shallow holes. In the foreground, a prominent, clean rustic wooden sign clearly and legibly displays the Korean text "우물을 파도 한 우물을 파라" in clean, neat writing. Soft clay texture, vibrant magical landscape, 3D render.
```
<!-- slide -->
### 14. 하늘은 스스로 돕는 자를 돕는다 (속담)
**파일명:** `proverb_14.png`
**프롬프트:**
```text
3D claymorphism style, "The Wizard of Oz" theme. The Scarecrow trying hard to solve a puzzle on his own while Glinda watches with a helpful light. In the foreground, a prominent, clean rustic wooden sign clearly and legibly displays the Korean text "하늘은 스스로 돕는 자를 돕는다" in clean, neat writing. Soft clay texture, magical 3D scene, vibrant colors.
```
```

---

## 🎨 2부: 잔여 일러스트레이션 마스터 프롬프트 (총 56종)

미완성으로 남아 있던 **관용어 20종(31~50번)** 및 **속담 36종(15~50번)**의 프롬프트 세트입니다. 오즈의 마법사의 다양한 장면과 캐릭터를 활용해 교육적 효과를 극대화했으며, 동일하게 한글 표지판을 자연스럽게 일러스트에 내재시켰습니다.

### 1. 관용어 (31 ~ 50번)

| 번호 | 상태 | 표현 | 뜻 | 프롬프트 요약 (3D 클레이모피즘 + 오즈 테마 + 한글 표지판 내장) |
| :---: | :---: | :--- | :--- | :--- |
| **31** | **완료** | **시치미를 떼다** | 알면서도 모르는 척하다. | Scarecrow whistling innocently with a card hidden behind his back. Wooden sign: `"시치미를 떼다"`. |
| **32** | **완료** | **손꼽아 기다리다** | 손꼽아 날짜를 세다. | Dorothy marking days off on a cute calendar with a pen. Wooden sign: `"손꼽아 기다리다"`. |
| **33** | **완료** | **입에 침이 마르다** | 칭찬을 거듭하다. | Glinda praising Dorothy with magical sparks and hearts floating around. Wooden sign: `"입에 침이 마르다"`. |
| **34** | **완료** | **머리를 굴리다** | 방법을 궁리하다. | Scarecrow thinking hard with glowing lightbulbs and gears above head. Wooden sign: `"머리를 굴리다"`. |
| **35** | **완료** | **입을 다물다** | 말을 하지 않다. | The Cowardly Lion zipping his mouth shut with a funny expression. Wooden sign: `"입을 다물다"`. |
| **36** | **완료** | **등을 돌리다** | 관계를 외면하다. | Flying monkeys turning their backs on the Wicked Witch of the West. Wooden sign: `"등을 돌리다"`. |
| **37** | **완료** | **발길을 돌리다** | 가던 길을 되돌리다. | Dorothy and friends turning back from a dark, stormy path. Wooden sign: `"발길을 돌리다"`. |
| **38** | **완료** | **눈을 붙이다** | 잠깐 잠을 자다. | Dorothy and Toto sleeping peacefully under large, soft red poppy flowers. Wooden sign: `"눈을 붙이다"`. |
| **39** | **완료** | **손을 내밀다** | 도움을 주다. | Dorothy reaching out her hand to pull up the fallen Scarecrow. Wooden sign: `"손을 내밀다"`. |
| **40** | **완료** | **발을 빼다** | 일에서 빠져나오다. | The giant green hot air balloon carrying the Wizard flying away into the blue sky, leaving a shocked Dorothy and Toto behind. Wooden sign: `발을 빼다`. |
| **41** | **완료** | **눈코 뜰 사이 없다** | 정신없이 바쁘다. | Tin Woodman chopping logs rapidly with woodchips flying everywhere. Wooden sign: `"눈코 뜰 사이 없다"`. |
| **42** | **완료** | **진땀을 빼다** | 몹시 애를 쓰다. | The Wizard sweating and nervous as the curtain is pulled open. Wooden sign: `"진땀을 빼다"`. |
| **43** | **완료** | **발등에 불이 떨어지다** | 매우 다급해지다. | Dorothy running fast with small fire sparkles at her heels from a storm. Wooden sign: `"발등에 불이 떨어지다"`. |
| **44** | **완료** | **입이 떡 벌어지다** | 몹시 놀라다. | Dorothy gasping in absolute awe at the glowing Emerald City gates. Wooden sign: `입이 떡 벌어지다`. |
| **45** | **완료** | **눈앞이 캄캄하다** | 어찌할 바를 몰라 막막하다. | Dorothy looking lost in a dark forest with hands on her head. Wooden sign: `"눈앞이 캄캄하다"`. |
| **46** | **완료** | **코앞에 닥치다** | 매우 임박하다. | A massive dark swirling tornado looming extremely close to Dorothy running in panic with Toto. Wooden sign: `코앞에 닥치다`. |
| **47** | **완료** | **손이 모자라다** | 일손이 부족하다. | Dorothy and friends struggling to catch many floating colorful balloons. Wooden sign: `"손이 모자라다"`. |
| **48** | **완료** | **머리를 맞대다** | 함께 모여 의논하다. | Dorothy (with signature brown pigtails) and friends gathering closely studying a map together. Wooden sign: `머리를 맞대다`. |
| **49** | **완료** | **손발이 맞다** | 호흡이 척척 잘 맞다. | Scarecrow and Tin Woodman building a wooden raft together in perfect sync. Wooden sign: `"손발이 맞다"`. |
| **50** | **완료** | **마음이 통하다** | 생각과 뜻이 통하다. | Dorothy and the Cowardly Lion sharing a warm smile of understanding. Wooden sign: `"마음이 통하다"`. |

### 2. 속담 (15 ~ 50번)

| 번호 | 상태 | 표현 | 뜻 | 프롬프트 요약 (3D 클레이모피즘 + 오즈 테마 + 한글 표지판 내장) |
| :---: | :---: | :--- | :--- | :--- |
| **15** | **완료** | **고생 끝에 낙이 온다** | 어려운 일을 겪고 나면 즐거움이 온다. | Dorothy and friends celebrating happily under a beautiful rainbow. Wooden sign: `"고생 끝에 낙이 온다"`. |
| **16** | **완료** | **시작이 반이다** | 첫 걸음을 떼는 것이 가장 중요하다. | Dorothy standing at a starting line on the road with a "START" banner. Wooden sign: `"시작이 반이다"`. |
| **17** | **완료** | **구슬이 서 말이라도 꿰어야 보배** | 아무리 좋아도 꿰어야 진짜 가치가 있다. | Glinda putting shiny green emerald gems onto a beautiful magical thread. Wooden sign: `"구슬이 서 말이라도 꿰어야 보배"`. |
| **18** | **완료** | **콩 심은 데 콩 나고 팥 심은 데 팥 난다** | 뿌린 대로 거두게 된다. | Dorothy planting seeds in soil, sprouts showing matching tiny icons. Wooden sign: `"콩 심은 데 콩 나고 팥 심은 데 팥 난다"`. |
| **19** | **완료** | **바늘 도둑이 소 도둑 된다** | 작은 잘못이 결국 큰 도둑이 된다. | Wicked Witch stealing a tiny silver pin, then a large mechanical cow. Wooden sign: `"바늘 도둑이 소 도둑 된다"`. |
| **20** | **완료** | **우물 안 개구리** | 넓은 세상이 있는 줄 모른다. | Dorothy and Toto looking down curiously into a brick water well next to the yellow brick road, discovering a cute green clay frog inside the well looking up at a tiny sky. Wooden sign: `우물 안 개구리`. |
| **21** | **완료** | **등잔 밑이 어둡다** | 가까운 곳에 있는 것을 오히려 모른다. | Dorothy searching carefully with a glowing lantern in her hand, looking confused, while her magical silver shoes are right on her feet. Wooden sign: `등잔 밑이 어둡다`. |
| **22** | **완료** | **소 잃고 외양간 고친다** | 일이 잘못된 뒤에야 뒤늦게 고친다. | A Munchkin hammering a wooden fence after a cow has already run away. Wooden sign: `"소 잃고 외양간 고친다"`. |
| **23** | **완료** | **원숭이도 나무에서 떨어진다** | 아무리 잘하는 사람도 실수를 한다. | A cute flying monkey slipping off a branch and falling comically. Wooden sign: `"원숭이도 나무에서 떨어진다"`. |
| **24** | **완료** | **윗물이 맑아야 아랫물이 맑다** | 윗사람이 본이 되어야 아랫사람도 잘한다. | Pure, glowing magical water flowing from a high mountain into a clean valley stream. Wooden sign: `"윗물이 맑아야 아랫물이 맑다"`. |
| **25** | **완료** | **빈 수레가 요란하다** | 실속 없는 사람이 더 시끄럽다. | An empty, rustic wooden cart rattling loudly as it rolls down a path. Wooden sign: `"빈 수레가 요란하다"`. |
| **26** | **완료** | **핑계 없는 무덤 없다** | 핑계는 누구나 다 댈 수 있다. | A comical small ghost pointing at a pile of excuses written on parchment. Wooden sign: `"핑계 없는 무덤 없다"`. |
| **27** | **완료** | **세 살 적 버릇 여든까지 간다** | 어릴 적 버릇이 늙어서도 이어진다. | Dorothy hugging her childhood teddy bear even while embarking on her big adventure. Wooden sign: `"세 살 적 버릇 여든까지 간다"`. |
| **28** | **완료** | **굼벵이도 구르는 재주가 있다** | 아무리 모자라도 하나는 잘한다. | A tiny, slow caterpillar spinning a gorgeous glowing golden thread. Wooden sign: `"굼벵이도 구르는 재주가 있다"`. |
| **29** | **완료** | **돌다리도 두들겨 보고 건너라** | 잘 아는 일도 매사 조심하라. | Scarecrow tapping a solid stone block with a walking stick before stepping. Wooden sign: `돌다리도 두들겨 보고 건너라`. |
| **30** | **완료** | **가지 많은 나무에 바람 잘 날 없다** | 자식이 많으면 바람 잘 날이 없다. | A huge tree with many sprawling branches swaying wildly in strong winds. Wooden sign: `"가지 많은 나무에 바람 잘 날 없다"`. |
| **31** | **완료** | **꼬리가 길면 밟힌다** | 나쁜 짓이 거듭되면 결국 잡힌다. | The long shadow of the Wicked Witch being stepped on by Dorothy. Wooden sign: `"꼬리가 길면 밟힌다"`. |
| **32** | **완료** | **열 길 물속은 알아도 한 길 사람 속은 모른다** | 사람 속내는 참 헤아리기 어렵다. | Dorothy staring curiously at the mysterious, giant green glowing head of the Wizard. Wooden sign: `"열 길 물속은 알아도 한 길 사람 속은 모른다"`. |
| **33** | **완료** | **친구 따라 강남 간다** | 친구가 하는 대로 그냥 따라 한다. | Dorothy's friends (Scarecrow, Tin Woodman, Lion) following Dorothy down the Yellow Brick Road in a cute single file line, mimicking her walk. Wooden sign: `친구 따라 강남 간다`. |
| **34** | **완료** | **아니 땐 굴뚝에 연기 날까** | 까닭 없는 일이 생길 리 없다. | A cozy small chimney puffing out gray smoke, indicating a fire is lit below. Wooden sign: `"아니 땐 굴뚝에 연기 날까"`. |
| **35** | **완료** | **백지장도 맞들면 낫다** | 아무리 쉬운 일도 같이 하면 수월하다. | Dorothy and the Scarecrow carrying a single large block together easily. Wooden sign: `"백지장도 맞들면 낫다"`. |
| **36** | **완료** | **사공이 많으면 배가 산으로 간다** | 지휘자가 너무 많으면 산으로 간다. | Three small Munchkins steering a boat in different directions towards a green hill. Wooden sign: `"사공이 많으면 배가 산으로 간다"`. |
| **37** | **완료** | **미운 아이 떡 하나 더 준다** | 미운 사람일수록 더 다정하게 대하라. | Dorothy kindly offering a sweet pastry to a grumpy flying monkey. Wooden sign: `"미운 아이 떡 하나 더 준다"`. |
| **38** | **완료** | **가는 날이 장날** | 우연한 계기로 생각지 못한 일을 겪는다. | Dorothy arriving at a shop only to find a big "CLOSED" sign. Wooden sign: `"가는 날이 장날"`. |
| **39** | **완료** | **호랑이도 제 말 하면 온다** | 남에 대해 이야기하면 마침 그가 온다. | Dorothy talking, and the Cowardly Lion suddenly popping out of the bushes. Wooden sign: `"호랑이도 제 말 하면 온다"`. |
| **40** | **완료** | **까마귀 날자 배 떨어진다** | 공교로운 우연으로 오해를 산다. | A crow flying away from an apple tree just as a big red apple falls to the ground. Wooden sign: `"까마귀 날자 배 떨어진다"`. |
| **41** | **완료** | **누워서 떡 먹기** | 매우 쉬운 일이다. | Scarecrow picking a sweet fruit effortlessly from a very low-hanging branch. Wooden sign: `"누워서 떡 먹기"`. |
| **42** | **완료** | **식은 죽 먹기** | 아주 수월한 일을 뜻한다. | Scarecrow sitting happily on a wooden stool by the yellow brick road, easily eating a steaming bowl of traditional porridge with a big wooden spoon. Wooden sign: `식은 죽 먹기`. |
| **43** | **완료** | **호박이 넝쿨째로 굴러 들어온다** | 뜻밖에 행운이 한꺼번에 굴러 들어왔다. | A giant lucky golden pumpkin happily rolling down a hill directly to the feet of a delighted Dorothy, surrounded by green vines and flowers. Wooden sign: `호박이 넝쿨째로 굴러 들어온다`. |
| **44** | **완료** | **꿩 먹고 알 먹기** | 일석이조의 효과를 얻는다. | Dorothy holding a wooden chest full of shiny gold coins and a beautiful magical flower she found together. Toto wagging his tail. Premium 3D claymorphism, warm pastel colors. Wooden sign: `"꿩 먹고 알 먹기"`. |
| **45** | **완료** | **그림의 떡** | 바라만 보고 직접 얻을 수는 없다. | Hungry 3D claymorphism Scarecrow looking wistfully through a bakery window at a delicious, steaming cake on display that he cannot reach. Warm pastel colors. Wooden sign: `"그림의 떡"`. |
| **46** | **완료** | **작은 고추가 더 맵다** | 몸은 작지만 야무지고 똑소리 난다. | The small, brave 3D claymorphism black dog Toto barking fiercely at a giant, scary mechanical machine of the Wizard, showing immense bravery. Warm pastel colors. Wooden sign: `"작은 고추가 더 맵다"`. |
| **47** | **완료** | **열 손가락 깨물어 안 아픈 손가락 없다** | 모든 것 하나하나가 소중하다. | Dorothy, Scarecrow, Tin Woodman, and Lion hugging each other warmly in a big group hug, demonstrating that every friend is equally loved. Warm pastel colors. Wooden sign: `"열 손가락 깨물어 안 아픈 손가락 없다"`. |
| **48** | **완료** | **될성부른 나무는 떡잎부터 알아본다** | 잘될 싹은 떡잎 시절부터 알아본다. | A tiny, glowing green sprout with a shiny golden cotyledon leaf growing out of dark soil. Dorothy kneeling next to it, smiling. Warm pastel colors. Wooden sign: `"될성부른 나무는 떡잎부터 알아본다"`. |
| **49** | **완료** | **사촌이 땅을 사면 배가 아프다** | 남이 잘되면 샘이 난다. | Comical, jealous 3D claymorphism green-faced Wicked Witch holding her stomach in envy as she watches a happy Munchkin farmer on his beautiful new field. Warm pastel colors. Wooden sign: `"사촌이 땅을 사면 배가 아프다"`. |
| **50** | **완료** | **보기 좋은 떡이 먹기도 좋다** | 겉모양새가 고와야 가치가 커진다. | Beautifully decorated, colorful traditional Korean rainbow rice cake on a plate in a magical garden. Dorothy and Scarecrow looking at it with wide, excited eyes. Warm pastel colors. Wooden sign: `"보기 좋은 떡이 먹기도 좋다"`. |

---

## 🚀 다음 단계 실행 지침 (AI 및 사용자용)

이미지 생성 AI 모델의 할당량(Quota) 제한이 풀리면, 다음 명령어를 실행하여 계획에 있는 삽화들을 생성하고 프로젝트로 즉시 이동할 수 있습니다.

### Step 1: 할당량 복구 확인 및 이미지 생성
다음 AI 대화 턴에서 아래와 같이 `generate_image`를 한 번에 5~10장씩 순차 호출하여 교정 삽화와 신규 삽화를 생성합니다.
* *예시: `generate_image(ImageName="idiom_18", Prompt="...")`*

### Step 2: 생성된 이미지 프로젝트 images/ 폴더로 복사 (PowerShell 명령어)
생성된 이미지는 아래의 PowerShell 스크립트를 사용하여 일괄 또는 개별적으로 프로젝트의 `images/` 폴더로 복사합니다.

```powershell
# 예시: idiom_18 교정본 복사
Copy-Item "C:\Users\bacus\.gemini\antigravity\brain\1e92f5dc-f34b-41c8-9433-8237cc938119\idiom_18_*.png" "c:\Users\bacus\Desktop\작업\관용어\images\idiom_18.png" -Force

# 예시: proverb_15 복사
Copy-Item "C:\Users\bacus\.gemini\antigravity\brain\1e92f5dc-f34b-41c8-9433-8237cc938119\proverb_15_*.png" "c:\Users\bacus\Desktop\작업\관용어\images\proverb_15.png" -Force
```

### Step 3: 스프레드시트 데이터 리셋
모든 복사가 끝난 후, Google Apps Script 편집기에서 `Setup.gs` 파일 내 **`resetIdiomsAndProverbs`** 함수를 실행하면 새롭게 연동된 전체 이미지 리스트가 즉시 데이터베이스(스프레드시트)에 동기화 완료됩니다!
