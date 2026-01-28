export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">서비스 이용약관</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. 서비스 이용</h2>
            <p>Xpaio는 Pi Network 테스트넷 기반의 토큰 발행 및 결제 플랫폼입니다.</p>
            <ul className="list-disc ml-6 mt-2">
              <li>테스트 환경에서만 사용 가능합니다</li>
              <li>실제 자산 가치가 없습니다</li>
              <li>서비스는 예고 없이 변경될 수 있습니다</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. 사용자 책임</h2>
            <p>사용자는 다음 사항을 준수해야 합니다:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>정확한 정보 제공</li>
              <li>불법적인 목적으로 사용 금지</li>
              <li>타인의 권리 침해 금지</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. 서비스 제한</h2>
            <p>다음의 경우 서비스 이용이 제한될 수 있습니다:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>약관 위반</li>
              <li>부정 사용 시도</li>
              <li>시스템 안정성 위협</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. 면책 조항</h2>
            <p>본 서비스는 테스트 목적으로 제공되며, 어떠한 보증도 제공하지 않습니다. 서비스 이용으로 인한 손해에 대해 책임지지 않습니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. 약관 변경</h2>
            <p>본 약관은 사전 고지 없이 변경될 수 있으며, 변경된 약관은 공지 즉시 효력이 발생합니다.</p>
          </section>

          <p className="text-sm mt-8">최종 업데이트: 2024년 1월</p>
        </div>
      </div>
    </div>
  );
}
