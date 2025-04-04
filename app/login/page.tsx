"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { supabase } from "@/lib/supabase";
import {Image} from "@heroui/image";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.push("https://my-heroui-app-kappa.vercel.app");
      }
    };

    checkUser();
  }, [router]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://my-heroui-app-kappa.vercel.app/auth/callback",
      },
    });

    if (error) {
      console.error("로그인 에러:", error.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">
            ✨소중한 순간을 함께 나누어요✨
          </h1>
          <Image src="https://raw.githubusercontent.com/showboyz/showboyz.github.io/7f0aecac80b95d0d61eba0d36266f6e38a3da603/undraw_through-the-park_xcqx.svg" alt="login" width={250} height={250} />
          
        </CardHeader>
        <CardBody>
          <Button
            className="w-full"
            color="primary"
            radius="sm"
            startContent={<Icon icon="mdi:google" className="h-5 w-5" />}
            variant="bordered"
            onPress={handleGoogleLogin}
          >
            구글 계정으로 로그인
          </Button>
        </CardBody>
      </Card>
    </div>
  );
} 