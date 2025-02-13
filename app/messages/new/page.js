import { redirect } from "next/navigation";

import { addMessage } from "@/lib/messages";
import { revalidatePath, revalidateTag } from "next/cache";

export default function NewMessagePage() {
  async function createMessage(formData) {
    ("use server");

    const message = formData.get("message");
    addMessage(message);

    // 189. On-Demand Cache Invalidation with revalidatePath & revalidateTag
    // ✨ messages 폴더의 page.js 파일에서 설정하는 방식(revalidate/dynamic/unstable_noStore)과 달리,
    // 컴포넌트 내부에서 revalidate 관련 훅을 직접 호출하여 더 세밀하고 성능적으로 효율적인 캐시 무효화 기능을 활용!
    revalidateTag("msg"); // 'msg' 태그가 달린 캐시 데이터를 무효화하여 최신 메시지를 가져오도록 함

    // revalidatePath("/messages"); // '/messages' 페이지의 캐시를 무효화하여 메시지 목록을 최신 상태로 갱신함
    // revalidatePath("/", "layout"); // 루트 레이아웃을 다시 렌더링하여 최신 상태를 반영하도록 함

    redirect("/messages"); // 메시지 목록 페이지로 리디렉션
  }

  return (
    <>
      <h2>New Message</h2>
      <form action={createMessage}>
        <p className="form-control">
          <label htmlFor="message">Your Message</label>
          <textarea id="message" name="message" required rows="5" />
        </p>

        <p className="form-actions">
          <button type="submit">Send</button>
        </p>
      </form>
    </>
  );
}
