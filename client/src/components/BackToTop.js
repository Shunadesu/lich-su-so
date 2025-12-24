import { useState, useEffect } from 'react';
import { ChevronUp, Gift } from 'lucide-react';
import useScrollToTop from '../hooks/useScrollToTop';
import SunnyPopup from './SunnyPopup';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSunnyPopup, setShowSunnyPopup] = useState(false);
  const { scrollToTop } = useScrollToTop();

  // Kiểm tra khi nào hiển thị nút
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const handleClick = () => {
    scrollToTop('smooth');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-24 right-8 z-50 flex flex-col items-center gap-2">
        {/* Sunny gift button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowSunnyPopup(true);
          }}
          className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full shadow-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          aria-label="Gift"
          title=""
        >
          <Gift className="w-6 h-6 mx-auto" />
        </button>
        
        {/* Back to top button */}
        <button
          onClick={handleClick}
          className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full shadow-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 back-to-top-enter"
          aria-label="Cuộn lên đầu trang"
        >
          <ChevronUp className="w-6 h-6 mx-auto" />
        </button>
      </div>

      {/* Sunny Popup */}
      <SunnyPopup isOpen={showSunnyPopup} onClose={() => setShowSunnyPopup(false)} />
    </>
  );
};

export default BackToTop; 