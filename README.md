# HI-TEL
90년대 PC통신 하이텔 감성의 SNS 서비스<br/>
**[서비스 링크](https://d3h1har9mmknid.cloudfront.net)**<br/>
<br/>

### 데스크탑 버전
<img src="https://github.com/Woohyeok97/Hi-Tel/assets/75671909/9199fdf4-a300-4ccd-b583-c6b983593795" width="80%"/>

### 모바일 버전
<img src="https://github.com/Woohyeok97/Hi-Tel/assets/75671909/13e48871-8033-4000-8748-2b7889f4a6c1" width="40%"/>

<br/>
<br/>

## 🔎 사용기술
💡 90년대 PC통신 컨셉을 위해 오픈소스 '둥근모꼴' 폰트(https://cactus.tistory.com/193) 사용

- React
- Typescript
- React Query
- Recoil
- Emotion
- Firebase
- AWS S3
- CloudFront

<br/>
<br/>

## 🔎 서비스 구조
- 빠른 페이지 전환과 사용자 상호작용을 목표로 한 CSR 방식
- Firebase SDK를 사용한 서버리스 아키텍처
- AWS S3에서 호스팅하여, 정적 파일(Build) 관리 
- 캐싱과 빠른 서비스를 위한 CloudFront 배포

<br/>
<img src="https://github.com/Woohyeok97/Hi-Tel/assets/75671909/61da26d9-3f52-45d3-a9fc-2313ab56d0a4" width="80%"/>

<br/>
<br/>


## 🔎 주요 구현기능

### 프로필 페이지
- 이름 / 게시글 / 팔로잉 / 팔로워 목록 등 여러 데이터를 조회할 수 있는 페이지를 구현
- 병렬처리를 적용하여 API 요청들의 워터폴 현상 및 요청 시간 최소화
- 각 API 요청의 비동기를 개별적인 Suspense 랩핑으로 처리하여 초기 렌더링 시간을 단축

### 게시글 검색
- 검색어 입력으로 해당하는 게시글 목록을 필터링할 수 있는 기능을 구현
- 불러온 게시글 목록을 React Query로 캐싱하여 API 콜수 및 렌더링 시간 단축
- Recoil을 사용한 queryKey 관리로 페이지 재방문 시, 가장 최근에 검색한 게시글 목록을 렌더링

### 다국어 지원
- 언어 설정에 따라서 메뉴명을 한글 / 영어로 전환 가능
- 사용자의 언어 설정을 Recoil로 상태관리
- 또한, 해당 상태를 브라우저 LocalStorage에 저장하여 언어 설정 유지 가능

### PC통신 터미널 명령어
- 메뉴 버튼을 명령어 입력으로 사용할 수 있는 90년대 PC통신 터미널 명령어 기능을 구현
- 각 명령어에 대한 실행함수를 commandActions라는 객체의 메소드로 캡슐화
- 명령어 입력 시, 해당하는 명령어 함수를 실행 or 터미널 메시지 출력

### 회원가입 / 로그인
- Firebase Authentication을 사용하여 구현
- AuthProvider를 사용하여 소셜 로그인 구현
- 각 폼 데이터에 대한 유효성 검사

### 데이터 CRUD
- Firestore, React Query를 사용하여 구현
- Zod 스키마를 이용한 런타임 타입체크
- useMutation으로 이벤트 성공 / 에러 처리 관리


<br/>

## 🔎 프리뷰

### 검색 페이지

<img src="https://github.com/Woohyeok97/Hi-Tel/assets/75671909/a64122b3-ad5b-480f-8dc9-1ea893b31634" width="80%"/><br/>

<!-- 검색 캐싱
https://github.com/Woohyeok97/Hi-Tel/assets/75671909/bd8af9db-16f7-4656-b84c-b5cfd8c092e6 -->

<br/>

### 프로필 페이지

<img src="https://github.com/Woohyeok97/Hi-Tel/assets/75671909/86bd159c-290d-488b-9fa8-37d7ddefb926" width="80%"/><br/>

<br/>

### 터미널 명령어

<img src="https://github.com/Woohyeok97/Hi-Tel/assets/75671909/e7003200-0860-44f6-840b-44bdf4a36eec" width="80%"/><br/>

<br/>

### 알림 페이지

<img src="https://github.com/Woohyeok97/Hi-Tel/assets/75671909/0acdd586-69d7-4b3b-817a-5ad26a8ae847" width="80%"/><br/>

<br/>

### 언어설정

<img src="https://github.com/Woohyeok97/Hi-Tel/assets/75671909/a55892eb-2b1b-42c7-81c8-4b33f9c5ad89" width="80%"/><br/>

<br/>

### 게시글 작성

<img src="https://github.com/Woohyeok97/Hi-Tel/assets/75671909/62dd5099-16f2-48c4-a392-754398c73b48" width="40%"/><br/>

<br/>
<br/>
<br/>
