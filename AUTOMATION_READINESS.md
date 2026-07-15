# AUTOMATION_READINESS

| 루프 | 자동화 수준 | Codex 역할 | Claude Verifier | 위험도 | 권한 | Rollback | 준비 상태 | 보완점 |
|---|---|---|---|---|---|---|---|---|
| 1. Responsive scaffold | AUTO | HTML/CSS/JS 골격과 내부 링크만 최소 생성 | 파일 존재, 내부 링크, viewport, 375/768/1440, 로컬 HTTP | Low | local write only | Git revert 가능한 단일 커밋 | Ready | 실제 콘텐츠 미확정 부분은 `[사람 확인 필요]` 유지 |
| 2. Content fill | HITL | 프로필 문구와 CTA를 reference에 맞춰 채움 | 내용 정합성, 누락, 사실 불명확 표시 확인 | Medium | local write + human content approval | 되돌리기 쉬운 섹션 단위 커밋 | Partial | 인적 검토가 없으면 과장/오류 위험 |
| 3. Stage-gated game | HITL | Flappy Bird-like game과 stage unlock 로직 구현 | 게임 입력, 충돌, 클리어 후 섹션 오픈, 재현성 | High | local write + human game-rule approval | 기능 플래그 또는 게임 파일 revert | Partial | 스테이지별 오픈 순서와 섹션 매핑 확정 필요 |
| 4. Mobile touch polish | AUTO | 터치 제스처, 반응형 보정, 접근성 라벨 최소 수정 | 모바일 입력, 오동작, 레이아웃 회귀 확인 | Medium | local write only | 스타일/입력 파일 revert | Ready | 실제 기기 확인은 있으면 더 좋음 |
| 5. Deployment prep | HITL | 정적 파일 정리, Pages 경로, 배포 대상 파일 선별 | GitHub Pages 호환성, 배포 전 회귀 확인 | High | git push approval required | 이전 커밋으로 되돌림 | Partial | 원격 상태/브랜치 충돌 확인 필요 |
| 6. Production deploy | MANUAL | 푸시 후 배포 결과 확인만 수행 | 배포 URL 200, asset load, fallback page checks | High | deploy approval required | redeploy previous commit | Ready after approval | 배포 승인과 모니터링 필요 |

## 지금 자동화하기 가장 좋은 루프 1개
- 루프 1, `Responsive scaffold`

## 사람이 반드시 승인해야 하는 지점
- 프로필의 불확실한 사실 확정
- stage별 섹션 오픈 규칙과 클리어 조건 확정
- GitHub Pages 배포/푸시 승인

## Claude Verifier가 확인해야 할 항목
- 파일 존재와 상대 경로
- HTML 내부 링크와 섹션 앵커
- CSS 반응형: `375px`, `768px`, `1440px`
- JavaScript 에러와 게임 입력
- 로컬 HTTP 응답
- GitHub Pages 호환성

## Claude 사용 불가 시 Fallback 방식
- `CODEX_FALLBACK`
- Codex가 변경과 검증을 모두 수행
- 실패 기록은 `AORR_LOG.md`에 남기고, 테스트 약화는 금지

## 운영 전 필요한 테스트·권한·모니터링
- 테스트: 로컬 HTTP, 링크, 반응형, JS 오류, 게임 입력, Pages 경로
- 권한: repo write, branch push, GitHub Pages publish
- 모니터링: 배포 URL 200 확인, 주요 asset 404 확인, 모바일 렌더링 스모크 체크

## 현업 적용 다음 액션 3개
1. stage 1에 열릴 섹션과 잠금 해제 규칙을 확정한다.
2. 게임 승패/점수/재시도 규칙을 문서화한다.
3. 배포 전 검증 명령과 rollback 절차를 고정한다.

