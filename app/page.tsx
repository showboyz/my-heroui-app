"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">
          안녕하세요, {user.user_metadata?.full_name || "사용자"}님!
        </h1>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">✨ 소중한 순간을 함께 나누어요! ✨</h2>
          <p className="text-sm text-default-500">
            이미지와 함께 새로운 게시물을 작성해보세요.
          </p>
        </CardHeader>
      </Card>

      <Button
        isIconOnly
        color="primary"
        size="lg"
        radius="full"
        className="fixed bottom-8 right-8 shadow-lg"
        onPress={() => router.push("/upload")}
      >
        <Icon icon="mdi:plus" className="h-6 w-6" />
      </Button>
    </div>
  );
}
