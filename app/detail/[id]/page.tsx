"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardBody, Button, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";

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
        <p className="text-default-500">Now Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-2">
      <Card className="w-full">
        <CardBody className="p-0">
          <div className="relative h-64 md:h-96">
            <img
              src={photo.image_url}
              alt="Photo Detail"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 오디오 재생기 */}
          <audio
            ref={audioRef}
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => {
              if (audioRef.current) {
                setDuration(audioRef.current.duration);
              }
            }}
          />

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{photo.title}</h1>
              <p className="text-default-500">{new Date(photo.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        }) || ''}</p>
            </div>

            <div className="space-y-4">
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
            <div className="space-y-2">
                <h2 className="text-lg font-semibold">
                    Episode Description
                </h2>
                <p className="text-default-500">
                    {photo.content}
                </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 🧠 AI 추천 곡 섹션 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold px-6 text-start">
          🎶 추천 음악
        </h2>
        <div className="space-y-3 flex flex-col items-center">
          {recommendedSongs.map((song, idx) => (
            <Card key={idx} className="w-full mx-auto">
              <CardBody className="space-y-2">
                <h3 className="font-semibold">{song.title}</h3>
                <p className="text-sm text-default-500">{song.description}</p>

                {/* ▶️ Toggle 버튼 */}
                <Button
                  variant="solid"
                  color="primary"
                  onPress={() => toggleVideo(idx)}
                >
                  {visibleIndex === idx ? "영상 숨기기" : "YouTube에서 보기"}
                </Button>

                {/* 🎬 iframe 영상 토글 */}
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