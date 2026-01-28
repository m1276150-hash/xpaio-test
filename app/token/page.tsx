"use client"

import { TokenCreateForm } from "@/components/token-create-form";
import { WalletInfo } from "@/components/wallet-info";
import { PiPaymentTest } from "@/components/pi-payment-test";
import { usePiAuthSimple } from "@/hooks/use-pi-auth-simple";
import { APP_CONFIG, COLORS } from "@/lib/app-config";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePiNetworkAuthentication } from "@/hooks/use-pi-network-authentication"; // Import the missing hook

export default function TokenPage() {
  const { isAuthenticated, authMessage, piAccessToken, error } = usePiAuthSimple();

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-white/95 z-50 flex flex-col items-center justify-center">
        <div className="text-xl font-semibold mb-4">{APP_CONFIG.NAME}</div>
        <div className={`text-lg mb-4 ${error ? "text-red-600" : ""}`}>{authMessage}</div>
        {!error && (
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2"
            style={{ borderBottomColor: COLORS.PRIMARY }}
          />
        )}
        {error && (
          <button
            className="mt-4 px-4 py-2 rounded text-white hover:opacity-90"
            style={{ backgroundColor: COLORS.PRIMARY }}
            onClick={() => window.location.reload()}
          >
            다시 시도
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center" style={{ backgroundColor: COLORS.BACKGROUND }}>
      <div className="w-full max-w-lg mb-4">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            채팅으로 돌아가기
          </Button>
        </Link>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center py-8 w-full max-w-2xl">
        <WalletInfo accessToken={piAccessToken || ""} />
        
        <Tabs defaultValue="token" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="token">토큰 발행</TabsTrigger>
            <TabsTrigger value="payment">결제 테스트</TabsTrigger>
          </TabsList>
          
          <TabsContent value="token" className="flex justify-center">
            <TokenCreateForm
              piAccessToken={piAccessToken || ""}
              onTokenCreated={(token) => {
                console.log("[v0] 토큰 발행 완료:", token);
              }}
            />
          </TabsContent>
          
          <TabsContent value="payment" className="flex justify-center">
            <PiPaymentTest piAccessToken={piAccessToken || ""} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
