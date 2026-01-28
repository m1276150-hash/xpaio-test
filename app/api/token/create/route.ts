import { NextRequest, NextResponse } from "next/server";
import { WALLET_CONFIG } from "@/lib/wallet-config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      name, 
      symbol, 
      totalSupply, 
      decimals, 
      accessToken,
      issuerWallet,
      issuerPassword,
      distributorWallet,
      distributorPassword
    } = body;

    // 입력 검증
    if (!name || !symbol || !totalSupply || !accessToken) {
      return NextResponse.json(
        { error: "필수 항목을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    // 지갑 정보 검증
    if (!issuerWallet || !issuerPassword || !distributorWallet || !distributorPassword) {
      return NextResponse.json(
        { error: "지갑 정보를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    // Pi Network Blockchain API를 호출하여 실제 토큰 발행
    console.log("[v0] 토큰 발행 요청:", { name, symbol, totalSupply, decimals });

    try {
      // Pi Network Blockchain API 호출
      // 실제 엔드포인트: https://api.minepi.com/v2/blockchain/token/create
      const piResponse = await fetch("https://api.minepi.com/v2/blockchain/token/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
          "X-Pi-Api-Key": WALLET_CONFIG.PI_API_KEY,
        },
        body: JSON.stringify({
          name,
          symbol,
          total_supply: totalSupply.toString(),
          decimals: decimals || 18,
          network: "testnet", // 'testnet' 또는 'mainnet'
          issuer_wallet: issuerWallet,
          issuer_password: issuerPassword,
          distributor_wallet: distributorWallet,
          distributor_password: distributorPassword,
        }),
      });

      if (!piResponse.ok) {
        const errorData = await piResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Pi Network API 호출 실패");
      }

      const piData = await piResponse.json();
      
      // Pi Network API 응답을 우리 형식으로 변환
      const tokenData = {
        success: true,
        tokenId: piData.token_id || piData.id,
        name,
        symbol,
        totalSupply,
        decimals: decimals || 18,
        network: "Pi Testnet",
        createdAt: piData.created_at || new Date().toISOString(),
        contractAddress: piData.contract_address || piData.address,
        transactionHash: piData.transaction_hash || piData.tx_hash,
      };

      return NextResponse.json(tokenData, { status: 200 });
    } catch (apiError) {
      console.error("[v0] Pi API 호출 실패:", apiError);
      
      // API 호출 실패 시 사용자에게 명확한 메시지 제공
      return NextResponse.json(
        { 
          error: "Pi Network 블록체인 연동이 필요합니다. 실제 토큰 발행을 위해서는 Pi Network API 키와 지갑 설정이 필요합니다.",
          details: apiError instanceof Error ? apiError.message : "알 수 없는 오류"
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("토큰 발행 오류:", error);
    return NextResponse.json(
      { error: "토큰 발행에 실패했습니다." },
      { status: 500 }
    );
  }
}
