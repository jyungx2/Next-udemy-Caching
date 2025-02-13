import sql from "better-sqlite3";
import { cache } from "react";
import { unstable_cache as nextCache, unstable_cache } from "next/cache";

const db = new sql("messages.db");

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY, 
      text TEXT
    )`);
}

initDb();

export function addMessage(message) {
  db.prepare("INSERT INTO messages (text) VALUES (?)").run(message);
}

// 1. cache 함수 적용 후, 터미널에 'Fetching messages from db'이 두개 -> 하나만 뜸(첫번째 요청을 재사용하여 page, layout 파일에서 불러오는 데이터 요청 중복 제거 -> 데이터베이스 호출 최소화)
// 2. nextCache 함수(Promise 리턴) 적용 후, 더 이상 새로고침 또는 페이지 이동 시마다 터미널에 해당 컨솔이 출력되지 않음 -> 최초 호출 시에만 로그가 출력되고, 그 이후에는 캐시된 데이터를 반환하기 때문 (캐시된 데이터가 계속 재사용으로 DB 호출 불필요 -> 성능 최적화)
// 3. ["message"]
//  캐시 키로 'message'를 지정하여, 이 키에 해당하는 데이터를 캐시하도록 함
//  해당 키를 통해 캐시된 데이터를 식별하고 재사용할 수 있도록 돕는 역할을 함
export const getMessages = nextCache(
  cache(function getMessages() {
    console.log("Fetching messages from db");
    return db.prepare("SELECT * FROM messages").all();
  }),
  ["message"], // *cache key: 데이터를 식별하기 위한 고유한 키
  {
    // revalidate: 5, // 5초 후에 캐시된 데이터를 갱신하도록 설정
    tags: ["msg"], // *tags: 캐시된 데이터를 그룹화하고, 특정 데이터를 무효화하거나 갱신
  }
);

// 1. **캐시 (cache)**: 데이터를 빠르게 반환하기 위해 사용하는 방법.
//    첫 번째 요청 시에 데이터를 가져오고, 이후 동일한 키로 요청이 들어오면 캐시된 데이터를 반환.
//    즉, `cache`는 데이터베이스에서 요청한 데이터를 메모리에 저장하여 이후에 같은 데이터 요청 시 빠르게 응답할 수 있도록 합니다.
//    이 코드에서는 `cache` 함수를 사용하여 `getMessages` 함수의 결과를 캐시합니다.

// 2. **태그 (tags)**: 캐시된 데이터를 그룹화하고, 특정 그룹을 무효화하거나 갱신할 때 사용.
//    예를 들어, 특정 데이터셋이 업데이트되었을 때, 해당 태그를 사용하는 모든 캐시를 무효화하거나 갱신할 수 있습니다.
//    이 코드에서는 `tags`를 사용하여 `msg`라는 태그를 지정하고, 이후에 `msg`와 관련된 데이터를 모두 관리할 수 있습니다.
