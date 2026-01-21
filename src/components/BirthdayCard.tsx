import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Import ảnh (đảm bảo file ảnh đã được đặt trong thư mục assets hoặc public)
import birthdayImage from '@/assets/2.jpg'; // Hoặc import từ public: '/2.jpg'

const BirthdayCard: React.FC = () => {
  const fullText = `Dear bạn Hdy of toyy

  Hôm nay là ngày 23/1 một ngày rất đặc biệt - ngày mà thế giới có lí do để mừng sinh nhật một người " rất thích ăn cháo " , xinh gái , cute - PHAN THỊ HUYỀN DIỆU 

  Nhân dịp mừng thọ tuổi 18 chúc m luôn xinh gái , học giỏi , luôn vui vẻ , lạc quan , nhiều tiền , nhiều tiền , nhiều tiền " cái gì quan trọng nhắc lại 3 lần " , mạnh khỏe , không còn đau bụng mỗi khi đến tiết toán , da mặt sẽ trộm vía không có mụn và trắng lên , cao lên mà chắc cũng không cần cao đâu tại linh bế lên là cao ngay mò 👩🏻‍🤝‍👨🏼, bớt ovtk , bớt ovtk ,bớt ovtk ( cái này cũng quan trọng nên nhắc 3 lần ) , thực hiện được những điều m mong muốn và vào được ngôi trường m thích nhé💗💗💗💗🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂

  T nghĩ tình bạn thì 3 có loại như thế này :
    1 là những chiếc lá sẽ là những ng chỉ ở lại khi mọi thứ còn tốt đẹp
    2 là cành là nghe thì rất là vững chắc nhưng mà chỉ cần một cơn gió mạnh thì sẽ gãy 
    3 là rễ là những ng bạn mà đi từng năm tháng dù bạn có ra sao đi chăng nữa 

    Với t thì m là " rễ cây của t " và t mong t cũng là rễ cây của m , mong cho m sau này tìm được cái rễ cây luôn yêu thương quan tâm m như linh chẳng hạn😁

    Bây giờ kiểu sắp hết c3 cảm giác như thời gian trôi rất nhanh nhìn cái gì cũng ra kỉ niệm , t nhớ những lúc t vs m ngồi nấu xói , ngồi luyên thuyên xàm xí với nhau , trải qua mọi phiên bản của nhau và còn cả những lời chúc dành cho nhau nên t rất vui khi có m ở trong thanh xuân của t , mong cho mỗi ngày của m đều là những ngày hạnh phúc ,dù có gặp khó khăn gì thì cũng luôn mạnh mẽ và m xứng đáng với tất cả những gì tuyệt vời nhất

    Người có điểm văn kém nên viết không được hay douuu, từ tận đáy lòng đấyyy

    HAPPY BIRTHDAY HDY 🎂🎉🎁🎊🍻

            Hết r nhé e gái`;

  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(30);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);
  const textArrayRef = useRef<string[]>([]);

  // FIXED: Sử dụng phương pháp tách ký tự chính xác hơn
  useEffect(() => {
    // Sử dụng match với regex để xử lý emoji phức tạp đúng cách
    textArrayRef.current = fullText.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\s\S]/g) || [];
  }, [fullText]);

  // Hiệu ứng typewriter đơn giản
  useEffect(() => {
    if (currentIndexRef.current < textArrayRef.current.length && !isTypingComplete) {
      const timeout = setTimeout(() => {
        const nextChar = textArrayRef.current[currentIndexRef.current];
        setDisplayedText(prev => prev + nextChar);
        currentIndexRef.current++;
        
        if (Math.random() > 0.9) {
          setTypingSpeed(prev => Math.max(10, Math.min(100, prev + (Math.random() > 0.5 ? 10 : -10))));
        }
      }, typingSpeed);
      
      return () => clearTimeout(timeout);
    } else if (!isTypingComplete) {
      setIsTypingComplete(true);
    }
  }, [displayedText, isTypingComplete, typingSpeed]);

  // Auto-scroll
  useEffect(() => {
    if (textContainerRef.current) {
      const scrollHeight = textContainerRef.current.scrollHeight;
      const clientHeight = textContainerRef.current.clientHeight;
      if (scrollHeight > clientHeight) {
        textContainerRef.current.scrollTop = scrollHeight - clientHeight;
      }
    }
  }, [displayedText]);

  const Cursor = () => (
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.8, repeat: Infinity }}
      className="inline-block w-[2px] h-[1.2em] bg-pink-500 ml-[1px] align-middle"
    />
  );

  const progressPercentage = textArrayRef.current.length > 0 
    ? Math.round((currentIndexRef.current / textArrayRef.current.length) * 100)
    : 0;

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200/90 to-purple-200/90 backdrop-blur-sm fixed inset-0 z-50">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 max-w-2xl w-full mx-4 border-2 border-pink-300 relative flex flex-col"
        style={{ maxHeight: '90vh', boxShadow: '0 20px 60px rgba(236, 72, 153, 0.3)' }}
      >
        {/* Tiêu đề */}
        <div className="flex-shrink-0 mb-4">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent font-serif text-center"
          >
            ✨ HAPPY BIRTHDAY ✨
          </motion.h1>
        </div>
        
        {/* Khu vực thư - QUAN TRỌNG: Sửa CSS để hiển thị đúng */}
        <div 
          ref={textContainerRef}
          className="flex-grow overflow-y-auto mb-4 px-4 py-3 bg-gradient-to-b from-white to-pink-50/50 rounded-2xl border border-pink-100"
          style={{ maxHeight: '55vh' }}
        >
          <div className="text-gray-800">
            {/* Văn bản với hiệu ứng typewriter - FIXED: Sử dụng font hỗ trợ emoji */}
            <div 
              className="whitespace-pre-wrap leading-relaxed font-sans text-lg"
              style={{ 
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                fontFeatureSettings: '"kern" 1, "liga" 1',
                fontKerning: 'normal',
                // QUAN TRỌNG: Thêm font hỗ trợ emoji
                fontFamily: "'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', 'Segoe UI Symbol', 'Android Emoji', 'EmojiSymbols', 'Symbola', 'system-ui', sans-serif",
                // Thêm fix cho iOS
                whiteSpace: 'pre-line', // Quan trọng nhất
                lineHeight: '1.4',
                letterSpacing: 'normal',
                // Fix rendering trên iOS
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                // Chống zoom khi tap trên iOS
                WebkitTextSizeAdjust: '100%'
              }}
            >
              {displayedText}
              {!isTypingComplete && <Cursor />}
            </div>
        
            
            {/* Hiển thị ảnh sau khi hoàn thành typing */}
            {isTypingComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-6 mb-4 flex justify-center"
              >
                <div className="relative overflow-hidden rounded-xl border-4 border-pink-300 shadow-lg max-w-3xl">
                  <img 
                    src={birthdayImage} 
                    alt="Birthday Celebration" 
                    className="w-full h-auto object-cover"
                  />
                  
                </div>
              </motion.div>
            )}
            
            {/* Thông tin typing */}
            {!isTypingComplete && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex flex-col items-center"
              >
                {/* Nút điều khiển */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setTypingSpeed(prev => Math.max(5, prev - 20))}
                    className="text-xs text-gray-600 hover:text-pink-600 px-3 py-1 border border-gray-300 rounded-full hover:border-pink-300 transition-colors"
                  >
                    ⏩ Nhanh hơn
                  </button>
                  
                  <button
                    onClick={() => setTypingSpeed(prev => Math.min(200, prev + 20))}
                    className="text-xs text-gray-600 hover:text-purple-600 px-3 py-1 border border-gray-300 rounded-full hover:border-purple-300 transition-colors"
                  >
                    ⏪ Chậm hơn
                  </button>
                  
                  <button
                    onClick={() => {
                      setDisplayedText(fullText);
                      currentIndexRef.current = textArrayRef.current.length;
                      setIsTypingComplete(true);
                    }}
                    className="text-xs bg-pink-500 text-white px-3 py-1 rounded-full hover:bg-pink-600 transition-colors shadow-sm"
                  >
                    ⏭️ Xem ngay
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Chữ ký */}
        {isTypingComplete && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 100,
              delay: 0.3 
            }}
            className="flex-shrink-0 pt-6 mt-2"
          >
            <div className="text-center border-t border-pink-200 pt-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="inline-block"
              >
                <div className="text-gray-600 font-serif">
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-xs text-gray-400 mt-1"
                  >
                    🎂 HAPPY BIRTHDAY 🎂
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BirthdayCard;