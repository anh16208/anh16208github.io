import { useEffect } from 'react';
import BirthdayPage from './pages/BirthdayPage';
import audioService from './services/AudioService';

function App() {
  useEffect(() => {
    console.log('🎵 App starting, initializing audio service');
    
    // Khởi tạo audio service
    audioService.initialize().then(() => {
      console.log('✅ Audio service ready');
    }).catch((error: Error) => {
      console.log('Audio service init error:', error.message);
    });
    
    // Tạo auto-interaction
    const triggerAutoInteraction = () => {
      console.log('Triggering auto-interaction for audio');
      
      // Tạo sự kiện tương tác ảo
      const events = ['click', 'mousedown', 'touchstart'];
      events.forEach(eventType => {
        const event = new Event(eventType, { bubbles: true });
        document.dispatchEvent(event);
      });
      
      // Thêm một click ảo
      setTimeout(() => {
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        document.documentElement.dispatchEvent(clickEvent);
      }, 300);
    };
    
    // Trigger sau 1 giây
    setTimeout(triggerAutoInteraction, 1000);
  }, []);

  return <BirthdayPage />;
}

export default App;