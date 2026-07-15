# CHANGE_REQUEST

## Notes
- Reference content is taken only from the provided resume page and the current repository.
- Conflict/ambiguity: the current site already contains a `Research` section, while the user examples mention only profile, projects, and contact. Keep the intermediate `Research` unlock unless a later request removes it.
- Conflicting runtime note: the current Flappy Bird flow should preserve the staged unlock pattern, but restart/button reliability must be fixed first.

| ID | 원문 | 분류 | 현재/기대 동작 | 대상 파일 | 의존성 | 완료 기준 | Claude 검증 | 회귀 테스트 | 위험도 | HITL |
|---|---|---|---|---|---|---|---|---|---|---|
| CR-1 | 게임을 클리어해도 Unlock이 안되는거 같아 | GAME, JAVASCRIPT, STRUCTURE | 현재: stage clear 후 섹션 unlock/저장 흐름이 사용자 관찰상 신뢰되지 않음. 기대: stage 1 clear 시 About/Profile, stage 3 clear 시 Projects, final clear 시 Contact가 확실히 열린다. | `script.js`, `index.html`, `styles.css` | 없음 | 클리어 후 해당 섹션이 즉시 열리고 새로고침 후에도 상태가 유지된다. | 변경 전: 스테이지 클리어 재현, unlock 상태 확인. 변경 후: stage 1/3/final unlock 및 localStorage 유지 확인. | 375/768/1440, 내부 링크, local HTTP, 게임 재시작 후 unlock 유지 | High | [사람 확인 필요] if stage mapping is later changed |
| CR-2 | 게임 restart 나 이런 버튼이 동작이 잘 안돼 | GAME, ACCESSIBILITY, RESPONSIVE | 현재: Start/Pause/Restart 및 Up/Down 버튼이 불안정할 수 있음. 기대: 키보드/모바일 버튼이 모두 안정적으로 작동하고 restart가 새 라운드를 확실히 시작한다. | `script.js`, `styles.css`, `index.html` | CR-1 | Start/Pause/Restart/Up/Down 버튼이 데스크톱·모바일에서 반복 동작해도 정상 상태 전환이 된다. | 변경 전: 버튼 클릭/터치로 문제 재현. 변경 후: 버튼 상태 전환, restart, pause/resume 확인. | 375/768/1440, 키보드(Up/Down/Space/P/R), pointer/touch, local HTTP | High | No |
| CR-3 | [사람확인필요] 이부분도 너가알아서 잘 채워줘 ... 한국어로 작성해줘 | CONTENT | 현재: 일부 placeholder/불명확 텍스트가 남아 있음. 기대: resume 기준의 한국어 프로필로 채우고, 불확실한 내용만 `[사람 확인 필요]`로 남긴다. | `index.html` | CR-1 | About/Experience/Projects/Research/Contact의 핵심 소개가 한국어로 채워진다. | 변경 전: placeholder 위치 목록 확인. 변경 후: 한국어 내용 및 불확실 항목 표시 확인. | 텍스트 정합성, 내부 링크, 섹션별 내용 누락 여부 | Medium | [사람 확인 필요] for any unsupported claim |
| CR-4 | 디자인도 너무 어둡고 제목 헤드부분도 좀 어색해보여 | UI_UX, RESPONSIVE, ACCESSIBILITY | 현재: 다크 톤이 강하고 헤더/히어로 비주얼이 어색함. 기대: AI 전문가 느낌의 밝고 정돈된 헤더, 더 자연스러운 타이포/간격/톤. | `styles.css`, `index.html` | CR-3 | 375/768/1440에서 헤더와 히어로가 균형 있게 보인다. | 변경 전: 현재 비주얼 점검. 변경 후: 톤, 제목, 간격, 가독성 회귀 확인. | 375/768/1440, 모바일 nav, hero/header visual review | Medium | No |

