"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { WALLET_CONFIG } from "@/lib/wallet-config";

interface PiPaymentTestProps {
  piAccessToken: string;
}

export function PiPaymentTest({ piAccessToken }: PiPaymentTestProps) {
  const [amount, setAmount] = useState("1");
  const [memo, setMemo] = useState("테스트 결제");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handlePayment = async () => {
    setIsProcessing(true);
    setResult(null);

    try {
      // Pi SDK를 사용한 결제 요청
      if (typeof window.Pi === "undefined") {
        throw new Error("Pi SDK가 로드되지 않았습니다");
      }

      const payment = await window.Pi.createPayment(
        {
          amount: parseFloat(amount),
          memo: memo,
          metadata: { 
            appId: WALLET_CONFIG.PI_APP_ID,
            timestamp: Date.now() 
          },
        },
        {
          onReadyForServerApproval: (paymentId: string) => {
            console.log("[v0] 결제 서버 승인 대기:", paymentId);
          },
          onReadyForServerCompletion: (paymentId: string, txid: string) => {
            console.log("[v0] 결제 완료 대기:", paymentId, txid);
          },
          onCancel: (paymentId: string) => {
            console.log("[v0] 결제 취소:", paymentId);
            throw new Error("결제가 취소되었습니다");
          },
          onError: (error: Error, payment?: any) => {
            console.error("[v0] 결제 에러:", error, payment);
            throw error;
          },
        }
      );

      console.log("[v0] 결제 생성:", payment);

      // 백엔드에 결제 승인 요청
      const response = await fetch("/api/payment/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: payment.identifier,
          accessToken: piAccessToken,
        }),
      });

      if (!response.ok) {
        throw new Error("결제 승인 실패");
      }

      setResult({
        success: true,
        message: `${amount} Pi 결제가 성공적으로 완료되었습니다!`,
      });
    } catch (error) {
      console.error("[v0] 결제 오류:", error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "결제 처리 중 오류가 발생했습니다",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Pi 결제 테스트</CardTitle>
        <CardDescription>User-to-App 결제를 테스트합니다</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">결제 금액 (Pi)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1.0"
            min="0.01"
            step="0.01"
            disabled={isProcessing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="memo">메모</Label>
          <Input
            id="memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="결제 메모"
            disabled={isProcessing}
          />
        </div>

        <Button
          onClick={handlePayment}
          disabled={isProcessing || !amount || parseFloat(amount) <= 0}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              처리 중...
            </>
          ) : (
            "결제하기"
          )}
        </Button>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

declare global {
  interface Window {
    Pi: {
      createPayment: (
        payment: {
          amount: number;
          memo: string;
          metadata: { appId: string; timestamp: number };
        },
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => void;
          onReadyForServerCompletion: (paymentId: string, txid: string) => void;
          onCancel: (paymentId: string) => void;
          onError: (error: Error, payment?: any) => void;
        }
      ) => Promise<{ identifier: string }>;
    };
  }
}
