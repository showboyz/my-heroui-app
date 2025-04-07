"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardBody, Button, Progress, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";
import { Image } from "@heroui/image";

// 추천 음악 데이터
const recommendedSongs = [
  {
    title: '"Yesterday" - The Beatles',
    description: "A nostalgic ballad perfect for reflecting on the past",
    youtubeId: "NrgmdOz227I",
  },
  {
    title: '"Hotel California" - Eagles',
    description: "Iconic 70s sound that brings back memories of the era",
    youtubeId: "EqPtz5qN7HM",
  },
  {
    title: '"Take Me Home, Country Roads" - John Denver',
    description: "A warm, heartfelt track that evokes a sense of home and memory",
    youtubeId: "1vrEljMfXYo",
  },
];

interface PhotoUpload {
  id: string;
  created_at: string;
  user_id: string;
  image_url: string;
  description: string;
  title: string;
  content: string;
  status: string;
  category?: string;
}

export default function PhotoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [photo, setPhoto] = React.useState<PhotoUpload | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [visibleIndex, setVisibleIndex] = React.useState<number | null>(null);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // 사진 데이터 가져오기
  React.useEffect(() => {
    const fetchPhoto = async () => {
      const { data, error } = await supabase
        .from("photo_uploads")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching photo:", error);
        return;
      }

      setPhoto(data);
    };

    if (id) {
      fetchPhoto();
    }
  }, [id]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      const current = audio.currentTime;
      const total = audio.duration;
      setCurrentTime(current);
      setProgress((current / total) * 100);
    }
  };

  const skipTime = (seconds: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime += seconds;
    }
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const sec = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${min}:${sec}`;
  };

  const toggleVideo = (index: number) => {
    setVisibleIndex((prev) => (prev === index ? null : index));
  };

  if (!photo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-default-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="w-full">
        <CardBody>
          <div className="relative w-full h-[400px] overflow-hidden rounded-xl">
            <Image
              src={photo.image_url}
              alt="Photo Detail"
              className="w-full h-full object-cover"
            />
            <Chip
              className="absolute top-2 right-2 z-10"
              color="primary"
              variant="flat"
            >
              {photo.category || 'uncategorized'}
            </Chip>
          </div>

          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{photo.title || 'untitled'}</h1>
              <div className="flex items-center gap-2 text-gray-500">
                <Icon icon="lucide:calendar" className="h-4 w-4" />
                <span className="text-sm">
                  {new Date(photo.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) || ''}
                </span>
              </div>
              <p className="text-default-500">{photo.description || 'No description'}</p>
            </div>

            {/* 오디오 플레이어 */}
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-default-500">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => skipTime(-15)}
                    aria-label="15초 되감기"
                  >
                    <Icon icon="lucide:rewind" className="h-6 w-6" />
                  </Button>
                  <Button
                    isIconOnly
                    color="primary"
                    aria-label={isPlaying ? "일시정지" : "재생"}
                    onPress={handlePlayPause}
                  >
                    <Icon
                      icon={isPlaying ? "lucide:pause" : "lucide:play"}
                      className="h-6 w-6"
                    />
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => skipTime(15)}
                    aria-label="15초 앞으로"
                  >
                    <Icon icon="lucide:fast-forward" className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <Progress
                aria-label="Progress"
                value={progress}
                className="w-full"
              />
            </div>

            {/* 콘텐츠 */}
            <div className="space-y-2 mt-6">
              <h2 className="text-lg font-semibold">내용</h2>
              <p className="text-default-500">
                {photo.content || 'No content'}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 🧠 AI 추천 곡 섹션 */}
      <div className="space-y-4 mt-6">
        <h2 className="text-lg font-semibold">
          🎶 추천 음악
        </h2>
        <div className="space-y-3">
          {recommendedSongs.map((song, idx) => (
            <Card key={idx} className="w-full">
              <CardBody className="space-y-2">
                <h3 className="font-semibold">{song.title}</h3>
                <p className="text-sm text-default-500">{song.description}</p>

                <Button
                  variant="solid"
                  color="primary"
                  onPress={() => toggleVideo(idx)}
                >
                  {visibleIndex === idx ? "영상 숨기기" : "YouTube에서 보기"}
                </Button>

                {visibleIndex === idx && (
                  <div
                    className="mt-4 w-full relative"
                    style={{ paddingBottom: "56.25%", height: 0 }}
                  >
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src={`https://www.youtube.com/embed/${song.youtubeId}`}
                      title={song.title}
                      style={{ border: "0" }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 