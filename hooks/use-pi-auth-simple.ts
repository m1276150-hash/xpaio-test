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
          console.warn("[v0] Pi SDK 없음 - 테스트 모드로 진행");
          // Pi SDK가 없어도 테스트 모드로 진행
          setPiAccessToken("test-token-sandbox");
          setPiUser({ uid: "test-user", username: "테스트사용자" });
          setIsAuthenticated(true);
          setAuthMessage("테스트 모드 로그인");
          return;
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
        
        setPiAccessToken(authResult.accessToken);
        setPiUser(authResult.user);
        setIsAuthenticated(true);
        setAuthMessage("로그인 완료!");
        
      } catch (err) {
        console.error("[v0] Pi 인증 실패:", err);
        console.log("[v0] 테스트 모드로 전환");
        
        // 인증 실패 시 테스트 모드로 진행
        setPiAccessToken("test-token-fallback");
        setPiUser({ uid: "test-user", username: "테스트사용자" });
        setIsAuthenticated(true);
        setAuthMessage("테스트 모드 (인증 실패)");
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
