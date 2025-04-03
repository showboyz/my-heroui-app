"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Card, CardHeader, Button } from "@heroui/react";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
      }
    };

    checkUser();
  }, [router]);

  return (
    <div className="flex flex-col items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">
            ✨ 소중한 순간을 함께 나누어요! ✨
          </h1>
          <p className="text-sm text-default-500">
            이미지와 함께 새로운 게시물을 작성해보세요.
          </p>
        </CardHeader>
      </Card>

      {/* 플로팅 업로드 버튼 */}
      <Button
        className="fixed bottom-8 right-8 shadow-lg"
        color="primary"
        isIconOnly
        radius="full"
        size="lg"
        onPress={() => router.push("/upload")}
      >
        <Icon icon="mdi:plus" className="h-6 w-6" />
      </Button>
    </div>
  );
}
