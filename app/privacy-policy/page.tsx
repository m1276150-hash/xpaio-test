export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">개인정보 보호정책</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. 수집하는 정보</h2>
            <p>Xpaio는 Pi Network 인증을 통해 사용자의 기본 정보를 수집합니다.</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Pi Network 사용자 ID</li>
              <li>Pi 지갑 주소</li>
              <li>거래 내역</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. 정보 사용 목적</h2>
            <p>수집된 정보는 다음 목적으로만 사용됩니다:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>토큰 발행 및 관리</li>
              <li>결제 처리</li>
              <li>서비스 개선</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. 정보 보안</h2>
            <p>사용자 정보는 안전하게 암호화되어 저장되며, 제3자와 공유되지 않습니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. 문의</h2>
            <p>개인정보 보호정책에 대한 문의사항이 있으시면 Pi Network를 통해 연락 주시기 바랍니다.</p>
          </section>

          <p className="text-sm mt-8">최종 업데이트: 2024년 1월</p>
        </div>
      </div>
    </div>
  );
}
