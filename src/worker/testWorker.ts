import { fetchFollowerByUid, fetchFollowingByUid, fetchLikePostsByUid, fetchPostsByUid } from "remotes/postAPI";

/* eslint-disable no-restricted-globals */
self.onmessage = async (event) => {
  const { uid } = event.data;
  console.log('웹워커가 받음!', event.data);
  const results = await Promise.all([
    fetchPostsByUid(uid),
    // fetchLikePostsByUid(uid),
    fetchFollowerByUid(uid),
    fetchFollowingByUid(uid),
  ]);
  
  self.postMessage(results);
};

export {};

// // Typescript 컴파일 에러를 방지하기 위한 코드
// export default class SimpleWorker extends Worker {
// 	constructor() {}
// }

// self.onmessage = async (event) => {
//   // Main Thread 한테 받은 메시지
//   console.log('웹워커가 메인스레드한테 받은 메시지!',event.data);
  
//   self.postMessage('Worker Thread에서 보낸 메시지');
// };

// export {};

// // // Typescript 컴파일 에러를 방지하기 위한 코드
// // export default class SimpleWorker extends Worker {
// // 	constructor() {}
// // }