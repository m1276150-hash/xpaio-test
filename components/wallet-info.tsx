"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Copy, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface WalletInfoProps {
  accessToken: string
  piUser?: { uid: string; username: string }
  onLoginClick?: () => void
}

export function WalletInfo({ accessToken, piUser, onLoginClick }: WalletInfoProps) {
  const [copied, setCopied] = useState(false)
  
  console.log("[v0] WalletInfo - piUser:", piUser);
  console.log("[v0] WalletInfo - accessToken:", accessToken ? "있음" : "없음");
  
  // Pi 사용자 식별자 (UID)
  // 주의: 이것은 지갑 주소가 아니라 사용자 식별자입니다
  const userIdentifier = piUser?.uid || "인증 필요"
  
  console.log("[v0] WalletInfo - userIdentifier:", userIdentifier);
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("복사 실패:", err)
    }
  }

  return (
    <Card className="w-full max-w-lg mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          <CardTitle className="text-lg">Pi 지갑 정보</CardTitle>
        </div>
        <CardDescription>
          토큰 발행에 사용될 지갑 주소
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {piUser && (
            <div className="mb-3 p-3 bg-blue-50 rounded-md">
              <div className="text-sm font-medium">사용자: {piUser.username}</div>
              <div className="text-xs text-muted-foreground">UID: {piUser.uid}</div>
            </div>
          )}
          <div className="flex items-center gap-2 bg-muted p-3 rounded-md">
            <code className="flex-1 text-sm truncate">
              {userIdentifier}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(userIdentifier)}
              disabled={userIdentifier === "인증 필요"}
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            Pi 사용자 식별자(UID)입니다. 결제는 사용자의 Pi 지갑에서 앱 지갑으로 이루어집니다.
          </div>
          
          {userIdentifier === "인증 필요" && onLoginClick && (
            <Button 
              onClick={onLoginClick}
              className="w-full mt-4"
              variant="default"
            >
              Pi Network 로그인
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
