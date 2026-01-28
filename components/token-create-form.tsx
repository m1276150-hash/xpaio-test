"use client"

import React from "react"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Coins, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { TokenCreateResponse } from "@/lib/token-types";

interface TokenCreateFormProps {
  piAccessToken: string;
  onTokenCreated?: (token: TokenCreateResponse) => void;
}

export function TokenCreateForm({ piAccessToken, onTokenCreated }: TokenCreateFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    totalSupply: "",
    decimals: "18",
    issuerWallet: "",
    issuerPassword: "",
    distributorWallet: "",
    distributorPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<TokenCreateResponse | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/token/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          symbol: formData.symbol.toUpperCase(),
          totalSupply: parseFloat(formData.totalSupply),
          decimals: parseInt(formData.decimals),
          accessToken: piAccessToken,
          issuerWallet: formData.issuerWallet,
          issuerPassword: formData.issuerPassword,
          distributorWallet: formData.distributorWallet,
          distributorPassword: formData.distributorPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "토큰 발행에 실패했습니다.");
      }

      setSuccess(data);
      if (onTokenCreated) {
        onTokenCreated(data);
      }

      // 폼 초기화
      setFormData({ 
        name: "", 
        symbol: "", 
        totalSupply: "", 
        decimals: "18",
        issuerWallet: "",
        issuerPassword: "",
        distributorWallet: "",
        distributorPassword: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "토큰 발행 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6" />
          <CardTitle>Pi Network 토큰 발행</CardTitle>
        </div>
        <CardDescription>
          Pi Testnet에서 새로운 토큰을 발행하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">토큰 이름</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="예: My Token"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="symbol">토큰 심볼</Label>
            <Input
              id="symbol"
              value={formData.symbol}
              onChange={(e) => handleChange("symbol", e.target.value)}
              placeholder="예: MTK"
              maxLength={10}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalSupply">총 발행량</Label>
            <Input
              id="totalSupply"
              type="number"
              value={formData.totalSupply}
              onChange={(e) => handleChange("totalSupply", e.target.value)}
              placeholder="예: 1000000"
              min="1"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="decimals">소수점 자릿수</Label>
            <Input
              id="decimals"
              type="number"
              value={formData.decimals}
              onChange={(e) => handleChange("decimals", e.target.value)}
              placeholder="18"
              min="0"
              max="18"
              disabled={isLoading}
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-semibold mb-3">지갑 정보</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="issuerWallet">A지갑 발행자 주소</Label>
                <Input
                  id="issuerWallet"
                  value={formData.issuerWallet}
                  onChange={(e) => handleChange("issuerWallet", e.target.value)}
                  placeholder="0x..."
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuerPassword">A지갑 발행자 비밀번호</Label>
                <Input
                  id="issuerPassword"
                  type="password"
                  value={formData.issuerPassword}
                  onChange={(e) => handleChange("issuerPassword", e.target.value)}
                  placeholder="비밀번호 입력"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="distributorWallet">B지갑 유통자 주소</Label>
                <Input
                  id="distributorWallet"
                  value={formData.distributorWallet}
                  onChange={(e) => handleChange("distributorWallet", e.target.value)}
                  placeholder="0x..."
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="distributorPassword">B지갑 유통자 비밀번호</Label>
                <Input
                  id="distributorPassword"
                  type="password"
                  value={formData.distributorPassword}
                  onChange={(e) => handleChange("distributorPassword", e.target.value)}
                  placeholder="비밀번호 입력"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="font-semibold">토큰이 성공적으로 발행되었습니다!</div>
                <div className="text-sm mt-2 space-y-1">
                  <div>토큰 ID: {success.tokenId}</div>
                  <div>컨트랙트: {success.contractAddress}</div>
                  <div>네트워크: {success.network}</div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                발행 중...
              </>
            ) : (
              "토큰 발행"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
