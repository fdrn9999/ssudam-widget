<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-orange?style=flat-square" alt="version" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="license" />
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue?style=flat-square" alt="platform" />
  <img src="https://img.shields.io/badge/Tauri-v2-24C8D8?style=flat-square&logo=tauri&logoColor=white" alt="Tauri v2" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 19" />
</p>

<h1 align="center">🚬 담타 위젯</h1>
<p align="center"><b>당신의 바탕화면 위 작은 흡연실</b></p>
<p align="center">
  담배가 천천히 타들어가는 인터랙티브 시뮬레이션으로<br/>
  뽀모도로 타이머를 시각화하는 데스크톱 위젯
</p>

<!-- 스크린샷 placeholder -->
<!--
<p align="center">
  <img src="docs/screenshot.png" alt="담타 위젯 스크린샷" width="600" />
</p>
-->

---

## 컨셉

바탕화면 한쪽 구석에 항상 떠 있는 작은 담배 위젯입니다. 스티키메모처럼 드래그로 위치를 옮길 수 있고, 담배가 천천히 타들어가는 것이 곧 타이머의 시각적 표현이 됩니다. 순수 로컬 앱으로, 네트워크 연결 없이 동작합니다.

## 주요 기능

### 🚬 리얼 담배 시뮬레이션
5개 파트(재 · 불씨 · 종이 · 필터 · 연기)로 구성된 실감나는 담배 비주얼.

| 파트 | 설명 |
|------|------|
| **재 (Ash)** | 타면서 종이 자리에 쌓이는 균열 질감의 재. 재떨기 전까지 점점 길어짐 |
| **불씨 (Ember)** | glow + 맥박 애니메이션, 일시정지 시 어두워짐 |
| **종이 (Paper)** | 타이머 진행에 따라 줄어듦 (재가 그만큼 대체) |
| **필터 (Filter)** | 홀드: 깊게 흡입 (연기 + 3배속) / 더블클릭: 재떨기 |
| **연기 (Smoke)** | 다이내믹 파티클 (곡선 드리프트, 크기 변화, 물결 효과) |

**진짜 담배 물리학**: 전체 길이 = 재 + 종이 + 필터. 재를 털면 담배가 짧아집니다.

### ⏱ 뽀모도로 타이머
담배 1개비 = 타이머 1세션. 종이가 줄고 재가 쌓이는 것으로 남은 시간을 직관적으로 파악.

| 모드 | 동작 |
|------|------|
| **뽀모도로** | 25분 작업 → 5분 휴식 → 4세션 후 15분 긴 휴식 |
| **프리** | 5~120분 자유 설정 |
| **무한** | 타이머 없이 분위기용 (1시간 주기 자동 순환) |

### 💨 깊게 흡입 (필터 홀드)
필터를 길게 누르면:
- 연기가 대량으로 뿜어져 나옴
- 타이머가 **3배속**으로 빠르게 소진
- 타이머 숫자가 주황색으로 빛나며 "깊게 흡입 중..." 표시

### 💥 재떨기
필터 더블클릭 → 20~30개 재 파편이 중력감 있는 포물선으로 흩날림. 재가 많이 쌓였을수록 더 화려한 이펙트.

### 📝 담배갑 메모
담배 옆에 슬라이드로 등장하는 메모장. 담배갑 뚜껑 안쪽에 적는 느낌의 UI.
- 최대 5개 탭 (담배 개비 모양 인디케이터)
- 1초 뒤 자동 저장
- 줄 있는 노트 배경

### ⚙️ 설정 (담배갑 스타일)
위젯의 ⚙️ 버튼 또는 트레이 메뉴에서 접근. 탭 방식의 담배팩 테마 설정 창.

- **타이머**: 모드 선택, 작업/휴식/긴 휴식 시간 조절
- **외관**: 담배 스킨 (레귤러/멘솔/슬림), 연기 양, 투명도 (10단위 틱 슬라이더 + 숫자 입력), 불씨 강도
- **시스템**: 알림 on/off, 시작 시 자동 실행, 항상 위에 표시

### 📊 통계 대시보드
| 항목 | 내용 |
|------|------|
| 🚬 오늘 피운 담배 | 완료 세션 수 |
| ⏱ 총 집중 시간 | 시간/분 단위 |
| 🔥 연속 세션 | 최대 연속 완료 횟수 |
| 📅 주간 그래프 | 최근 7일 막대 차트 |

### 🖥 시스템 트레이
작업표시줄에 숨겨진 채 트레이 아이콘(담배 모양)으로 제어:
```
▶ 타이머 시작/일시정지
🔄 새 담배
📝 메모 열기/닫기
💨 재떨기
⚙️ 설정
📊 오늘의 통계
ℹ️ 정보
➖ 숨기기
✕ 종료
─────────────
담타 위젯 v1.0.0
```

### 🛡 데스크톱 앱 기능
- **단일 인스턴스** — 중복 실행 방지
- **시작 시 자동 실행** — 컴퓨터 켜면 자동 시작 (설정에서 토글)
- **MSI 덮어쓰기 업데이트** — 새 MSI 설치 시 기존 버전 자동 교체

---

## 설치 방법

### Windows

1. [Releases](https://github.com/fdrn9999/damta-widget/releases)에서 `담타위젯_1.0.0_x64_ko-KR.msi` 다운로드
2. MSI 파일 실행 → 설치 마법사 따라 진행 (한국어 UI)
3. 시작 메뉴 또는 바탕화면 바로가기로 실행
4. **업데이트**: 새 MSI를 다운받아 다시 설치하면 기존 버전이 자동 교체됩니다
5. **제거**: 제어판 > 프로그램 추가/제거

### macOS

1. [Releases](https://github.com/fdrn9999/damta-widget/releases)에서 DMG 파일 다운로드
   - Apple Silicon: `담타위젯_1.0.0_aarch64.dmg`
   - Intel: `담타위젯_1.0.0_x64.dmg`
2. DMG 열기 → Applications 폴더로 드래그 앤 드롭
3. 최소 지원: macOS 10.15 Catalina

---

## 직접 빌드하기

### 필수 조건

| 도구 | 최소 버전 |
|------|-----------|
| [Node.js](https://nodejs.org/) | 18+ |
| [Rust](https://www.rust-lang.org/tools/install) | 1.70+ |
| Windows | MSVC Build Tools |
| macOS | Xcode Command Line Tools |

### 빌드 명령어

```bash
# 1. 의존성 설치
npm install

# 2. 개발 모드 (핫 리로드)
npm run tauri dev

# 3. 프로덕션 빌드 (MSI / DMG 생성)
npm run tauri build
```

빌드 결과물:
- **Windows**: `src-tauri/target/release/bundle/msi/담타 위젯_1.0.0_x64_ko-KR.msi`
- **macOS**: `src-tauri/target/release/bundle/dmg/담타위젯_1.0.0_*.dmg`

---

## 단축키

| 단축키 | macOS | 기능 |
|--------|-------|------|
| `Ctrl+Shift+D` | `Cmd+Shift+D` | 위젯 보이기/숨기기 |
| `Ctrl+Shift+S` | `Cmd+Shift+S` | 타이머 시작/일시정지 |
| `Ctrl+Shift+N` | `Cmd+Shift+N` | 새 담배 (리셋) |
| `Ctrl+Shift+A` | `Cmd+Shift+A` | 재떨기 |
| `Ctrl+Shift+M` | `Cmd+Shift+M` | 메모 패널 토글 |

모든 단축키는 글로벌(다른 앱 사용 중에도 동작)입니다.

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | [Tauri v2](https://v2.tauri.app/) — Rust 백엔드, 크로스플랫폼 |
| 프론트엔드 | React 19 + TypeScript |
| 스타일링 | Tailwind CSS v4 |
| 빌드 도구 | Vite 6 |
| 로컬 저장 | `@tauri-apps/plugin-store` (JSON) |
| 시스템 트레이 | Tauri Tray API |
| 글로벌 단축키 | `tauri-plugin-global-shortcut` |
| 자동 시작 | `tauri-plugin-autostart` |
| 단일 인스턴스 | `tauri-plugin-single-instance` |
| 알림 | `tauri-plugin-notification` |
| CI/CD | GitHub Actions |

---

## 프로젝트 구조

```
damta-widget/
├── .github/workflows/build.yml    # CI/CD (Windows MSI + macOS DMG)
├── src-tauri/
│   ├── src/
│   │   ├── main.rs                # 엔트리포인트
│   │   └── lib.rs                 # 트레이, 글로벌 단축키, 윈도우 관리
│   ├── tauri.conf.json            # 앱 설정
│   └── icons/                     # 담배 모양 앱 아이콘
├── src/
│   ├── components/
│   │   ├── Cigarette/             # 담배 5파트 컴포넌트
│   │   │   ├── Cigarette.tsx      # 전체 조합 (재+불씨+종이+필터)
│   │   │   ├── Ash.tsx            # 재 (균열 질감)
│   │   │   ├── Ember.tsx          # 불씨 (glow)
│   │   │   ├── Paper.tsx          # 종이 (연소)
│   │   │   ├── Filter.tsx         # 필터 (홀드+더블클릭)
│   │   │   └── SmokeParticles.tsx # 연기 파티클
│   │   ├── AshEffect.tsx          # 재떨기 파편 물리
│   │   ├── MemoPanel.tsx          # 담배갑 메모
│   │   └── TimerDisplay.tsx       # 타이머 (홀드 시 이펙트)
│   ├── windows/
│   │   ├── MainWidget.tsx         # 메인 위젯
│   │   ├── Settings.tsx           # 담배팩 스타일 설정 창
│   │   ├── Stats.tsx              # 통계 창
│   │   └── About.tsx              # 정보 창
│   ├── hooks/                     # 타이머, 담배 물리, 연기 시스템
│   ├── stores/                    # 로컬 저장소
│   └── styles/                    # CSS 애니메이션
├── LICENSE
└── README.md
```

---

## Credits

본 프로젝트는 [온라인 담타](https://www.damta.world/)의 인터랙티브 가상 흡연 시뮬레이션 UX에서 영감을 받아, 이를 데스크톱 뽀모도로 타이머 위젯으로 재해석한 작품입니다. 원작 온라인 담타 팀에 경의를 표합니다.

> **온라인 담타** — [damta.world](https://www.damta.world/) — 다같이 담배 타임

---

## License

[MIT License](LICENSE) — Copyright (c) 2025 Jinho Jeong

---

## 제작자

**정진호 (Jinho Jeong)** — [github.com/fdrn9999](https://github.com/fdrn9999) · [ckato9173@gmail.com](mailto:ckato9173@gmail.com)

**박찬진 (Chanjin Park)** — [github.com/chanjin346](https://github.com/chanjin346)
