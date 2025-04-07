"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, Form, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import ImageUpload from "@/components/image-upload";
import { supabase } from "@/lib/supabase";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; // ✅ 여기서 저장
    const formData = new FormData(e.currentTarget);
    const description = formData.get("description") as string;

    if (!file || !description) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      // 1. Supabase Storage에 이미지 업로드
      const fileName = `${Date.now()}_${file.name}`;
      await supabase.storage
        .from("photos")
        .upload(fileName, file);

      const image_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${fileName}`;

      // 2. 로그인 사용자 가져오기
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("로그인한 사용자 정보가 없습니다.");
      }
      
      // 3. 데이터 저장
      const { data, error } = await supabase
        .from("photo_uploads")
        .insert({
          user_id: user.id,
          image_url,
          description,
          status: "pending",
        })
        .select();

      if (error || !data || data.length === 0) throw error;

      const insertedRow = data[0];

      // 4. Webhook 호출
      const webhookUrl = "https://ca51-124-52-43-121.ngrok-free.app/webhook-test/af1daccf-2f22-452b-8226-b415867f1b56";

      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: insertedRow.id,
          image_url: insertedRow.image_url,
          description: insertedRow.description,
          status: insertedRow.status,
        }),
      });

      setMessage("✅ 업로드 및 이야기 생성 요청 완료!");
      setFile(null);
      form.reset(); // ✅ 여기에선 안전하게 사용  
    } catch (error) {
      console.error("🔥 업로드 실패:", error);
      setMessage("❌ 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <Form onSubmit={handleSubmit} className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">
              ✨ 소중한 순간을 함께 나누어요! ✨
            </h1>
            <p className="text-sm text-default-500">
              이미지와 함께 새로운 게시물을 작성해보세요.
            </p>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            {/* 텍스트 입력 */}
            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                내용
              </label>
              <textarea
                id="description"
                name="description"
                required
                className="w-full min-h-[6rem] p-2 border rounded-sm"
                placeholder="예: 장소, 이름(우재와 이모) 여행 갔던 날이에요."
              />
            </div>

            {/* 이미지 업로드 */}
            <div className="flex flex-col gap-2">
              <label htmlFor="image-upload" className="text-sm font-medium">
                이미지
              </label>
              <ImageUpload
                selectedFile={file}
                onFileChange={handleFileChange}
              />
            </div>
          </CardBody>
        </Card>

        {/* 고정된 하단 버튼 */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
          <Button
            className="w-full"
            color="primary"
            disabled={uploading}
            isLoading={uploading}
            radius="sm"
            size="lg"
            startContent={<Icon icon="mdi:upload" className="h-5 w-5" />}
            type="submit"
          >
            {uploading ? "업로드 중..." : "업로드"}
          </Button>
          {message && (
            <p className="mt-2 text-center text-sm text-default-500">
              {message}
            </p>
          )}
        </div>
      </Form>
    </div>
  );
}