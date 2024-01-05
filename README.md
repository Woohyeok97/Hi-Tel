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

<img src="https://github.com/Woohyeok97/Hi-Tel/assets/75671909/965e448e-2c92-480c-b41d-71ab8f1d0854" width="80%"/>

<br/>

💡 90년대 PC통신 컨셉을 위해 오픈소스 '둥근모꼴' 폰트(https://cactus.tistory.com/193) 사용

<br/>



## 🔎 서비스 구조
- 빠른 페이지 전환과 사용자 상호작용을 목표로한 CSR 방식
- Firebase SDK를 사용한 서버리스 아키텍처
- AWS S3에서 호스팅하여, 정적 파일(Build) 관리 
- 캐싱과 빠른 서비스를 위한 CloudFront 배포

<img src="https://github.com/Woohyeok97/Hi-Tel/assets/75671909/4bdea670-0382-4a2e-8a82-d661339d952f" width="80%"/>

<br/>
<br/>


## 🔎 주요 구현기능

### 프로필
- 프로필 페이지에 접속하여 해당 사용자의 프로필, 게시글, 팔로워, 팔로잉 등 확인가능
- React Suspense를 통한 선언적 로딩 처리
- 비동기 병렬처리를 활용한 API 요청 딜레이 / 로딩 시간 단축

### 게시글 검색
- 입력한 해시태그에 해당하는 게시글을 필터링 하여 구현
- React Query 쿼리 키를 Recoil로 관리하여 캐싱 기능 활용

### 다국어 지원
- 언어 설정에 따라서 메뉴명을 한글 / 영어 로 전환가능
- 사용자의 언어 설정을 Recoil로 상태관리
- 또한, 해당 상태를 브라우저 LocalStorage에 저장하여 언어 설정 유지 가능

### PC통신 터미널 명령어
- 90년대 PC통신 시절의 터미널 명령어 기능을 재현
- 사용자의 클릭 이벤트 뿐만 아니라, 키보드 이벤트로도 서비스 기능을 사용할 수 있음
- 해당하는 명령어 입력시, 경우에 따라 기능실행 or 터미널 메시지 출력

### 회원가입 / 로그인
- Firebase Authentication을 사용하여 구현
- AuthProvider를 사용하여 소셜 로그인 구현
- 각 폼데이터에 대한 유효성 검사

### 데이터 CRUD
- Firestore, React Query를 사용하여 구현
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
