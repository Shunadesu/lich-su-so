import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useScrollToTop from '../hooks/useScrollToTop';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { scrollToTop } = useScrollToTop();

  useEffect(() => {
    // Cuộn nhẹ nhàng lên đầu trang khi pathname thay đổi
    scrollToTop('smooth');
  }, [pathname, scrollToTop]);

  return null; // Component này không render gì
};

export default ScrollToTop; 