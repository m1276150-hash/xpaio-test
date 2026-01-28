"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Copy, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface WalletInfoProps {
  accessToken: string
}

export function WalletInfo({ accessToken }: WalletInfoProps) {
  const [copied, setCopied] = useState(false)
  
  // accessToken에서 사용자 정보 추출 (실제로는 백엔드에서 가져와야 함)
  const mockWalletAddress = `0x${Math.random().toString(16).slice(2, 42)}`
  
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
          <div className="flex items-center gap-2 bg-muted p-3 rounded-md">
            <code className="flex-1 text-sm truncate">
              {mockWalletAddress}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(mockWalletAddress)}
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            이 주소는 Pi Network 인증을 통해 연결된 지갑 주소입니다.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
