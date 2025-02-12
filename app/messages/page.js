import Messages from "@/components/messages";

export default async function MessagesPage() {
  const response = await fetch("http://localhost:8080/messages", {
    cache: "force-cache",
    // 🔹 cache 속성: fetch 요청의 캐싱 방식 결정
    // - "force-cache" (Next 14 기본값): 서버 빌드 시 데이터를 캐싱하고, 동일한 요청이면 캐시된 데이터를 반환 (SSR에서도 캐싱 적용)
    // - "no-store" (Next 15 기본값): 항상 새로운 데이터를 요청하여 최신 상태 유지 (캐싱 없음)
    // - "only-if-cached": 캐시된 응답이 있을 경우에만 반환하고, 없으면 요청을 보내지 않음 (Service Worker 등에서 사용 가능)
    // - "reload": 브라우저 캐시를 무시하고 네트워크 요청을 강제로 보냄

    next: {
      revalidate: 5,
    },
    // 🔹 revalidate 속성: ISR(Incremental Static Regeneration) 재검증 주기 설정
    // - 0: 즉시 캐시를 무효화하고 항상 새로운 데이터를 요청 (no-store와 동일)
    // - 5: 5초 동안 캐시 유지 후 새로운 요청 시 다시 데이터를 가져옴 (ISR 활성화)
    // - false: 캐시된 데이터를 영구적으로 사용 (빌드 시점 데이터 유지)
  });
  const messages = await response.json();

  if (!messages || messages.length === 0) {
    return <p>No messages found</p>;
  }

  return <Messages messages={messages} />;
}
