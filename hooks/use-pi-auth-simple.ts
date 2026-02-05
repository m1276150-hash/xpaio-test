'use client';

import { useState, useEffect } from "react";
import { WALLET_CONFIG } from "@/lib/wallet-config";

interface PiAuthResult {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
}

declare global {
  interface Window {
    Pi?: {
      init: (config: { version: string; sandbox?: boolean; productionHost?: string }) => Promise<void>;
      authenticate: (scopes: string[], onIncompletePaymentFound?: (payment: any) => void) => Promise<PiAuthResult>;
    };
  }
}

export const usePiAuthSimple = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMessage, setAuthMessage] = useState("Pi Network 초기화 중...");
  const [piAccessToken, setPiAccessToken] = useState<string | null>(null);
  const [piUser, setPiUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initPi = async () => {
      try {
        console.log("[v0] Pi SDK 초기화 시작");
        
        // Pi SDK가 로드될 때까지 대기 (최대 10초)
        let attempts = 0;
        while (!window.Pi && attempts < 100) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.Pi) {
          throw new Error("Pi SDK를 로드할 수 없습니다. Pi 브라우저에서 접속해주세요.");
        }

        console.log("[v0] Pi SDK 발견, 초기화 중");
        setAuthMessage("Pi Network 연결 중...");

        // Pi SDK 초기화 (App ID 포함)
        const initConfig = { 
          version: "2.0", 
          sandbox: true
        };
        
        console.log("[v0] Pi SDK 초기화 설정:", { appId: WALLET_CONFIG.PI_APP_ID, ...initConfig });
        
        await window.Pi.init(initConfig);

        console.log("[v0] Pi SDK 초기화 완료, 인증 시작");
        setAuthMessage("Pi Network 로그인 중...");

        // 인증 실행
        const authResult = await window.Pi.authenticate(
          ["username", "payments"],
          (payment) => {
            console.log("[v0] 미완료 결제 발견:", payment);
          }
        );

        console.log("[v0] 인증 성공:", authResult);
        console.log("[v0] Access Token:", authResult.accessToken);
        console.log("[v0] 사용자 정보:", authResult.user);
        console.log("[v0] 사용자 UID:", authResult.user?.uid);
        console.log("[v0] 사용자 이름:", authResult.user?.username);
        
        setPiAccessToken(authResult.accessToken);
        setPiUser(authResult.user);
        setIsAuthenticated(true);
        setAuthMessage("로그인 완료!");
        
        console.log("[v0] 상태 업데이트 완료 - piUser:", authResult.user);
        
      } catch (err) {
        console.error("[v0] Pi 인증 실패:", err);
        const errorMsg = err instanceof Error ? err.message : "Pi Network 인증에 실패했습니다";
        setError(errorMsg);
        setAuthMessage(errorMsg);
      }
    };

    initPi();
  }, []);

  return {
    isAuthenticated,
    authMessage,
    piAccessToken,
    piUser,
    error,
  };
};
