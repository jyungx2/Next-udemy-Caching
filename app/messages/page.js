// import { unstable_noStore } from "next/cache";
import Messages from "@/components/messages";
import { getMessages } from "@/lib/messages";

// 1️⃣ revalidate 상수를 export하여 파일 내 모든 컴포넌트의 데이터 캐싱 주기를 설정
// ✅ 이 파일 내의 모든 fetch 요청에 대해 5초마다 데이터를 재검증(revalidate)
// export const revalidate = 5;

// 2️⃣ dynamic 상수를 export하여 파일 내 모든 컴포넌트의 캐싱 동작을 설정
// ✅ force-dynamic으로 설정하면 매 요청마다 새로운 데이터를 패치 = cache: "no-store"로 설정하는 것과 동일한 효과
// export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  // 3️⃣ unstable_noStore() 함수를 사용하여 특정 컴포넌트에서만 캐싱을 비활성화
  // ✅ 파일 전체가 아닌 이 MessagesPage 컴포넌트에서만 캐싱이 비활성화되는 효과
  // unstable_noStore();

  // const response = await fetch("http://localhost:8080/messages", {
  //   next: { tags: ["msg"] },
  // });
  // const messages = await response.json();
  const messages = getMessages();

  if (!messages || messages.length === 0) {
    return <p>No messages found</p>;
  }

  return <Messages messages={messages} />;
}
