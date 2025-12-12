import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Pause, RotateCcw, Home } from "lucide-react";


export default function BookPage({ books }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef(null);

  const [uiVisible, setUiVisible] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const [icon, setIcon] = useState("pause");
  const [videoEnded, setVideoEnded] = useState(false);

  const [progress, setProgress] = useState(0);

  const hideTimerRef = useRef(null);
  const lastTapRef = useRef(0);

  const book = books?.find((b) => b.id === id);

  const STORAGE_KEY = `video_progress_${id}`;
  const SEEN_KEY = `video_seen_${id}`;

  // ------------------------------------------------------------
  // Load saved position
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      video.currentTime = Number(saved);
    }
  }, [STORAGE_KEY]);

  // ------------------------------------------------------------
  // Save position every 2 seconds
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const save = () => {
      localStorage.setItem(STORAGE_KEY, Math.floor(video.currentTime));
    };

    const interval = setInterval(save, 2000);
    return () => clearInterval(interval);
  }, [STORAGE_KEY]);

  // ------------------------------------------------------------
  // Clear hide timer
  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const startHideTimer = (isPaused) => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      setUiVisible(false);
    }, isPaused ? 6000 : 3000);
  };

  // ------------------------------------------------------------
  // TAP HANDLER
  const handleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 200) return;
    lastTapRef.current = now;

    const video = videoRef.current;

    if (!uiVisible) {
      setIcon(video.paused ? "play" : "pause");
      setUiVisible(true);
      setVideoPaused(video.paused);
      startHideTimer(video.paused);
      return;
    }

    if (video.paused) {
      video.play();
      setVideoPaused(false);
      setIcon("play");
      setVideoEnded(false);
      startHideTimer(false);
    } else {
      video.pause();
      setVideoPaused(true);
      setIcon("pause");
      startHideTimer(true);
    }

    setUiVisible(true);
  };

  // ------------------------------------------------------------
  // Update slider
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const update = () => {
      if (video.duration > 0) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener("timeupdate", update);
    return () => video.removeEventListener("timeupdate", update);
  }, []);

  // ------------------------------------------------------------
  // Handle video end/start events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setVideoEnded(true);
      setVideoPaused(true);
      setIcon("pause");
      setUiVisible(true);
      localStorage.setItem(SEEN_KEY, "true");
      localStorage.setItem(STORAGE_KEY, "0"); // reset saved timer
      setProgress(0);
      video.currentTime = 0;
      clearHideTimer();
    };

    const handlePlay = () => {
      setVideoEnded(false);
    };

    video.addEventListener("ended", handleEnded);
    video.addEventListener("play", handlePlay);

    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("play", handlePlay);
    };
  }, [SEEN_KEY, STORAGE_KEY]);

  const handleSliderChange = (e) => {
    const newProgress = Number(e.target.value);
    setProgress(newProgress);
    setVideoEnded(false);

    const video = videoRef.current;
    if (!video || !video.duration) return;

    video.currentTime = (newProgress / 100) * video.duration;

    setUiVisible(true);
    startHideTimer(video.paused);
  };

  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play();
    setProgress(0);
    setVideoEnded(false);
    setVideoPaused(false);
    setIcon("play");
    startHideTimer(false);
  };

  // ------------------------------------------------------------
  if (!book) {
    return <div className="p-10 text-center text-xl">Boek niet gevonden…</div>;
  }

  return (
    <div className="w-full h-screen flex flex-col bg-black">

      {/* HEADER */}
      <div className={`
        absolute top-0 left-0 right-0 z-30
        transition-all duration-500
        ${uiVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-24"}
      `}>
        <div className="p-4 bg-white/90 backdrop-blur-xl shadow-lg">
        <button
          onClick={() => navigate("/")}
          className="bg-white text-black px-6 py-3 rounded-2xl shadow text-xl active:scale-95 flex items-center gap-2"
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
          Terug
        </button>
        </div>
      </div>

      {/* VIDEO */}
      <div className="flex-1 relative overflow-hidden">

        <video
          ref={videoRef}
          src={book.url}
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          controls={false}
        />

        {/* TAP OVERLAY */}
        <div className="absolute inset-0 z-20" onClick={handleTap} />

        {/* CENTER ICON */}
        {uiVisible && !videoEnded && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none animate-fadeInZoom">
            <div className="bg-white/80 p-6 rounded-full shadow-xl flex items-center justify-center">
              {icon === "pause" ? (
                <Pause className="h-20 w-20 text-black" strokeWidth={2.5} />
              ) : (
                <Play className="h-20 w-20 text-black" strokeWidth={2.5} />
              )}
            </div>
          </div>
        )}


        {/* SHADED SLIDER BAR */}
        {uiVisible && (
          <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/40 backdrop-blur-sm py-6 px-10 rounded-t-3xl">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSliderChange}
              className="w-full h-12 appearance-none bg-transparent cursor-pointer"
            />

            <style>{`
              input[type="range"]::-webkit-slider-runnable-track {
                height: 14px;
                background: rgba(255,255,255,0.8);
                border-radius: 8px;
              }
              input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                height: 40px;
                width: 40px;
                border-radius: 50%;
                background: white;
                border: 4px solid #00bcd4;
                margin-top: -13px;
              }
            `}</style>
          </div>
        )}

        {/* END OVERLAY */}
        {videoEnded && (
          <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-8">
            <div className="text-white text-2xl font-semibold">
              Video afgelopen
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleReplay}
                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl shadow-lg text-lg active:scale-95"
              >
                <RotateCcw className="w-6 h-6" strokeWidth={2.5} />
                Nog een keer
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl shadow-lg text-lg border border-white/40 active:scale-95"
              >
                <Home className="w-6 h-6" strokeWidth={2.5} />
                Naar start
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
