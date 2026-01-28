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

    // Pi Network API를 호출하여 결제 승인
    const piResponse = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Key ${WALLET_CONFIG.PI_API_KEY}`,
      },
    });

    if (!piResponse.ok) {
      const errorData = await piResponse.json().catch(() => ({}));
      throw new Error(errorData.message || "Pi Network API 호출 실패");
    }

    const paymentData = await piResponse.json();

    return NextResponse.json({
      success: true,
      payment: paymentData,
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
