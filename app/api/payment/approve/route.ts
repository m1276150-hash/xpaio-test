import { NextRequest, NextResponse } from "next/server";
import { WALLET_CONFIG } from "@/lib/wallet-config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paymentId, accessToken } = body;

    if (!paymentId || !accessToken) {
      return NextResponse.json(
        { error: "필수 항목을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    console.log("[v0] 결제 승인 요청:", { paymentId });
    console.log("[v0] 테스트넷 - 즉시 승인 처리");

    // 테스트넷: Pi API 호출 없이 즉시 승인
    return NextResponse.json({
      success: true,
      payment: {
        identifier: paymentId,
        status: "approved",
        approved: true,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[v0] 결제 승인 실패:", error);
    return NextResponse.json(
      {
        error: "결제 승인 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 }
    );
  }
}
