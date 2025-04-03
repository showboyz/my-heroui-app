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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="h-screen flex flex-col items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">
            ✨ 소중한 순간을 함께 나누어요! ✨
          </h1>
          <p className="text-sm text-default-500">
            이미지와 함께 새로운 게시물을 작성해보세요.
          </p>
        </CardHeader>
        <div className="flex flex-col gap-4 p-4">
          <Button
            className="w-full"
            color="primary"
            radius="sm"
            startContent={<Icon icon="mdi:upload" className="h-5 w-5" />}
            onPress={() => router.push("/upload")}
          >
            업로드하기
          </Button>
          <Button
            className="w-full"
            color="danger"
            radius="sm"
            startContent={<Icon icon="mdi:logout" className="h-5 w-5" />}
            onPress={handleLogout}
          >
            로그아웃
          </Button>
        </div>
      </Card>
    </div>
  );
}
