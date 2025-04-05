"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Card, CardHeader, Button } from "@heroui/react";
import { supabase } from "@/lib/supabase";
import { Image } from "@heroui/image";
import { FeedItem } from "@/components/FeedItem";
export default function HomePage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);



  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id;

      if (!uid) {
        router.push("/login");
        return;
      }

      setUser(userData.user);
      // 슈파베이스 데이터 가져오기
      const { data, error } = await supabase
        .from("photo_uploads")
        .select("*")
        .eq("user_id", uid)
        .eq("status", "done") // ✅ status 필터 추가!
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ 데이터 가져오기 실패:", error);
      } else {
        setItems(data);
        
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <FeedItem
          key={item.id}
          item={item}
        />
      ))}
      

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
