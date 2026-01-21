import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MatrixRain from '@/components/MatrixRain';
import ParticleText from '@/components/ParticleText';
import BirthdayCard from '@/components/BirthdayCard';
import catTrigger from '@/assets/1.gif';

// Import file âm thanh
import beepSound from '@/assets/beep.mp3';
import birthdayMusic from '@/assets/happy-birthday.mp3';

const BirthdayPage: React.FC = () => {
  const [count, setCount] = useState<number | string>(3);
  const [fontSize, setFontSize] = useState(200);
  const [phase, setPhase] = useState<'matrix' | 'cat' | 'card'>('matrix');
  
  // Refs cho âm thanh với non-null assertion
  const beepAudioRef = useRef<HTMLAudioElement>(null);
  const musicAudioRef = useRef<HTMLAudioElement>(null);
  const hasPlayedMusicRef = useRef(false);
  const lastCountRef = useRef<number | string>(3);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isAudioInitializedRef = useRef(false);
  
  // THÊM: Biến để lưu vị trí phát nhạc
  const musicStartTimeRef = useRef(0);
  const isMusicPausedRef = useRef(false);

  // KHỞI TẠO AUDIO
  useEffect(() => {
    console.log('=== INITIALIZING AUTO-PLAY AUDIO ===');
    
    if (isAudioInitializedRef.current) return;
    isAudioInitializedRef.current = true;
    
    // PHƯƠNG PHÁP 1: Tạo audio elements với autoplay attribute
    const beepAudio = new Audio(beepSound);
    const musicAudio = new Audio(birthdayMusic);
    
    // Cài đặt audio
    beepAudio.volume = 0.7;
    beepAudio.preload = 'auto';
    beepAudio.muted = false;
    
    musicAudio.volume = 0.7;
    musicAudio.preload = 'auto';
    musicAudio.loop = true;
    musicAudio.muted = false;
    
    // Gán vào refs
    beepAudioRef.current = beepAudio;
    musicAudioRef.current = musicAudio;
    
    // PHƯƠNG PHÁP 2: Kích hoạt Audio Context
    const activateAudio = async () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioContextRef.current = new AudioContextClass();
          
          const oscillator = audioContextRef.current.createOscillator();
          const gainNode = audioContextRef.current.createGain();
          gainNode.gain.value = 0.001;
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContextRef.current.destination);
          
          oscillator.start();
          oscillator.stop(audioContextRef.current.currentTime + 0.001);
          
          console.log('✅ AudioContext activated');
        }
      } catch (error) {
        console.log('AudioContext error:', error);
      }
      
      try {
        const silentAudio = new Audio();
        silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ';
        silentAudio.volume = 0.000001;
        
        const playPromise = silentAudio.play();
        if (playPromise !== undefined) {
          await playPromise;
          console.log('✅ Silent audio played successfully');
          silentAudio.pause();
        }
      } catch (silentError) {
        console.log('Silent audio failed (normal):', silentError);
      }
    };
    
    activateAudio();
    
    setTimeout(() => {
      console.log('Triggering simulated user interaction');
      
      const events = ['click', 'touchstart', 'mousedown', 'keydown'];
      events.forEach(eventType => {
        const event = new Event(eventType, { bubbles: true });
        document.dispatchEvent(event);
      });
      
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
    }, 100);
    
    return () => {
      // LƯU VỊ TRÍ NHẠC TRƯỚC KHI CLEANUP
      if (musicAudioRef.current) {
        musicAudioRef.current.pause();
      }
      if (beepAudioRef.current) {
        beepAudioRef.current.pause();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // PHÁT ÂM THANH KHI COUNT THAY ĐỔI
  useEffect(() => {
    console.log('Count changed to:', count);
    
    const beepAudio = beepAudioRef.current;
    const musicAudio = musicAudioRef.current;
    
    // Phát tiếng bíp cho 3, 2, 1
    if (typeof count === 'number' && count !== lastCountRef.current) {
      console.log(`🎵 AUTO-PLAYING beep for: ${count}`);
      
      if (beepAudio) {
        try {
          beepAudio.currentTime = 0;
          const playPromise = beepAudio.play();
          
          if (playPromise !== undefined) {
            playPromise.catch((error: Error) => {
              console.log('Beep play error:', error.name);
              setTimeout(() => {
                if (beepAudio) {
                  beepAudio.play().catch(() => {});
                }
              }, 50);
            });
          }
        } catch (error) {
          console.log('Beep error caught:', error);
        }
      }
      lastCountRef.current = count;
    }

    // Phát nhạc HAPPY BIRTHDAY với LOOP
    if (count === "HAPPY\nBIRTHDAY" && !hasPlayedMusicRef.current) {
      console.log('🎉 STARTING BIRTHDAY MUSIC (LOOPING)');
      hasPlayedMusicRef.current = true;
      
      if (musicAudio) {
        // KHÔNG reset currentTime nữa, để tiếp tục nếu đã phát trước đó
        // musicAudio.currentTime = 0; // <-- XÓA DÒNG NÀY
        
        musicAudio.loop = true;
        
        const playPromise = musicAudio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('✅ Music started successfully');
              musicStartTimeRef.current = Date.now();
            })
            .catch((error: Error) => {
              console.log('Music play error:', error.name);
              
              const retryMusic = () => {
                if (musicAudio) {
                  musicAudio.play()
                    .then(() => {
                      console.log('✅ Music retry successful');
                      musicStartTimeRef.current = Date.now();
                    })
                    .catch(() => {
                      console.log('Retrying again...');
                      setTimeout(retryMusic, 300);
                    });
                }
              };
              
              setTimeout(retryMusic, 200);
            });
        }
      }
    }
  }, [count]);

  // HÀM ĐẢM BẢO NHẠC TIẾP TỤC PHÁT KHI CHUYỂN TRANG
  const ensureMusicContinues = () => {
    const musicAudio = musicAudioRef.current;
    if (!musicAudio || !hasPlayedMusicRef.current) return;
    
    console.log('🎵 Ensuring music continues...');
    
    // KHÔNG reset currentTime, chỉ resume nếu bị pause
    if (musicAudio.paused) {
      musicAudio.play()
        .then(() => {
          console.log('✅ Music resumed successfully');
          isMusicPausedRef.current = false;
        })
        .catch((error: Error) => {
          console.log('Music resume failed:', error);
          isMusicPausedRef.current = true;
          
          // Thử lại sau khi user interaction
          const handleUserInteraction = () => {
            if (musicAudio.paused) {
              musicAudio.play().catch(() => {});
            }
            document.removeEventListener('click', handleUserInteraction);
          };
          
          document.addEventListener('click', handleUserInteraction);
        });
    }
  };

  // KHI PHASE THAY ĐỔI, ĐẢM BẢO NHẠC TIẾP TỤC
  useEffect(() => {
    console.log(`Phase changed to: ${phase}, ensuring music continues`);
    
    // Đảm bảo nhạc tiếp tục phát khi chuyển phase
    const timer = setTimeout(() => {
      ensureMusicContinues();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [phase]);

  // KIỂM TRA VÀ ĐẢM BẢO NHẠC LUÔN CHẠY
  useEffect(() => {
    if (!hasPlayedMusicRef.current) return;
    
    const checkAndResumeMusic = () => {
      const musicAudio = musicAudioRef.current;
      if (musicAudio && musicAudio.paused && !isMusicPausedRef.current) {
        console.log('⚠️ Music paused, resuming...');
        musicAudio.play().catch((error: Error) => {
          console.log('Auto-resume failed:', error);
        });
      }
    };
    
    const intervalId = setInterval(checkAndResumeMusic, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // COUNTDOWN LOGIC (giữ nguyên)
  useEffect(() => {
    if (typeof count === 'number' && count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 2000); 
      return () => clearTimeout(timer);
    } else if (count === 0) {
      const timer = setTimeout(() => {
        setCount("HAPPY\nBIRTHDAY");
        setFontSize(100);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (count === "HAPPY\nBIRTHDAY") {
        const timer = setTimeout(() => {
            setPhase('cat');
        }, 3000); 
        return () => clearTimeout(timer);
    }
  }, [count]);

  // Auto-transition from Cat to Card
  useEffect(() => {
    if (phase === 'cat') {
        const timer = setTimeout(() => {
            setPhase('card');
        }, 1200);
        return () => clearTimeout(timer);
    }
  }, [phase]);

  // THÊM: Hàm xử lý click để resume nhạc nếu bị block
  const handlePageClick = () => {
    ensureMusicContinues();
  };

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden font-mono"
      onClick={handlePageClick}
    >
      {/* Matrix Rain Background */}
      <motion.div 
        animate={{ opacity: phase === 'matrix' ? 1 : 0 }}
        transition={{ duration: 0 }}
        className="absolute inset-0 z-0"
      >
        <MatrixRain />
      </motion.div>
      
      {/* Pink Background for Phase 2 & 3 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase !== 'matrix' ? 1 : 0 }}
        transition={{ duration: 0 }}
        className="absolute inset-0 z-0 bg-pink-200"
      />

      {/* Music status - hiển thị trạng thái nhạc */}
      <div className="absolute top-4 right-4 z-50">
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-500/20 backdrop-blur-sm">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <span className="text-white text-sm font-medium">
            {hasPlayedMusicRef.current ? '🎵 MUSIC PLAYING' : '🔇 NO MUSIC'}
          </span>
        </div>
      </div>

      {/* Main Content Layer */}
      <div className="z-10 relative w-full h-full">
        <AnimatePresence mode="wait">
            {phase === 'matrix' && (
                <motion.div 
                    key="particles"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0 }}
                    className="w-full h-full flex items-center justify-center"
                >
                    <ParticleText 
                        text={count === 0 ? "" : count} 
                        fontSize={fontSize}
                        color="#FFB6C1"
                    />
                </motion.div>
            )}

            {phase === 'cat' && (
                <motion.div
                    key="cat"
                    initial={{ opacity: 1, scale: 1 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 0 }}
                    className="w-full h-full flex items-center justify-center cursor-pointer"
                    onClick={() => setPhase('card')}
                >
                    <motion.img 
                        src={catTrigger} 
                        alt="Click me" 
                        className="max-w-md w-full object-contain shadow-2xl rounded-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    />
                </motion.div>
            )}

            {phase === 'card' && (
                <motion.div
                    key="card"
                    className="w-full h-full"
                >
                    <BirthdayCard />
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Audio elements ẩn */}
      <audio 
        id="beep-audio"
        ref={beepAudioRef}
        preload="auto"
        src={beepSound}
        playsInline
        muted={false}
      />
      
      <audio 
        id="music-audio"
        ref={musicAudioRef}
        preload="auto"
        src={birthdayMusic}
        loop
        playsInline
        muted={false}
        // Thêm onPause và onPlay để theo dõi trạng thái
        onPause={() => {
          console.log('Music paused at position:', musicAudioRef.current?.currentTime);
          isMusicPausedRef.current = true;
        }}
        onPlay={() => {
          console.log('Music playing at position:', musicAudioRef.current?.currentTime);
          isMusicPausedRef.current = false;
        }}
      />
    </div>
  );
};

export default BirthdayPage;