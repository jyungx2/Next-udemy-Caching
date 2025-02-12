export default async function MessagesLayout({ children }) {
  const response = await fetch("http://localhost:8080/messages", {
    // ✅ Next.js의 요청 중복 방지(request memoization) 메커니즘
    // Next.js는 같은 요청이라면 중복을 방지하고 하나의 요청만 보내도록 최적화(= request memoization)되어 있음.
    // 하지만 요청 헤더(headers)가 다르면, Next.js는 이를 서로 다른 요청으로 인식하여 중복 요청이 발생함!

    // 현재는 동일한 데이터를 가져오는 페이지(page.js)와 레이아웃(layout.js)에서 각각 요청을 보냄
    // → 총 두 번의 요청 발생 & 백엔드 로그에 두 개의 요청이 기록됨
    headers: {
      "X-ID": "layout",
    },
  });
  const messages = await response.json();
  const totalMessages = messages.length;

  return (
    <>
      <h1>Important Messages</h1>
      <p>{totalMessages} messages found</p>
      <hr />
      {children}
    </>
  );
}
