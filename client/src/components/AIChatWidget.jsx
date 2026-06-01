import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, Search, Bot, User, BookOpen, Calendar, Info, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Common Q&A pairs for simple questions - Comprehensive Vietnamese History Q&A
const commonQA = {
  // ============================================
  // CHÀO HỎI & XÃ GIAO
  // ============================================
  'xin chào': 'Xin chào! 👋 Tôi là trợ lý tìm bài giảng. Bạn cần tìm tài liệu gì hôm nay?',
  'chào bạn': 'Chào bạn! 👋 Rất vui được hỗ trợ bạn tìm bài giảng lịch sử.',
  'chào': 'Chào bạn! 😊 Tôi có thể giúp gì cho bạn hôm nay?',
  'hi': 'Hi! 👋 Bạn cần tìm bài giảng gì?',
  'hey': 'Hey! 😊 Sẵn sàng giúp bạn tìm tài liệu rồi đây!',
  'hello': 'Hello! 👋 Chào mừng bạn đến với hệ thống tìm bài giảng.',
  'tạm biệt': 'Tạm biệt! 👋 Hẹn gặp lại bạn nhé. Chúc bạn học tốt!',
  'cám ơn': 'Không có chi! 😊 Rất vui được giúp bạn.',
  'thank you': 'You\'re welcome! 😊 I\'m happy to help!',
  'good morning': 'Chào buổi sáng! ☀️ Bạn đã sẵn sàng học chưa?',
  'good afternoon': 'Chào buổi trưa! 🌤️ Nghỉ ngơi đã rồi tiếp tục học nhé!',
  'good evening': 'Chào buổi tối! 🌙 Dạo này bạn học thế nào rồi?',
  'ngủ ngon': 'Ngủ ngon! 🌙 Nghỉ ngơi đầy đủ để học tốt hơn nhé!',
  'chúc may mắn': 'Chúc bạn may mắn! 🍀 Nếu cần tìm tài liệu, cứ hỏi tôi!',
  'chúc mừng': 'Cảm ơn bạn! 🎉 Chúc bạn một ngày vui vẻ!',
  'rất vui': 'Tôi cũng vậy! 😊 Rất vui được giúp bạn tìm bài giảng.',
  'nice to meet': 'Rất vui được gặp bạn! 🤝 Tôi sẵn sàng hỗ trợ bạn.',
  'hẹn gặp lại': 'Hẹn gặp lại! 👋 Ghé thăm khi cần tìm tài liệu nhé!',

  // ============================================
  // NGÀY/GIỜ & THỜI GIAN
  // ============================================
  'hôm nay là ngày mấy': `Hôm nay là ngày ${new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`,
  'bây giờ là mấy giờ': `Bây giờ là ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}.`,
  'ngày mai': 'Ngày mai là một ngày mới! Bạn có muốn tìm bài giảng cho ngày mai không? 😊',
  'hôm qua': 'Hôm qua đã qua rồi! Quantr tam tương lai. Bạn cần tìm tài liệu gì hôm nay?',
  'mấy giờ rồi': `Bây giờ là ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}.`,
  'thứ mấy': `Hôm nay là ${new Date().toLocaleDateString('vi-VN', { weekday: 'long' })}.`,
  'ngày bao nhiêu': `Hôm nay là ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}.`,

  // ============================================
  // VỀ WEBSITE & ỨNG DỤNG
  // ============================================
  'web là gì': 'Đây là trang web Lịch Sử Số - nơi chia sẻ tài liệu, bài giảng lịch sử miễn phí cho học sinh Việt Nam. 📚',
  'trang web này là gì': 'Đây là nền tảng học tập trực tuyến về lịch sử, giúp bạn tìm kiếm bài giảng, tài liệu ôn thi một cách dễ dàng. 📖',
  'website là gì': 'Website Lịch Sử Số là nơi tổng hợp bài giảng lịch sử từ lớp 10 đến lớp 12, phục vụ việc học tập và ôn thi. 🎓',
  'tính năng': 'Tính năng chính: Tìm kiếm bài giảng theo chủ đề, lớp học, bộ môn. Bạn có thể tìm tài liệu ôn thi THPT Quốc gia. 🔍',
  'app có gì': 'App có: Danh sách bài giảng, tìm kiếm nhanh, tài liệu ôn thi, và nhiều chủ đề lịch sử thú vị. Khám phá ngay! ✨',
  'ứng dụng là gì': 'Đây là ứng dụng học lịch sử trực tuyến, giúp bạn tìm bài giảng và tài liệu ôn thi một cách thuận tiện. 📱',
  'app này': 'App Lịch Sử Số giúp bạn học lịch sử Việt Nam và thế giới dễ dàng hơn. 📖',
  'website này': 'Website Lịch Sử Số là nơi học sinh Việt Nam tìm tài liệu lịch sử miễn phí. 🎓',
  'lịch sử số': 'Lịch Sử Số là nền tảng học tập lịch sử trực tuyến, giúp bạn tìm bài giảng, tài liệu ôn thi nhanh chóng. 📚',
  'mục đích': 'Mục đích của trang web là giúp học sinh Việt Nam tiếp cận tài liệu lịch sử một cách dễ dàng và miễn phí. 🎯',
  'ai là gì': 'Tôi là trợ lý AI của Lịch Sử Số! 🤖 Tôi có thể giúp bạn tìm bài giảng và trả lời các câu hỏi đơn giản.',

  // ============================================
  // HƯỚNG DẪN SỬ DỤNG
  // ============================================
  'cách tìm bài giảng': 'Bạn có thể: 1) Nhập từ khóa vào ô tìm kiếm, 2) Chọn lớp học (10, 11, 12), 3) Chọn chủ đề cụ thể. Tôi sẽ hỗ trợ bạn! 📝',
  'làm sao tìm': 'Để tìm bài giảng, bạn hãy nhập chủ đề muốn tìm vào ô chat, ví dụ: "bài giảng lịch sử lớp 12". Tôi sẽ chuyển bạn đến kết quả! 🔎',
  'tìm như thế nào': 'Rất đơn giản! Gõ từ khóa vào ô nhập và nhấn gửi. Ví dụ: "chiến tranh Việt Nam" hoặc "ôn thi THPT". 🚀',
  'cách sử dụng': 'Nhập chủ đề bạn muốn tìm vào ô chat và nhấn gửi. Tôi sẽ chuyển bạn đến trang kết quả tìm kiếm. 😊',
  'hướng dẫn': 'Để tìm bài giảng: 1) Gõ từ khóa, 2) Nhấn Enter hoặc nút gửi, 3) Xem kết quả. Đơn giản phải không? 👍',
  'cách đăng nhập': 'Bạn có thể đăng nhập bằng email hoặc tài khoản mạng xã hội. Nếu chưa có tài khoản, hãy đăng ký mới! 🔐',
  'đăng ký': 'Để đăng ký, click vào nút "Đăng ký" và điền thông tin. Sau khi đăng ký, bạn có thể lưu bài giảng yêu thích! ✍️',
  'quên mật khẩu': 'Click vào "Quên mật khẩu" ở trang đăng nhập, nhập email đã đăng ký và làm theo hướng dẫn trong email. 📧',
  'tải về': 'Bạn có thể tải bài giảng về máy để học offline. Click vào biểu tượng tải về trên trang bài giảng. 📥',
  'lưu bài': 'Sau khi đăng nhập, bạn có thể lưu bài giảng yêu thích bằng cách click vào biểu tượng trái tim. ❤️',

  // ============================================
  // NỘI DUNG & TÀI LIỆU
  // ============================================
  'có miễn phí không': 'Hoàn toàn miễn phí! 🎉 Bạn có thể xem và tải tài liệu mà không cần trả phí.',
  'miễn phí không': 'Đúng vậy! Tất cả tài liệu trên trang đều miễn phí 100%. Chúc bạn học tốt! 🎁',
  'có tài liệu lớp 12 không': 'Có chứ! Trang web có đầy đủ bài giảng lịch sử lớp 12, bao gồm các chủ đề: Việt Nam từ 1945-1975, Việt Nam sau 1975... 📚',
  'có bài ôn thi không': 'Có rất nhiều! Bạn có thể tìm "ôn thi THPT", "ôn thi lịch sử" để xem các tài liệu ôn tập. Good luck! 🍀',
  'tài liệu lớp 10': 'Có đầy đủ! Lớp 10 có các bài về: Cách mạng tháng Tám, Chiến tranh giành độc lập, và nhiều chủ đề khác. 📖',
  'tài liệu lớp 11': 'Lớp 11 có các chủ đề về: Lịch sử thế giới, Cách mạng tư sản, và nhiều bài giảng hấp dẫn khác. 🌍',
  'tài liệu thpt': 'THPT có rất nhiều tài liệu ôn thi! Tìm ngay "ôn thi THPT" hoặc "ôn thi lịch sử" để xem. 🎯',
  'bài giảng mới': 'Website thường xuyên cập nhật bài giảng mới. Bạn nên kiểm tra thường xuyên để không bỏ lỡ! ⭐',
  'có video không': 'Hiện tại website chủ yếu có tài liệu dạng văn bản. Bạn có thể tìm các bài giảng chi tiết tại đây. 🎬',
  'có tài liệu pdf không': 'Nhiều tài liệu có thể tải về dạng PDF. Bạn thử tìm kiếm với từ khóa cụ thể nhé! 📄',
  'đếm bao nhiêu bài': 'Website có rất nhiều bài giảng từ lớp 10 đến lớp 12. Con số cụ thể thay đổi theo thời gian. 🔢',

  // ============================================
  // HỖ TRỢ & TRỢ GIÚP
  // ============================================
  'giúp tôi': 'Tôi đây! 😊 Bạn cứ hỏi tôi về bất kỳ chủ đề lịch sử nào, tôi sẽ tìm bài giảng phù hợp cho bạn.',
  'bạn là ai': 'Tôi là trợ lý AI của trang Lịch Sử Số! 🤖 Tôi có thể giúp bạn tìm bài giảng, tài liệu học tập một cách nhanh chóng.',
  'tôi cần giúp': 'Đừng lo! 👋 Hãy cho tôi biết bạn cần tìm gì - ví dụ: "bài giảng lịch sử thế giới" hay "ôn thi lớp 12".',
  'help': 'I\'m here to help! 😊 Just tell me what history topic you need, and I\'ll find the right lesson for you.',
  'trợ giúp': 'Tôi sẵn sàng trợ giúp! 👋 Bạn cứ hỏi tôi về bất kỳ chủ đề nào liên quan đến lịch sử.',
  'hỗ trợ': 'Tôi có thể hỗ trợ bạn tìm bài giảng, trả lời câu hỏi về lịch sử, và hướng dẫn sử dụng website. 💪',
  'liên hệ': 'Bạn có thể liên hệ qua email hoặc form liên hệ trên website. Đội ngũ sẽ hỗ trợ bạn sớm nhất có thể! 📧',
  'feedback': 'Cảm ơn bạn đã quan tâm! Bạn có thể gửi ý kiến đóng góp qua mục liên hệ trên website. 📝',
  'báo lỗi': 'Xin lỗi vì sự bất tiện này! 😔 Bạn có thể mô tả lỗi để tôi hỗ trợ, hoặc gửi báo cáo qua mục liên hệ.',
  'góp ý': 'Rất mong nhận được góp ý của bạn! 📧 Gửi ý kiến qua email hoặc form liên hệ trên website nhé.',
  'phản hồi': 'Cảm ơn bạn đã phản hồi! 💬 Chúng tôi luôn lắng nghe để cải thiện dịch vụ.',

  // ============================================
  // GỢI Ý & KHUYẾN NGHỊ
  // ============================================
  'gợi ý': 'Bạn có thể thử: "bài giảng lịch sử lớp 12", "chiến tranh Việt Nam", "ôn thi THPT", hoặc "Hồ Chí Minh". Khám phá ngay! 🌟',
  'có gì mới': 'Website thường xuyên cập nhật bài giảng mới! Bạn nên thường xuyên ghé thăm để cập nhật tài liệu mới nhất. 📰',
  'nên xem gì': 'Tôi gợi ý: "Bài giảng lịch sử lớp 12" để ôn thi, hoặc "Chiến tranh Việt Nam" để hiểu sâu hơn về lịch sử. 📖',
  'nên học gì': 'Tùy vào mục tiêu của bạn! Nếu ôn thi: tập trung lớp 12. Nếu muốn hiểu sâu: thử "Hồ Chí Minh" hoặc "Chiến tranh Việt Nam". 📚',
  'ưu tiên học': 'Ưu tiên học các chủ đề trọng tâm trong đề thi: Lịch sử Việt Nam 1945-1975, Đảng Cộng sản, và Hồ Chí Minh. 🎯',
  'mẹo học': 'Mẹo học lịch sử: 1) Hiểu logic, đừng chỉ học thuộc, 2) Làm timeline, 3) Liên hệ thực tế, 4) Luyện đề thường xuyên. 💡',
  'cách nhớ': 'Để nhớ lâu: 1) Học theo sơ đồ/timeline, 2) Liên kết sự kiện với nhau, 3) Ôn tập định kỳ, 4) Dạy lại cho người khác. 🧠',

  // ============================================
  // TRIỀU ĐẠI VIỆT NAM
  // ============================================
  'thời kỳ': 'Việt Nam có nhiều thời kỳ lịch sử: Tiền sử, Cổ đại, Bắc thuộc, Xã hội phong kiến, Cận đại, Hiện đại. Bạn quan tâm thời kỳ nào? 📜',
  'hiện đại': 'Thời kỳ Hiện đại (từ 1945) bắt đầu từ Cách mạng tháng Tám đến nay, với nhiều thành tựu to lớn của dân tộc. 🇻🇳',
  'triều đại': 'Việt Nam có nhiều triều đại rực rỡ: Hùng Vương, Lý, Trần, Lê, Nguyễn... Mỗi triều đại đều có những đóng góp quan trọng. 👑',
  'nhà hùng vương': 'Nhà Hùng Vương (2879-258 TCN) là triều đại khai sinh quốc gia Việt Nam, tồn tại hơn 2000 năm với 18 đời vua. 🏛️',
  'nhà lý': 'Nhà Lý (1009-1225) - Thời kỳ Thăng Long rực rỡ, xây dựng Văn Miếu - Quốc Tử Giám đầu tiên. 📜',
  'nhà trần': 'Nhà Trần (1225-1400) - Thời đại chống Nguyên Mông huy hoàng với 3 lần chiến thắng. ⚔️',
  'nhà hồ': 'Nhà Hồ (1400-1407) - Ngắn ngủi nhưng có Hoàng Lê nhất thống chí và sáng tạo ra tiền giấy đầu tiên. 💰',
  'nhà lê': 'Nhà Hậu Lê (1428-1789) - Thời kỳ phục hưng văn hóa dân tộc, Nguyễn Trãi, Lê Lợi, Lê Thánh Tông. 🎭',
  'nhà nguyễn': 'Nhà Nguyễn (1802-1945) - Triều đại cuối cùng của Việt Nam, bắt đầu từ Gia Long đến Bảo Đại. 👑',
  'nhà lê sơ': 'Nhà Lê sơ (1428-1527) với các vua Lê Thái Tổ, Lê Thánh Tông - thời kỳ hoàng kim của nền văn hóa Việt Nam. ⭐',
  'nhà tây sơn': 'Nhà Tây Sơn (1778-1802) với anh em Nguyễn Huệ, thời kỳ thống nhất đất nước và chống triều đình phong kiến. 🏴',
  'chiến tranh lê': 'Chiến tranh Lê - Trịnh (1627-1672) là cuộc nội chiến kéo dài giữa họ Trịnh ở phía Bắc và họ Nguyễn ở phía Nam. ⚔️',

  // ============================================
  // NHÂN VẬT LỊCH SỬ VIỆT NAM
  // ============================================
  'hồ chí minh': 'Chủ tịch Hồ Chí Minh (1890-1969) - Người sáng lập Đảng Cộng sản Việt Nam, vị lãnh tụ vĩ đại của dân tộc. 🇻🇳',
  'bác hồ': 'Bác Hồ là lãnh tụ vĩ đại của Việt Nam. Tìm tài liệu về Bác: "Hồ Chí Minh", "Đường lối của Đảng", "Cách mạng tháng Tám". 📖',
  'nguyễn huệ': 'Nguyễn Huệ (1753-1792) - Hoàng đế Quang Trung, anh hùng dân tộc, đại phá quân Thanh năm 1789. ⚔️',
  'trần hưng đạo': 'Trần Hưng Đạo (1228-1300) - Tổng thống quân sự ba lần đánh bại quân Nguyên Mông, anh hùng dân tộc. 🗡️',
  'lê lợi': 'Lê Lợi (1385-1433) - Vua Lê Thái Tổ, khởi nghĩa Lam Sơn chống quân Minh, giành lại độc lập cho dân tộc. 🏴',
  'nguyễn trãi': 'Nguyễn Trãi (1380-1442) - Nhà quân sự, nhà văn hóa lớn, "Anh hùng tổ quốc ta" trong bộ Quân trung từ mệnh tập. 📜',
  'trần nhân tông': 'Trần Nhân Tông (1258-1278) - Vị vua trẻ nhất và tài giỏi, lập nhiều chiến công chống quân Nguyên. 👑',
  'lê thánh tông': 'Lê Thánh Tông (1442-1497) - Vị vua anh minh nhất thời Lê sơ, mở rộng bờ cõi, phát triển văn hóa. 📚',
  'quang trung': 'Quang Trung (Nguyễn Huệ) - Hoàng đế anh hùng, đại phá quân Thanh, thống nhất đất nước. ⚔️',
  'triệu việt vương': 'Triệu Việt Vương - Nhà triều đình nhà Trần, con trai Trần Hưng Đạo, góp phần bảo vệ đất nước. 🛡️',
  'ngô quyền': 'Ngô Quyền (898-944) - Anh hùng dân tộc, đánh bại quân Nam Hán trong trận lịch sử trên sông Bạch Đằng. 🌊',
  'đinh tiên hoàng': 'Đinh Tiên Hoàng (924-979) - Vị vua đầu tiên của Việt Nam, xưng đế, đặt kinh đô ở Hoa Lư. 👑',
  'lý thái tổ': 'Lý Thái Tổ (974-1028) - Kinh đô Thăng Long, thành lập nhà Lý, mở ra thời kỳ phát triển rực rỡ. 🏯',
  'lý thường kiệt': 'Lý Thường Kiệt (1019-1105) - Danh tướng nhà Lý, đánh bại quân Tống trong chiến tranh 1075-1077. ⚔️',
  'hoàng đế': 'Việt Nam có nhiều hoàng đế anh minh: Hùng Vương, Đinh Tiên Hoàng, Lý Thái Tổ, Trần Thánh Tông, Lê Thánh Tông... 👑',
  'vua': 'Việt Nam có nhiều vị vua anh minh. Bạn quan tâm đến vị vua nào? Tôi có thể tìm tài liệu cho bạn! 📖',

  // ============================================
  // SỰ KIỆN LỊCH SỬ VIỆT NAM
  // ============================================
  'cách mạng tháng tám': 'Cách mạng tháng Tám 1945 thành công ngày 2/9/1945, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn độc lập tại Quảng trường Ba Đình. 🇻🇳',
  'tuyên ngôn độc lập': 'Tuyên ngôn độc lập được Chủ tịch Hồ Chí Minh đọc ngày 2/9/1945 tại Quảng trường Ba Đình, khai sinh nước Việt Nam Dân chủ Cộng hòa. 🎉',
  'ba đình': 'Quảng trường Ba Đình - Nơi Chủ tịch Hồ Chí Minh đọc Tuyên ngôn độc lập ngày 2/9/1945, biểu tượng của tinh thần dân tộc. 🏛️',
  'điện biên phủ': 'Chiến dịch Điện Biên Phủ (13/3 - 7/5/1954) - Chiến thắng vĩ đại của quân dân Việt Nam, kết thúc thắng lợi cuộc kháng chiến chống Pháp. 🏔️',
  'chiến thắng điện biên phủ': 'Chiến thắng Điện Biên Phủ là chiến thắng vĩ đại, đánh bại hoàn toàn quân Pháp, buộc Pháp ký Hiệp định Geneva. 🏆',
  'kháng chiến chống pháp': 'Kháng chiến chống Pháp (1945-1954) bắt đầu sau Cách mạng tháng Tám, kết thúc với Chiến thắng Điện Biên Phủ. ⚔️',
  'kháng chiến chống mỹ': 'Kháng chiến chống Mỹ (1955-1975) - Cuộc chiến tranh bảo vệ Tổ quốc, kết thúc với Chiến dịch Hồ Chí Minh lịch sử. 🕊️',
  'chiến tranh việt nam': 'Chiến tranh Việt Nam (1955-1975) - Cuộc chiến tranh giành độc lập thống nhất đất nước, kết thúc ngày 30/4/1975. 🕊️',
  'thống nhất đất nước': 'Ngày 30/4/1975 - Chiến thắng hoàn toàn, thống nhất đất nước sau gần 100 năm chia cắt Bắc - Nam. 🇻🇳',
  '30 tháng 4': 'Ngày 30/4/1975 - Ngày Giải phóng miền Nam, thống nhất đất nước, kết thúc Chiến tranh Việt Nam. 🎊',
  'ngày chiến thắng': 'Ngày Chiến thắng 30/4 (1975) - Ngày miền Nam được giải phóng, đất nước thống nhất. 🏆',
  'giải phóng miền nam': 'Ngày 30/4/1975 - Sự kiện lịch sử vĩ đại, giải phóng miền Nam, thống nhất đất nước. 🎉',
  'bắc thuộc': 'Thời kỳ Bắc thuộc (111 TCN - 938 SCN) kéo dài hơn 1000 năm, nhân dân Việt Nam giữ gìn bản sắc dân tộc và giành lại độc lập. 🏛️',
  'nam thuộc': 'Thời kỳ Bắc thuộc lần I (111-40 TCN) và lần II (43-543), lần III (603-905) dưới các triều đại phong kiến Trung Quốc. 🏯',
  'khởi nghĩa lam sơn': 'Khởi nghĩa Lam Sơn (1413-1427) do Lê Lợi lãnh đạo, đánh đuổi quân Minh, giành độc lập cho dân tộc. 🏴',
  'chiến thắng bạch đằng': 'Trận Bạch Đằng (938) - Ngô Quyền đánh bại quân Nam Hán bằng cách cắm cọc gỗ xuống sông Bạch Đằng. 🌊',
  'chống nguyên mông': 'Ba lần chống quân Nguyên Mông xâm lược (1285, 1287-1288, 1306) - Trần Hưng Đạo và quân dân Việt Nam ba lần chiến thắng. ⚔️',
  'đánh tan quân thanh': 'Chiến thắng Ngọc Hồi - Đống Đa (1789) - Quang Trung đại phá 290.000 quân Thanh xâm lược. 🏴',
  'ngọc hồi đống đa': 'Chiến thắng Ngọc Hồi - Đống Đa (Tết Kỷ Dậu 1789) - Quang Trung đại phá quân Thanh, bảo vệ nền độc lập. ⚔️',
  'pháp đánh việt nam': 'Thực dân Pháp xâm lược Việt Nam từ 1858, bắt đầu bằng cuộc tấn công Đà Nẵng và kết thúc bằng việc đánh bại Pháp năm 1954. 🏴',
  'trận rừng lá': 'Trận Rừng Lá (1947) - Chiến thắng quân Pháp của Việt Minh trong chiến tranh Đông Dương. 🌲',
  'trận điện biên phủ': 'Trận Điện Biên Phủ (1954) - Trận đánh quyết định, kết thúc cuộc kháng chiến chống Pháp. 🏔️',
  'hiệp định geneva': 'Hiệp định Geneva (1954) - Kết thúc cuộc kháng chiến chống Pháp, chia cắt Việt Nam tạm thời ở vĩ tuyến 17. 📜',
  'hiệp định paris': 'Hiệp định Paris (1973) - Mỹ ký kết chấm dứt can thiệp quân sự tại Việt Nam. 📜',
  'mậu thân': 'Sự kiện Tết Mậu Thân (1968) - Tổng tiến công và nổi dậy trên toàn miền Nam Việt Nam. ⚔️',
  'tết mậu thân': 'Sự kiện Tết Mậu Thân (30/1/1968) - Chiến dịch tổng tiến công lịch sử của quân Giải phóng miền Nam. 🎆',
  'đường trường sơn': 'Đường Trường Sơn - Con đường huyền thoại, con đường tiếp tế cho chiến trường miền Nam trong kháng chiến chống Mỹ. 🛤️',
  'chiến dịch hồ chí minh': 'Chiến dịch Hồ Chí Minh (30/4/1975) - Cuộc tổng tiến công giải phóng Sài Gòn, kết thúc chiến tranh. 🏆',

  // ============================================
  // LỊCH SỬ THẾ GIỚI
  // ============================================
  'lịch sử thế giới': 'Lịch sử thế giới rất phong phú! Tìm tài liệu về: Chiến tranh thế giới, Cách mạng Pháp, Cách mạng Nga, Thế chiến I, Thế chiến II... 🌍',
  'chiến tranh thế giới': 'Có hai cuộc chiến tranh thế giới: Thế chiến I (1914-1918) và Thế chiến II (1939-1945). Bạn quan tâm cuộc chiến nào? 🌐',
  'thế chiến': 'Thế chiến I (1914-1918) và Thế chiến II (1939-1945) là hai cuộc chiến tranh tàn khốc nhất lịch sử nhân loại. 💥',
  'thế chiến 1': 'Thế chiến I (1914-1918) bắt đầu với vụ ám sát Archduke Franz Ferdinand, kết thúc với sự sụp đổ của nhiều đế chế. 🏰',
  'thế chiến 2': 'Thế chiến II (1939-1945) - Chiến tranh toàn cầu, kết thúc bằng việc Mỹ ném bom nguyên tử xuống Nhật Bản. ☢️',
  'chiến tranh lạnh': 'Chiến tranh Lạnh (1947-1991) - Cuộc đối đầu giữa Mỹ và Liên Xô, không có chiến tranh trực tiếp nhưng căng thẳng toàn cầu. ❄️',
  'cách mạng pháp': 'Cách mạng Pháp (1789) - Phong trào lật đổ chế độ phong kiến, khởi nguồn cho các phong trào dân chủ trên thế giới. 🇫🇷',
  'cách mạng nga': 'Cách mạng Nga (1917) - Lật đổ chế độ Sa hoàng, thành lập Liên Xô, mở ra thời đại mới cho phong trào cộng sản. 🇷🇺',
  'cách mạng công nghiệp': 'Cách mạng Công nghiệp (thế kỷ 18-19) - Chuyển đổi từ nền kinh tế nông nghiệp sang công nghiệp, đánh dấu bước tiến lớn của nhân loại. ⚙️',
  'trung cổ': 'Thời kỳ Trung cổ (thế kỷ 5-15) - Thời kỳ phong kiến, đặc trưng bởi hệ thống phong kiến và sự thống trị của Giáo hội ở châu Âu. 🏰',
  'cổ đại': 'Thời kỳ Cổ đại - Nền văn minh Hy Lạp, La Mã, Ai Cập, Trung Quốc... Nền móng cho văn minh nhân loại. 🏛️',
  'hy lạp cổ đại': 'Hy Lạp Cổ đại - Nơi khởi nguồn dân chủ, triết học, nghệ thuật với các nhân vật như Socrates, Plato, Aristotle. 🏺',
  'la mã': 'Đế chế La Mã (27 TCN - 476 SCN) - Một trong những đế chế vĩ đại nhất lịch sử, ảnh hưởng sâu rộng đến văn minh phương Tây. 🏛️',
  'napoleon': 'Napoléon Bonaparte (1769-1821) - Hoàng đế Pháp, nhà quân sự thiên tài, có ảnh hưởng lớn đến lịch sử châu Âu. ⚔️',
  'hitler': 'Adolf Hitler (1889-1945) - Nhà độc tài Đức, gây ra Thế chiến II và Holocaust. Lịch sử cảnh báo về chủ nghĩa phát xít. 💀',
  'stalin': 'Joseph Stalin (1878-1953) - Lãnh đạo Liên Xô, có vai trò quan trọng trong Thế chiến II nhưng cũng gây tranh cãi về các chính sách. 🏛️',
  'churchill': 'Winston Churchill (1874-1965) - Thủ tướng Anh, lãnh đạo Anh chống phát xít Đức trong Thế chiến II. 🇬🇧',
  'roosevelt': 'Franklin D. Roosevelt (1882-1945) - Tổng thống Mỹ, lãnh đạo Mỹ trong Thế chiến II và thiết lập trật tự thế giới mới. 🇺🇸',
  'marilyn': 'Mục đích của bạn là hỏi về Marilyn Monroe? Bạn có thể hỏi về nhân vật lịch sử cụ thể hơn nhé! 😊',

  // ============================================
  // ĐẢNG CỘNG SẢN VIỆT NAM
  // ============================================
  'đảng cộng sản': 'Đảng Cộng sản Việt Nam được thành lập ngày 3/2/1930 với tên gọi Đảng Cộng sản Việt Nam, do Chủ tịch Hồ Chí Minh sáng lập. 🏛️',
  'thành lập đảng': 'Đảng Cộng sản Việt Nam thành lập ngày 3/2/1930. Đây là sự kiện lịch sử trọng đại của dân tộc Việt Nam. 🎊',
  'ngày thành lập đảng': 'Ngày 3/2 hàng năm là kỷ niệm ngày thành lập Đảng Cộng sản Việt Nam (3/2/1930). 🏴',
  'đảng csvn': 'Đảng Cộng sản Việt Nam - Đảng lãnh đạo nhân dân Việt Nam giành độc lập, thống nhất đất nước và xây dựng chủ nghĩa xã hội. 🏛️',
  'đường lối đảng': 'Đường lối của Đảng Cộng sản Việt Nam: Độc lập dân tộc gắn liền với chủ nghĩa xã hội. Tìm hiểu thêm trong các bài giảng! 📖',
  'việt minh': 'Việt Minh (Việt Nam Độc lập Đồng minh Hội) - Tổ chức do Hồ Chí Minh sáng lập, lãnh đạo nhân dân kháng chiến chống Pháp. 🏴',
  'hội nghị diên bien': 'Hội nghị Diên Biên (1941) - Hội nghị của Đảng, quyết định phát động tổng khởi nghĩa giành chính quyền. 🏔️',
  'đại hội đảng': 'Đại hội Đảng Cộng sản Việt Nam được tổ chức định kỳ 5 năm/lần, đề ra đường lối, chính sách cho từng giai đoạn. 📜',
  'bác hồ và đảng': 'Chủ tịch Hồ Chí Minh là người sáng lập và lãnh đạo Đảng Cộng sản Việt Nam, vị lãnh tụ vĩ đại của dân tộc. 🇻🇳',

  // ============================================
  // ÔN THI & KỲ THI
  // ============================================
  'ôn thi': 'Để ôn thi hiệu quả: 1) Nắm chắc kiến thức trọng tâm, 2) Làm đề thi thử, 3) Học theo timeline, 4) Ghi nhớ ngày tháng quan trọng. Good luck! 🍀',
  'ôn thi thpt': 'Ôn thi THPT: Tập trung vào Lịch sử Việt Nam 1945-1975, Đảng Cộng sản, Hồ Chí Minh, và các sự kiện trọng tâm. Bạn cần tìm tài liệu ôn thi? 📚',
  'thi thpt quốc gia': 'Kỳ thi THPT Quốc gia là kỳ thi quan trọng. Hãy ôn tập kỹ: Lịch sử Việt Nam hiện đại, các triều đại, và sự kiện lịch sử thế giới. 🎯',
  'đề thi': 'Bạn có thể tìm các đề thi thử và đề thi các năm trước trên website. Gõ "đề thi" hoặc "ôn thi" để tìm tài liệu! 📝',
  'môn lịch sử': 'Môn Lịch sử trong kỳ thi THPT bao gồm: Lịch sử Việt Nam và Lịch sử thế giới. Phần Việt Nam chiếm ưu tiên hơn. 📖',
  'cấu trúc đề thi': 'Đề thi Lịch sử THPT gồm: Trắc nghiệm (40 câu), thời gian 50 phút, kiến thức lớp 11 và 12. ⏰',
  'trọng tâm thi': 'Trọng tâm ôn thi: Cách mạng tháng Tám, Kháng chiến chống Pháp, Kháng chiến chống Mỹ, Đảng Cộng sản, Hồ Chí Minh. 🎯',
  'làm sao ôn thi': 'Cách ôn thi hiệu quả: 1) Học theo sơ đồ, 2) Lập timeline các sự kiện, 3) Làm đề thi thử, 4) Ôn lại định kỳ. Bạn có thể tìm tài liệu ôn thi tại đây! 📚',
  'thời gian ôn thi': 'Nên ôn thi từ sớm, ít nhất 2-3 tháng trước kỳ thi. Chia nhỏ kiến thức, ôn tập đều đặn mỗi ngày. ⏳',
  'tài liệu ôn': 'Website có nhiều tài liệu ôn thi lịch sử. Bạn thử tìm: "ôn thi THPT", "tài liệu lớp 12", hoặc "đề thi thử" nhé! 📚',
  'thi đại học': 'Thi đại học khối C (Lịch sử) yêu cầu kiến thức sâu rộng. Ôn tập kỹ từ lớp 10 đến lớp 12 nhé! 🎓',
  'điểm thi': 'Điểm thi sẽ được công bố sau kỳ thi THPT Quốc gia. Bạn có thể tra cứu kết quả trên website của Bộ GD&ĐT. 📊',
  'học lớp 12': 'Lớp 12 là năm học quan trọng nhất với nhiều kiến thức trọng tâm cho kỳ thi THPT. Hãy tập trung ôn tập! 📚',
  'bài văn mẫu': 'Phần tự luận trong đề thi Lịch sử yêu cầu trình bày logic, có luận điểm, luận cứ rõ ràng. Hãy thực hành viết nhiều! ✍️',
  'cách trả lời': 'Cách trả lời câu hỏi lịch sử: 1) Đọc kỹ đề, 2) Xác định thời gian, không gian, 3) Trình bày theo timeline, 4) Liên hệ ý nghĩa, 5) Kết luận. 📝',

  // ============================================
  // CHỦ ĐỀ HỌC TẬP
  // ============================================
  'học lịch sử': 'Học lịch sử giúp hiểu quá khứ, rút kinh nghiệm cho tương lai. Tìm bài giảng ngay để bắt đầu học! 📖',
  'tại sao học lịch sử': 'Học lịch sử để: Hiểu về dân tộc mình, tôn vinh truyền thống, rút kinh nghiệm, và chuẩn bị cho kỳ thi. 🇻🇳',
  'cách học': 'Cách học hiệu quả: 1) Chủ động, đừng thụ động, 2) Liên kết sự kiện với nhau, 3) Sử dụng sơ đồ/timeline, 4) Thực hành thường xuyên. 📚',
  'học online': 'Bạn có thể học lịch sử online ngay tại website này! Tìm bài giảng, tài liệu ôn thi mọi lúc mọi nơi. 💻',
  'tự học': 'Tự học lịch sử: 1) Đọc sách giáo khoa, 2) Xem bài giảng online, 3) Làm đề thi thử, 4) Ghi chép, 5) Ôn tập định kỳ. 📝',
  'phương pháp học': 'Phương pháp học hiệu quả: Học chủ động, ghi chép, sơ đồ hóa, ôn tập ngắn và đều, học nhóm. 💡',
  'sách lịch sử': 'Sách giáo khoa Lịch sử lớp 10, 11, 12 là nguồn kiến thức chính thống. Ngoài ra còn có nhiều sách tham khảo hay! 📚',
  'sách hay': 'Một số sách lịch sử hay: Sách giáo khoa các lớp, "Lịch sử Việt Nam" của Đinh Xuân Lâm, "Những chặng đường lịch sử" của Hồ Chí Minh. 📖',
  'video bài giảng': 'Nhiều bài giảng có hình ảnh minh họa sinh động. Bạn có thể tìm các bài giảng chi tiết tại đây! 🎬',
  'website học': 'Website Lịch Sử Số là nơi học tập tuyệt vời với nhiều tài liệu miễn phí. Hãy khám phá ngay! 🌟',

  // ============================================
  // CÁC TRIỀU ĐẠI & THỜI KỲ
  // ============================================
  'thời kỳ': 'Việt Nam có nhiều thời kỳ lịch sử: Tiền sử, Cổ đại, Bắc thuộc, Xã hội phong kiến, Cận đại, Hiện đại. Bạn quan tâm thời kỳ nào? 📜',
  'tiền sử': 'Thời kỳ Tiền sử Việt Nam bắt đầu từ khoảng 500.000 năm trước, với các di chỉ khảo cổ ở Việt Nam như Sơn Vi, Thẩm Khuyên... 🏛️',
  'cổ đại việt nam': 'Thời kỳ Cổ đại Việt Nam gắn liền với nhà Hùng Vương, nền văn hóa Đông Sơn rực rỡ. 🏺',
  'xã hội phong kiến': 'Xã hội phong kiến Việt Nam kéo dài từ thế kỷ X đến thế kỷ XIX, trải qua nhiều triều đại phong kiến. 👑',
  'cận đại': 'Thời kỳ Cận đại (1858-1945) bắt đầu khi thực dân Pháp xâm lược, kết thúc Cách mạng tháng Tám. 🏴',
  'hiện đại': 'Thời kỳ Hiện đại (từ 1945) bắt đầu từ Cách mạng tháng Tám đến nay, với nhiều thành tựu to lớn của dân tộc. 🇻🇳',
  'văn hóa đông sơn': 'Văn hóa Đông Sơn (700 TCN - 100 SCN) - Nền văn hóa rực rỡ của người Việt cổ, nổi tiếng với trống đồng và các hiện vật. 🥁',
  'trống đồng': 'Trống đồng Đông Sơn là biểu tượng của nền văn hóa Việt Nam cổ đại, được công nhận là Di sản tộc người. 🥁',
  'nghĩa hội': 'Phong trào Nghĩa Hội (1885-1896) - Các cuộc khởi nghĩa chống Pháp của nhân dân Việt Nam cuối thế kỷ XIX. ⚔️',
  'phong trào cần vương': 'Phong trào Cần Vương (1885-1889) - Phong trào chống Pháp của sĩ phu yêu nước cuối thế kỷ XIX. 🏴',
  'can thiệp pháp': 'Thực dân Pháp xâm lược Việt Nam từ 1858, bắt đầu bằng cuộc tấn công Đà Nẵng. 🏴',
  'khai thác thuộc địa': 'Thực dân Pháp khai thác Việt Nam từ 1867, biến Việt Nam thành thuộc địa, bóc lột nhân dân ta. 💰',

  // ============================================
  // SỰ KIỆN & NGÀY LỄ
  // ============================================
  'ngày quốc khánh': 'Ngày Quốc Khánh Việt Nam là ngày 2/9/1945 - Ngày Tuyên ngôn độc lập của Chủ tịch Hồ Chí Minh. 🇻🇳',
  'ngày 2/9': 'Ngày 2/9/1945 - Ngày Chủ tịch Hồ Chí Minh đọc Tuyên ngôn độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa. 🎊',
  'ngày giải phóng': 'Ngày 30/4 - Ngày Giải phóng miền Nam, thống nhất đất nước. 🎉',
  'ngày sinh nhật': 'Bạn đang hỏi về ngày sinh nhật của ai? Tôi có thể tìm kiếm thông tin về các nhân vật lịch sử cho bạn! 😊',
  'ngày lễ': 'Việt Nam có nhiều ngày lễ quan trọng: Quốc khánh (2/9), Giải phóng (30/4), Sinh nhật Bác (19/5), Thành lập Đảng (3/2)... 📅',
  'sinh nhật hồ chí minh': 'Ngày sinh Chủ tịch Hồ Chí Minh là 19/5/1890 tại làng Hoàng Trù (quê Nghệ An). 🗓️',
  'ngày 19/5': 'Ngày 19/5 - Sinh nhật Chủ tịch Hồ Chí Minh (1890). Đây là ngày sinh nhật lớn của dân tộc Việt Nam. 🎂',
  'ngày 3/2': 'Ngày 3/2 - Ngày thành lập Đảng Cộng sản Việt Nam (1930). Một ngày lễ trọng đại của dân tộc. 🏴',

  // ============================================
  // QUỐC GIA & DÂN TỘC
  // ============================================
  'đất nước': 'Đất nước Việt Nam - Non sông liền một dải, lịch sử hào hùng, văn hóa phong phú. Hãy tự hào về Tổ quốc mình! 🇻🇳',
  'non sông': 'Non sông Việt Nam với 54 dân tộc anh em, núi rừng hùng vĩ, biển đảo trùng khơi. Một đất nước tuyệt đẹp! 🏔️',
  'tổ tiên': 'Tổ tiên người Việt đã sinh sống trên mảnh đất này từ hàng nghìn năm trước, xây dựng nền văn minh rực rỡ. 👴👵',
  'tiền nhân': 'Tiền nhân người Việt đã chiến đấu bảo vệ đất nước qua hàng nghìn năm, để lại truyền thống yêu nước cho thế hệ sau. 🏴',

  // ============================================
  // CÁC CUỘC CHIẾN TRANH
  // ============================================
  'chiến tranh chống pháp': 'Kháng chiến chống Pháp (1945-1954) kéo dài 9 năm, kết thúc với Chiến thắng Điện Biên Phủ lịch sử. 🏆',
  'chiến tranh chống mỹ': 'Kháng chiến chống Mỹ (1955-1975) kéo dài 20 năm, kết thúc với Chiến dịch Hồ Chí Minh vĩ đại. 🏆',
  'chiến tranh bảo vệ tổ quốc': 'Chiến tranh bảo vệ Tổ quốc - Tinh thần bất khuất của dân tộc Việt Nam qua các cuộc chiến tranh. 🛡️',
  'bảo vệ tổ quốc': 'Bảo vệ Tổ quốc là nghĩa vụ thiêng liêng của mỗi công dân Việt Nam. Tinh thần yêu nước luôn được truyền từ thế hệ này sang thế hệ khác. 🇻🇳',
  'anh hùng': 'Việt Nam có nhiều anh hùng hy sinh cho độc lập dân tộc: Trần Hưng Đạo, Lê Lợi, Nguyễn Huệ, Hồ Chí Minh... Họ là tấm gương sáng cho thế hệ mai sau. ⭐',
  'liệt sĩ': 'Liệt sĩ - Những người đã ngã xuống vì độc lập tự do của Tổ quốc. Cả nước luôn ghi nhớ và tôn vinh các anh hùng liệt sĩ! 🕯️',
  'thương binh': 'Thương binh - Những người đã chiến đấu bảo vệ Tổ quốc, xứng đáng được cả nước trân trọng và quan tâm. ❤️',
  'người anh hùng': 'Người anh hùng dân tộc là người có công lớn với đất nước, được nhân dân tôn vinh và ghi nhớ mãi. ⭐',

  // ============================================
  // ĐỊA LÝ & ĐỊA DANH
  // ============================================
  'biên giới': 'Biên giới Việt Nam giáp với Trung Quốc, Lào, Campuchia. Đường biên giới trải dài hàng nghìn km. 🗺️',
  'hà nội': 'Hà Nội - Thủ đô ngàn năm văn hiến, kinh đô của nhiều triều đại phong kiến Việt Nam. 🏛️',
  'hồ chí minh city': 'TP. Hồ Chí Minh - Thành phố lớn nhất Việt Nam, trung tâm kinh tế, văn hóa phía Nam. 🌆',
  'đà nẵng': 'Đà Nẵng - Thành phố đáng sống, nơi thực dân Pháp đặt chân đầu tiên năm 1858. 🏖️',
  'huế': 'Huế - Cố đô của Việt Nam, kinh đô của nhà Nguyễn, nơi có lăng tẩm và đại nội Huế. 🏯',
  'thăng long': 'Thăng Long - Tên gọi cũ của Hà Nội, kinh đô của nhiều triều đại phong kiến: Lý, Trần, Lê. 🏛️',
  'hoa lư': 'Hoa Lư - Kinh đô đầu tiên của Việt Nam thời Đinh và Lý, nơi đặt nền móng cho nhà nước phong kiến trung ương. 🏯',
  'thăng long hà nội': 'Thăng Long (Hà Nội) là kinh đô của các triều đại Lý, Trần, Lê. Thành phố có hơn 1000 năm làm kinh đô. 🏛️',
  'việt nam có bao nhiêu tỉnh': 'Việt Nam có 63 tỉnh, thành phố trực thuộc trung ương. Một đất nước đa dạng về văn hóa và địa lý! 🗺️',
  'địa danh': 'Việt Nam có nhiều địa danh lịch sử nổi tiếng: Thăng Long, Hoa Lư, Huế, Điện Biên Phủ, Đống Đa... Mỗi nơi đều có câu chuyện lịch sử riêng. 📍',

  // ============================================
  // CHỦ ĐỀ ĐA DẠNG
  // ============================================
  'biên giới': 'Biên giới Việt Nam giáp với Trung Quốc, Lào, Campuchia. Đường biên giới trải dài hàng nghìn km. 🗺️',
  'biển đảo': 'Việt Nam có hơn 3000 hòn đảo, với quần đảo Trường Sa và Hoàng Sa - những vùng biển thiêng liêng của Tổ quốc. 🏝️',
  'hoàng sa': 'Quần đảo Hoàng Sa - Vùng biển thuộc chủ quyền Việt Nam, có vị trí chiến lược quan trọng. Nằm trên Biển Đông. 🏝️',
  'trường sa': 'Quần đảo Trường Sa - Vùng biển thuộc chủ quyền Việt Nam trên Biển Đông, có giá trị chiến lược to lớn. 🏝️',
  'văn hóa': 'Văn hóa Việt Nam rất phong phú: 54 dân tộc, ẩm thực đa dạng, nghệ thuật truyền thống, lễ hội... 🌟',
  'ẩm thực': 'Ẩm thực Việt Nam nổi tiếng thế giới với phở, bánh mì, nem chua... Mỗi vùng miền có đặc sản riêng. 🍜',
  'lễ hội': 'Việt Nam có nhiều lễ hội truyền thống: Hội xuất, lễ hội đền Hùng, lễ hội làng... Phản ánh đời sống văn hóa phong phú. 🎊',
  'đền hùng': 'Đền Hùng - Di tích lịch sử tại Phú Thọ, nơi thờ các vua Hùng, biểu tượng của tinh thần dân tộc Việt Nam. 🏛️',
  'truyền thống': 'Truyền thống Việt Nam: Yêu nước, đoàn kết, kiên cường, hiếu học. Những giá trị được hun đúc qua hàng nghìn năm lịch sử. 🇻🇳',
  'tinh thần dân tộc': 'Tinh thần dân tộc Việt Nam: Đoàn kết, kiên cường, bất khuất, yêu nước. Đó là sức mạnh giúp dân tộc ta vượt qua mọi khó khăn. 💪',
  'giáo dục': 'Giáo dục Việt Nam có truyền thống hiếu học từ lâu đời. Nhiều nhà nho đỗ đạt, trở thành quan lại, đóng góp cho đất nước. 📚',
  'hiếu học': 'Người Việt Nam có truyền thống hiếu học. "Mùa xuân là tết trẻ em, Cả nhà người người nhớ ơn ngày giỗ Tổ" - Truyền thống tôn vinh hiếu học. 📖',
  'trồng trọt': 'Người Việt Nam có lịch sử trồng lúa nước hàng nghìn năm, đồng bằng sông Cửu Long là vựa lúa lớn nhất cả nước. 🌾',
  'thương mại': 'Việt Nam có truyền thống thương mại từ thời cổ đại, con đường tơ lụa biển Đông đi qua Việt Nam từ rất lâu. 🛶',
  'nghề truyền thống': 'Việt Nam có nhiều nghề truyền thống: gốm sứ Bát Tràng, lụa Vạn Phúc, nón Huế, tơ tằm... 🎨',
  'nghệ thuật': 'Nghệ thuật Việt Nam rất phong phú: hội họa, điêu khắc, kiến trúc, âm nhạc, múa. Nhiều tác phẩm nổi tiếng thế giới. 🎭',
  'ca dao': 'Ca dao Việt Nam là kho tàng văn học dân gian, phản ánh đời sống, tình cảm của người Việt. 🎵',
  'tục ngữ': 'Tục ngữ Việt Nam là những câu nói ngắn gọn, chứa đựng triết lý sống của người Việt. Ví dụ: "Có công mài sắt có ngày nên kim". 💎',
  'thơ': 'Thơ Việt Nam có truyền thống lâu đời: Nguyễn Trãi, Nguyễn Du, Hồ Xuân Hương, và nhiều thi nhân khác. 📜',
  'nguyễn du': 'Nguyễn Du (1765-1820) - Đại thi hào dân tộc, tác giả "Truyện Kiều" - Kiệt tác văn học Việt Nam. 📖',
  'truyện kiều': 'Truyện Kiều của Nguyễn Du là kiệt tác văn học Việt Nam, được dịch ra nhiều ngôn ngữ trên thế giới. 📚',
  'truyện': 'Truyện cổ Việt Nam rất phong phú: Truyện Thánh Gióng, Truyện Tấm Cám, Sọ Dừa... Nhiều câu chuyện được lưu truyền qua hàng nghìn năm. 📖',

  // ============================================
  // THÔNG TIN LIÊN HỆ & HỖ TRỢ
  // ============================================
  'số điện thoại': 'Bạn có thể liên hệ qua mục "Liên hệ" trên website để được hỗ trợ nhanh nhất. 📞',
  'sdt': 'Bạn có thể liên hệ qua mục "Liên hệ" trên website để được hỗ trợ. 📞',
  'điện thoại': 'Thông tin liên hệ có trong mục "Liên hệ" hoặc "Hỗ trợ" trên website. 📞',
  'hotline': 'Bạn có thể gọi hotline được ghi trên website để được hỗ trợ trực tiếp. 📞',
  'gọi điện': 'Bạn có thể gọi điện qua số hotline trên website để được hỗ trợ nhanh chóng. 📞',
  'gọi': 'Để gọi điện, bạn hãy kiểm tra mục "Liên hệ" trên website để biết số điện thoại. 📞',
  'email': 'Bạn có thể gửi email qua địa chỉ được ghi trong mục "Liên hệ" trên website. 📧',
  'gửi email': 'Để gửi email, bạn hãy vào mục "Liên hệ" trên website để biết địa chỉ email chính xác. 📧',
  'mail': 'Địa chỉ email của website có trong mục "Liên hệ". Bạn có thể gửi câu hỏi hoặc góp ý qua email. 📧',
  'thư điện tử': 'Thư điện tử (email) là cách liên hệ nhanh chóng. Kiểm tra mục "Liên hệ" trên website để biết email. 📧',
  'địa chỉ email': 'Địa chỉ email có trong mục "Liên hệ" ở cuối trang web. Bạn có thể gửi email để được hỗ trợ. 📧',
  'liên hệ': 'Bạn có thể liên hệ qua: 1) Email trong mục "Liên hệ", 2) Form phản hồi trên website. Chúng tôi sẽ phản hồi sớm nhất! 💬',
  'liên hệ như thế nào': 'Để liên hệ, bạn vào mục "Liên hệ" trên website và điền thông tin. Chúng tôi sẽ phản hồi trong 24 giờ. 💬',
  'liên hệ ở đâu': 'Mục "Liên hệ" thường nằm ở cuối trang web hoặc trong menu. Bạn thử kéo xuống xem nhé! 👇',
  'hỗ trợ': 'Nếu cần hỗ trợ, bạn có thể: 1) Gửi email, 2) Điền form liên hệ trên website. Đội ngũ hỗ trợ sẵn sàng giúp bạn! 💪',
  'cần hỗ trợ': 'Bạn cần hỗ trợ gì? 😊 Hãy mô tả vấn đề của bạn, tôi sẽ cố gắng hỗ trợ hoặc hướng dẫn bạn liên hệ đúng nơi.',
  'gặp ai': 'Bạn có thể gửi yêu cầu qua mục "Liên hệ" trên website. Đội ngũ của chúng tôi sẽ hỗ trợ bạn. 👤',
  'admin': 'Admin của website sẽ hỗ trợ bạn qua mục "Liên hệ". Bạn có thể gửi email hoặc điền form phản hồi. 👨‍💻',
  'nhà phát triển': 'Website được phát triển bởi đội ngũ Lịch Sử Số. Bạn có thể liên hệ qua mục "Liên hệ" trên website. 👨‍💻',
  'người tạo': 'Website Lịch Sử Số được tạo bởi đội ngũ phát triển. Liên hệ qua mục "Liên hệ" để biết thêm thông tin. 👨‍💻',
  'ai tạo ra': 'Website được tạo bởi đội ngũ Lịch Sử Số. Bạn có thể tìm thêm thông tin trong mục "Giới thiệu" hoặc "Liên hệ". 🏗️',
  'công ty': 'Lịch Sử Số là đội ngũ phát triển website. Thông tin chi tiết có trong mục "Giới thiệu" trên website. 🏢',
  'tổ chức': 'Lịch Sử Số là tổ chức giáo dục trực tuyến. Thông tin thêm trong mục "Giới thiệu" hoặc "Liên hệ". 🏛️',
  'địa chỉ': 'Thông tin địa chỉ (nếu có) sẽ nằm trong mục "Liên hệ" trên website. Bạn có thể kiểm tra tại đó. 📍',
  'ở đâu': 'Lịch Sử Số là nền tảng học tập trực tuyến, bạn có thể truy cập mọi lúc mọi nơi! 🌍',
  'fanpage': 'Bạn có thể tìm fanpage Facebook của Lịch Sử Số qua tìm kiếm trên Facebook hoặc kiểm tra link trong mục "Liên hệ". 📘',
  'facebook': 'Fanpage Facebook của Lịch Sử Số thường có link trong mục "Liên hệ" hoặc cuối trang web. Follow để cập nhật tin tức! 📘',
  'zalo': 'Bạn có thể liên hệ qua Zalo nếu số Zalo được ghi trong mục "Liên hệ" trên website. 💬',
  'messenger': 'Bạn có thể nhắn tin qua Fanpage Facebook của Lịch Sử Số để được hỗ trợ nhanh chóng. 💬',
  'chat': 'Bạn đang chat với tôi đây! 😊 Tôi có thể hỗ trợ bạn ngay. Nếu cần liên hệ khác, vào mục "Liên hệ" trên website nhé!',
  'nhắn tin': 'Bạn có thể nhắn tin cho Lịch Sử Số qua Fanpage Facebook hoặc Zalo (nếu có thông tin trên website). 💬',
  'trả lời': 'Tin nhắn của bạn sẽ được đội ngũ Lịch Sử Số trả lời trong thời gian sớm nhất qua email hoặc các kênh liên hệ. ⏰',
  'phản hồi': 'Cảm ơn bạn đã phản hồi! 💬 Đội ngũ của chúng tôi sẽ tiếp nhận và phản hồi sớm nhất có thể.',
  'khiếu nại': 'Nếu có khiếu nại, bạn hãy gửi qua mục "Liên hệ" trên website với mô tả chi tiết. Chúng tôi sẽ xem xét và phản hồi. 📝',
  'kiến nghị': 'Bạn có thể gửi kiến nghị qua mục "Liên hệ" hoặc "Góp ý" trên website. Mọi ý kiến đều được lắng nghe! 📝',
  'yêu cầu': 'Nếu có yêu cầu đặc biệt, bạn hãy liên hệ trực tiếp qua email trong mục "Liên hệ" để được hỗ trợ tốt nhất. 📧',
  'báo cáo lỗi': 'Nếu phát hiện lỗi trên website, bạn hãy báo cáo qua mục "Liên hệ" với mô tả chi tiết: ảnh chụp màn hình, trình duyệt đang dùng... 🐛',
  'lỗi website': 'Xin lỗi vì sự bất tiện này! 😔 Bạn hãy báo cáo lỗi qua mục "Liên hệ" trên website để đội ngũ kỹ thuật khắc phục nhanh nhất.',
  'website không hoạt động': 'Nếu website không hoạt động, có thể do lỗi kết nối hoặc bảo trì. Bạn thử tải lại trang hoặc quay lại sau vài phút nhé! 🔄',
  'không vào được': 'Nếu không vào được website, bạn thử: 1) Xóa cache trình duyệt, 2) Thử trình duyệt khác, 3) Kiểm tra kết nối internet. Nếu vẫn lỗi, hãy liên hệ qua email. 🌐',
  'quên mật khẩu': 'Để đặt lại mật khẩu, click vào "Quên mật khẩu" ở trang đăng nhập và làm theo hướng dẫn trong email. 🔐',
  'đổi mật khẩu': 'Bạn có thể đổi mật khẩu trong phần "Cài đặt tài khoản" sau khi đăng nhập. Nếu quên, hãy dùng "Quên mật khẩu". 🔐',
  'tài khoản': 'Để quản lý tài khoản, đăng nhập và vào phần "Tài khoản" hoặc "Cài đặt". Bạn có thể đổi thông tin, mật khẩu tại đây. 👤',
  'đăng ký tài khoản': 'Để đăng ký tài khoản, click vào nút "Đăng ký" và điền thông tin cần thiết. Sau khi đăng ký, bạn có thể lưu bài giảng yêu thích! ✍️',
  'xóa tài khoản': 'Nếu muốn xóa tài khoản, bạn hãy liên hệ qua email trong mục "Liên hệ" để được hỗ trợ. 📧',
  'thông tin cá nhân': 'Thông tin cá nhân của bạn được bảo mật. Bạn có thể xem và chỉnh sửa trong phần "Tài khoản" sau khi đăng nhập. 🔒',
  'bảo mật': 'Website cam kết bảo mật thông tin cá nhân của người dùng. Nếu có thắc mắc, hãy liên hệ qua email. 🔐',
  'chính sách bảo mật': 'Chính sách bảo mật của website có trong mục "Chính sách" hoặc "Điều khoản sử dụng" ở cuối trang web. 📜',
  'điều khoản': 'Điều khoản sử dụng và chính sách bảo mật có trong mục tương ứng ở cuối trang web. Bạn nên đọc trước khi sử dụng. 📜',
  'phí': 'Website Lịch Sử Số hoàn toàn miễn phí! 🎉 Bạn không cần trả bất kỳ khoản phí nào để sử dụng dịch vụ.',
  'trả tiền': 'Không cần trả tiền! 💰 Tất cả tài liệu và tính năng trên website đều miễn phí 100%.',
  'bao giờ có': 'Website thường xuyên cập nhật nội dung mới. Bạn nên thường xuyên ghé thăm để cập nhật tài liệu mới nhất! 📅',
  'cập nhật': 'Website luôn cập nhật tài liệu mới. Bạn có thể theo dõi fanpage để không bỏ lỡ thông tin cập nhật. 🔄',
  'phiên bản': 'Đây là phiên bản mới nhất của website Lịch Sử Số. Nếu có vấn đề gì, hãy báo cáo qua mục "Liên hệ" nhé! 📱',
  'update': 'Website được cập nhật thường xuyên để cải thiện trải nghiệm người dùng. Kiểm tra thông tin cập nhật trên fanpage nhé! 🔄',

  // ============================================
  // CÁC CUỘC CÁCH MẠNG
  // ============================================

  // ============================================
  // CÁC TỔ CHỨC & QUỐC TẾ
  // ============================================
  'liên hợp quốc': 'Liên Hợp Quốc (LHQ) - Tổ chức quốc tế lớn nhất, Việt Nam là thành viên từ năm 1977. 🌍',
  'asean': 'ASEAN - Hiệp hội các quốc gia Đông Nam Á, Việt Nam là thành viên sáng lập từ 1995. 🇻🇳',
  'việt nam gia nhập lhq': 'Việt Nam gia nhập Liên Hợp Quốc ngày 20/9/1977, trở thành thành viên thứ 149 của tổ chức này. 🌍',
  'việt nam asean': 'Việt Nam gia nhập ASEAN ngày 28/7/1995, thể hiện đường lối đối ngoại hòa bình, hợp tác quốc tế. 🌏',
  'cộng đồng asean': 'Cộng đồng ASEAN gồm 10 quốc gia Đông Nam Á, hợp tác về kinh tế, văn hóa, xã hội. Việt Nam là thành viên tích cực. 🌍',

  // ============================================
  // CÁC SỰ KIỆN GẦN ĐÂY
  // ============================================
  'việt nam hiện nay': 'Việt Nam hiện nay là quốc gia độc lập, thống nhất, phát triển kinh tế - xã hội, giữ vững ổn định chính trị. 🇻🇳',
  'đổi mới': 'Đổi mới (1986) - Chính sách cải cách kinh tế của Việt Nam, mở ra kỷ nguyên phát triển mới cho đất nước. 📈',
  'đổi mới kinh tế': 'Đổi mới kinh tế 1986 do Đảng Cộng sản Việt Nam khởi xướng, chuyển từ kinh tế kế hoạch sang kinh tế thị trường. 💹',
  'hội nhập quốc tế': 'Việt Nam tích cực hội nhập quốc tế: WTO, ASEAN, APEC, các hiệp định thương mại tự do... 🌍',
  'gdp việt nam': 'GDP Việt Nam tăng trưởng ổn định qua các năm, nền kinh tế phát triển nhanh trong khu vực. 📊',
  'dân số việt nam': 'Việt Nam có dân số khoảng 100 triệu người (2023), đứng thứ 3 Đông Nam Á. 🌏',

  // ============================================
  // CÁC CHỦ ĐỀ HÓA HỌC
  // ============================================
  'hóa học': 'Bạn đang hỏi về môn Hóa học? Website này chuyên về Lịch sử. Tuy nhiên, bạn có thể tìm tài liệu Hóa học ở các website khác! 😊',
  'vật lý': 'Bạn đang hỏi về môn Vật lý? Website này chuyên về Lịch sử. Bạn có thể tìm tài liệu Vật lý ở các nguồn khác nhé! 📚',
  'toán học': 'Bạn đang hỏi về môn Toán? Website này chuyên về Lịch sử. Tuy nhiên, nếu có tài liệu liên quan đến lịch sử toán học, tôi có thể tìm cho bạn! 📐',
  'sinh học': 'Bạn đang hỏi về môn Sinh học? Website này chuyên về Lịch sử. Bạn có thể tìm tài liệu Sinh học ở các nguồn khác nhé! 🧬',
  'ngữ văn': 'Ngữ văn và Lịch sử có mối liên hệ chặt chẽ. Nhiều tác phẩm văn học phản ánh lịch sử. Bạn cần tìm tài liệu nào? 📖',
  'địa lý': 'Địa lý và Lịch sử có mối liên hệ. Kiến thức địa lý giúp hiểu bối cảnh lịch sử tốt hơn. Bạn cần tìm gì? 🗺️',
  'tiếng anh': 'Bạn đang hỏi về tiếng Anh? Website này chuyên về Lịch sử. Tuy nhiên, bạn có thể tìm tài liệu ở các nguồn khác nhé! 🌐',

  // ============================================
  // CÁC CÂU HỎI ĐỜI THƯỜNG
  // ============================================
  'bạn khỏe không': 'Cảm ơn bạn! Tôi là AI nên luôn sẵn sàng hoạt động 24/7! 😊 Còn bạn, bạn khỏe không?',
  'bạn là bot': 'Tôi là trợ lý AI của Lịch Sử Số! 🤖 Tôi có thể trò chuyện, trả lời câu hỏi và tìm bài giảng cho bạn.',
  'bạn có thể làm gì': 'Tôi có thể: 1) Trả lời câu hỏi về lịch sử, 2) Tìm bài giảng cho bạn, 3) Gợi ý chủ đề học tập. Hỏi tôi nhé! 💬',
  'bạn thích gì': 'Tôi thích giúp đỡ học sinh tìm tài liệu lịch sử! 😊 Đó là công việc của tôi và tôi rất vui khi được hỗ trợ bạn.',
  'tuổi gì': 'Tôi là AI, không có tuổi! 😊 Tôi luôn trẻ trung và sẵn sàng giúp bạn mọi lúc.',
  'bạn người máy': 'Tôi là trợ lý ảo (AI chatbot)! 🤖 Tôi không phải người thật nhưng tôi rất nhiệt tình giúp đỡ bạn.',
  'tôi buồn': 'Oh, tôi hiểu! 😔 Đôi khi ai cũng có lúc buồn. Hãy thử học một chút lịch sử, biết đâu sẽ thú vị hơn! 📚',
  'tôi vui': 'Thật tuyệt! 🎉 Bạn vui thì tôi cũng vui! Có gì tôi có thể giúp bạn hôm nay không?',
  'tôi mệt': 'Nghỉ ngơi đi nhé! 😴 Học tập quan trọng nhưng sức khỏe còn quan trọng hơn. Quay lại khi bạn đã nghỉ ngơi đầy đủ nhé! 💪',
  'tôi đói': 'Đói thì phải ăn thôi! 🍜 Đừng học khi đói, vừa không hiệu quả vừa không tốt cho sức khỏe.',
  'thời tiết': 'Bạn đang hỏi về thời tiết? 😊 Tôi không có thông tin thời tiết, nhưng tôi có thể giúp bạn tìm tài liệu lịch sử!',
  'trời mưa': 'Trời mưa thì ở nhà học bài là perfect! 📚 Nghe tiếng mưa rơi mà học lịch sử thì còn gì bằng!',
  'trời nắng': 'Trời nắng đẹp trời! ☀️ Nếu có thời gian, ra ngoài hít thở không khí trong lành rồi quay lại học nhé!',
  'đi chơi': 'Đi chơi cũng tốt để giải tỏa stress! 😊 Nhưng đừng quên ôn thi THPT nhé, kỳ thi đang đến gần! 📚',
  'xem phim': 'Xem phim là cách giải trí tốt! 🎬 Có nhiều bộ phim lịch sử hay về Việt Nam như "Đại Việt sử ký", "Hoa sữa", bạn có thể xem để học lịch sử một cách thú vị!',
  'nghe nhạc': 'Nhạc hay! 🎵 Có nhiều bài hát về lịch sử Việt Nam rất trữ tình và ý nghĩa. Bạn thử tìm nghe nhé!',
  'chơi game': 'Chơi game vừa thư giãn vừa giải trí! 🎮 Nhưng đừng quên ôn thi nhé! Một vài game lịch sử cũng khá thú vị đấy!',
  'ngủ dậy': 'Chào buổi sáng! ☀️ Ngày mới tràn đầy năng lượng! Bạn đã sẵn sàng học bài chưa?',
  'đi ngủ': 'Chúc bạn ngủ ngon! 🌙 Nghỉ ngơi đầy đủ để ngày mai học tốt hơn nhé!',
  'đi đâu': 'Bạn định đi đâu vậy? 😊 Dù đi đâu thì cũng nhớ học bài nhé!',
  'ở đâu': 'Tôi đang ở đây với bạn! 😊 Có gì cần hỏi thì cứ hỏi tôi nhé!',
  'làm gì': 'Tôi đang sẵn sàng giúp bạn tìm tài liệu lịch sử! 📚 Bạn cần gì hôm nay?',
  'ăn gì': 'Bạn đang nghĩ đến chuyện ăn uống à? 😊 Đừng quên ăn uống đầy đủ để có sức học nhé!',
  'uống nước': 'Uống nước rất tốt cho sức khỏe! 💧 Nhắc nhở bạn uống đủ 2 lít nước mỗi ngày nhé!',
  'tập thể dục': 'Tập thể dục rất tốt! 🏃 Cân bằng giữa học tập và vận động sẽ giúp bạn khỏe mạnh và học hiệu quả hơn!',
  'học nhóm': 'Học nhóm là cách học rất hiệu quả! 👥 Cùng bạn bè ôn tập, trao đổi kiến thức sẽ giúp hiểu bài sâu hơn.',
  'bài tập': 'Bạn cần làm bài tập? 📝 Tìm tài liệu ôn thi, đề thi thử trên website để luyện tập nhé!',
  'bài kiểm tra': 'Sắp có bài kiểm tra à? 😰 Đừng lo, tìm tài liệu ôn tập ngay để chuẩn bị tốt nhất nhé!',
  'thi cử': 'Kỳ thi sắp tới? 🎯 Hãy tìm tài liệu ôn thi, làm đề thi thử để chuẩn bị thật kỹ! Good luck! 🍀',
  'điểm số': 'Điểm số quan trọng nhưng không phải tất cả! 📊 Cố gắng hết sức, kết quả sẽ đến thôi! 💪',
  'học sinh': 'Học sinh Việt Nam rất chăm chỉ! 📚 Bạn đang học lớp mấy rồi?',
  'giáo viên': 'Giáo viên là những người anh hùng thầm lặng! 👩‍🏫 Cảm ơn các thầy cô đã dạy dỗ thế hệ trẻ Việt Nam!',
  'thầy cô': 'Thầy cô giáo - những người dìu dắt thế hệ mai sau! 👨‍🏫 Hãy luôn kính trọng và biết ơn thầy cô nhé!',
  'bạn bè': 'Bạn bè là người bạn đồng hành tuyệt vời! 👫 Học cùng bạn bè sẽ vui hơn và hiệu quả hơn đấy!',
  'gia đình': 'Gia đình là nơi ấm áp nhất! ❤️ Hãy luôn yêu thương và quan tâm đến gia đình mình nhé!',
  'bố mẹ': 'Bố mẹ luôn yêu thương và lo lắng cho chúng ta! ❤️ Hãy biết ơn và nghe lời bố mẹ nhé!',
  'ông bà': 'Ông bà có nhiều kinh nghiệm sống quý báu! 👴👵 Hãy tranh thủ hỏi ông bà về lịch sử gia đình, sẽ rất thú vị đấy!',
  'yêu': 'Tình yêu là đẹp nhất khi đến đúng lúc! ❤️ Nhưng giờ hãy tập trung học thi đã nhé! Học xong rồi tính tiếp! 😄',
  'mơ': 'Những giấc mơ sẽ thành hiện thực nếu bạn cố gắng! ✨ Hãy theo đuổi ước mơ của mình nhé!',
  'ước mơ': 'Ước mơ là điều đẹp nhất! 🌟 Hãy luôn giữ cho mình những ước mơ và nỗ lực để đạt được chúng!',
  'tương lai': 'Tương lai tươi sáng đang chờ bạn! 🌅 Hãy cố gắng học tập để xây dựng tương lai tốt đẹp nhé!',
  'thành công': 'Chúc bạn thành công! 🏆 Thành công đến với những người nỗ lực không ngừng! 💪',
  'nỗ lực': 'Nỗ lực không bao giờ là uổng phí! 💪 Cứ tiếp tục cố gắng, thành công sẽ đến với bạn!',
  'cố gắng': 'Cố gắng lên! 💪 Mỗi ngày một bước tiến, bạn sẽ đạt được mục tiêu của mình!',
  'tương lai': 'Tương lai tươi sáng đang chờ bạn! 🌅 Hãy cố gắng học tập để xây dựng tương lai tốt đẹp nhé!',
  'không được': 'Đừng nản chí! 😤 Mỗi thất bại là một bài học. Hãy tiếp tục cố gắng! 💪',
  'khó quá': 'Đừng nản! 😤 Lịch sử có vẻ khó nhưng nếu bạn hiểu logic và sự kiện, mọi thứ sẽ dễ dàng hơn. Tôi có thể tìm tài liệu giúp bạn! 📚',
  'bí': 'Bí bài à? 🤔 Đừng lo, tôi có thể tìm tài liệu, giải thích giúp bạn! Hỏi tôi nhé!',
  'không hiểu': 'Bạn không hiểu chỗ nào? 🤔 Cứ hỏi tôi, tôi sẽ tìm tài liệu và giải thích giúp bạn!',
  'giải thích': 'Bạn cần giải thích về chủ đề nào? 🤔 Tôi có thể tìm tài liệu liên quan để giúp bạn hiểu rõ hơn! 📖',
  'ví dụ': 'Bạn cần ví dụ về vấn đề gì? 🤔 Hãy hỏi cụ thể hơn, tôi sẽ tìm tài liệu phù hợp cho bạn! 📚',
  'tóm tắt': 'Bạn cần tóm tắt nội dung gì? 📝 Hãy cho tôi biết chủ đề, tôi sẽ tìm tài liệu tóm tắt giúp bạn!',
  'ô nhiễm': 'Ô nhiễm môi trường là vấn đề toàn cầu! 🌍 Việt Nam cũng đang nỗ lực bảo vệ môi trường. Hãy cùng chung tay bảo vệ Trái Đất nhé!',
  'biến đổi khí hậu': 'Biến đổi khí hậu là thách thức lớn của nhân loại! 🌍 Cần sự chung tay của tất cả mọi người để bảo vệ hành tinh xanh!',
  'covid': 'COVID-19 đã ảnh hưởng đến toàn cầu từ 2020. Việt Nam đã kiểm soát dịch bệnh tốt và đang phục hồi kinh tế - xã hội. 💪',
  'vaccine': 'Vaccine là biện pháp phòng chống dịch bệnh hiệu quả. Việt Nam đã tiêm vaccine COVID-19 rộng rãi cho người dân. 💉',
  'công nghệ': 'Công nghệ đang phát triển rất nhanh! 💻 Việt Nam cũng không ngừng đổi mới và ứng dụng công nghệ vào đời sống!',
  'internet': 'Internet là công cụ tuyệt vời để học tập! 🌐 Bạn có thể tìm kiếm thông tin, học online mọi lúc mọi nơi!',
  'mạng xã hội': 'Mạng xã hội có lợi và hại. Hãy sử dụng nó một cách có trách nhiệm, đặc biệt là không chia sẻ thông tin sai lệch về lịch sử nhé! 📱',
  'bảo mật': 'Bảo mật thông tin cá nhân rất quan trọng! 🔐 Hãy cẩn thận với các đường link lạ và không chia sẻ mật khẩu với ai!',
  'an toàn': 'An toàn là trên hết! 🛡️ Hãy cẩn thận trong mọi tình huống, đặc biệt khi sử dụng internet nhé!',
  'bạo lực học đường': 'Bạo lực học đường là không thể chấp nhận! 🚫 Hãy yêu thương, tôn trọng lẫn nhau. Nếu bị bạo lực, hãy kể cho người lớn tin cậy!',
  'hy vọng': 'Hãy luôn hy vọng! 🌅 Mỗi ngày mới là một cơ hội mới. Đừng bỏ cuộc nhé! 💪',
  'động lực': 'Động lực đến từ ước mơ và mục tiêu của bạn! 🎯 Hãy nhớ vì sao bạn bắt đầu, và tiếp tục tiến về phía trước!',
  'mục tiêu': 'Mục tiêu rõ ràng sẽ giúp bạn tập trung! 🎯 Hãy đặt mục tiêu cụ thể và theo đuổi nó đến cùng nhé!',
  'kế hoạch': 'Kế hoạch là chìa khóa của thành công! 📅 Hãy lập kế hoạch học tập và ôn thi ngay từ hôm nay nhé!',
  'lịch': 'Bạn cần xem lịch? 📅 Hôm nay là một ngày tuyệt vời để học tập! Đừng lãng phí thời gian nhé!',
  'lịch sử': 'Lịch sử là môn học thú vị! 📚 Nó giúp chúng ta hiểu quá khứ, sống tốt hơn ở hiện tại và chuẩn bị cho tương lai!',
  'lịch sử việt nam': 'Lịch sử Việt Nam rất phong phú và hào hùng! Từ thời Hùng Vương đến Cách mạng tháng Tám, mỗi giai đoạn đều có ý nghĩa quan trọng. 🇻🇳',
  'lịch sử thế giới': 'Lịch sử thế giới cũng rất thú vị! 🌍 Các cuộc cách mạng, chiến tranh, nhân vật lịch sử đã định hình thế giới ngày nay.',
  'học': 'Học là con đường tốt nhất để thành công! 📚 Hãy cố gắng hết sức, bạn sẽ đạt được điều mình muốn!',
  'ôn tập': 'Ôn tập là cách tốt nhất để ghi nhớ kiến thức! 🔄 Hãy ôn tập định kỳ, không để kiến thức bị quên nhé!',
  'ghi nhớ': 'Để ghi nhớ tốt: 1) Hiểu bài, 2) Sử dụng sơ đồ, 3) Ôn tập thường xuyên, 4) Liên kết với thực tế. Bạn có thể tìm tài liệu để học tốt hơn! 🧠',
  'nhớ': 'Ghi nhớ là kỹ năng quan trọng! 🧠 Học cách nhớ bằng sơ đồ, liên kết sự kiện với nhau sẽ hiệu quả hơn nhiều!',
  'quên': 'Đừng lo, ai cũng có lúc quên! 😅 Hãy ôn tập lại, kiến thức sẽ được củng cố trong trí nhớ của bạn!',
  'thông minh': 'Thông minh là kết quả của sự nỗ lực! 🧠 Không ai sinh ra đã thông minh, quan trọng là cách bạn rèn luyện!',
  'thiên tài': 'Thiên tài là 1% cảm hứng và 99% nỗ lực! 💡 Hãy cố gắng, bạn có thể làm được mọi điều!',
  'năng lực': 'Mỗi người có năng lực riêng! 🌟 Hãy phát huy điểm mạnh và không ngừng học hỏi để hoàn thiện bản thân!',
  'nỗ lực học': 'Nỗ lực học tập luôn được đền đáp! 📚 Cứ tiếp tục cố gắng, thành công đang chờ bạn!',
  'bài học': 'Mỗi bài học đều có giá trị! 📖 Hãy học hỏi từ mọi thứ xung quanh, không chỉ trong sách vở!',
  'kinh nghiệm': 'Kinh nghiệm là người thầy tốt nhất! 💡 Hãy học từ kinh nghiệm của bản thân và người khác!',
  'sai lầm': 'Sai lầm là bài học quý giá! 💎 Đừng sợ sai, quan trọng là rút kinh nghiệm và không lặp lại!',
  'thất bại': 'Thất bại là mẹ thành công! 🌱 Đừng nản chí, mỗi lần ngã là một lần đứng dậy mạnh mẽ hơn!',
  'thành công là gì': 'Thành công là khi bạn đạt được mục tiêu mà mình đã đặt ra! 🏆 Nó đến từ sự nỗ lực và không từ bỏ!',
  'cảm ơn bạn': 'Không có chi! 😊 Rất vui được giúp bạn! Nếu cần gì nữa, cứ hỏi tôi nhé!',
  'tạm biệt': 'Tạm biệt! 👋 Hẹn gặp lại bạn! Chúc bạn một ngày tốt lành!',
  'hẹn gặp': 'Hẹn gặp lại! 👋 Ghé thăm khi bạn cần tìm tài liệu lịch sử nhé!',
  'cười': 'Haha! 😄 Vui vẻ là điều quan trọng! Hãy luôn giữ nụ cười trên môi nhé! 😊',
  'haha': '😄',
  'lol': '😆',
  'wow': 'Thú vị nhỉ! 😊 Bạn có câu hỏi thú vị nào về lịch sử không? Hỏi tôi nhé!',
  'ok': 'OK! 👍 Có gì cần hỏi thêm không?',
  'okay': 'Okay! 👍',
  'vâng': 'Vâng! 😊 Tôi sẵn sàng giúp bạn!',
  'dạ': 'Dạ! 😊 Có gì tôi có thể giúp bạn?',
  'ừ': 'Ừ! 👍 Cứ hỏi tôi nếu bạn cần tìm tài liệu lịch sử nhé!',
  'không': 'Được rồi! 😊 Nếu cần gì thì hỏi tôi nhé!',
  'có': 'Tuyệt! 🎉 Bạn cần tìm gì?',
  'biết rồi': 'Tốt! 😊 Bạn có thể hỏi tôi thêm nếu cần!',
  'tôi biết': 'Giỏi lắm! 🌟 Bạn có kiến thức tốt rồi!',
  'hay': 'Đúng vậy! 😊 Lịch sử rất thú vị phải không?',
  'đúng': 'Đúng rồi! 👍 Bạn học giỏi lắm!',
  'sai': 'Không sao cả! 😊 Mỗi lần sai là một lần học hỏi. Đừng nản nhé!',
  'thú vị': 'Lịch sử thú vị lắm phải không? 📚 Hãy tiếp tục khám phá nhé!',
  'nhàm chán': 'Lịch sử có vẻ nhàm chán? 😴 Thử tìm góc nhìn mới, liên kết với thực tế, sẽ thú vị hơn đấy!',
  'dễ': 'Tuyệt vời! 🎉 Bạn học nhanh quá! Có gì khó hơn không?',
  'khó': 'Đừng nản! 😤 Có tài liệu ôn tập, cố gắng thêm, bạn sẽ hiểu thôi! Tôi có thể tìm giúp bạn!',
  'đủ rồi': 'Được rồi! 👍 Cảm ơn bạn đã trò chuyện! Hẹn gặp lại nhé! 👋',
  'hết': 'Hết rồi sao? 😊 Nếu có câu hỏi gì thêm, cứ quay lại hỏi tôi nhé!',
  'kết thúc': 'Kết thúc cuộc trò chuyện thôi! 👋 Cảm ơn bạn đã chat! Chúc bạn học tốt!',
  'đi': 'Đi đâu vậy? 😊 Đừng quên học bài nhé!',
  'về': 'Về nhà à? 🏠 Nghỉ ngơi giải lao một chút rồi tiếp tục học nhé!',
  'ngồi': 'Ngồi học à? 📚 Nhớ giữ tư thế đúng, ngồi thẳng lưng nhé!',
  'đứng': 'Đứng dậy vận động một chút! 🧍 Đứng lên ngồi xuống thường xuyên tốt cho sức khỏe đấy!',
  'chạy': 'Chạy bộ là môn thể thao tốt! 🏃 Tập thể dục giúp tinh thần sảng khoái, học hiệu quả hơn!',
  'bơi': 'Bơi lội rất tốt! 🏊 Vừa rèn luyện sức khỏe vừa giải trí!',
  'đạp xe': 'Đạp xe là cách di chuyển lành mạnh! 🚲 Vừa bảo vệ môi trường vừa tốt cho sức khỏe!',
  'nấu ăn': 'Nấu ăn là kỹ năng sống quan trọng! 🍳 Biết nấu ăn, bạn sẽ tự lập hơn đấy!',
  'rửa chén': 'Rửa chén là việc nhà hữu ích! 🍽️ Giúp đỡ gia đình là điều tốt!',
  'quét nhà': 'Quét nhà sạch sẽ! 🧹 Nhà sạch thì tinh thần cũng sảng khoái hơn!',
  'giặt quần áo': 'Giặt quần áo là kỹ năng cần thiết! 👕 Tự giặt đồ, tự lập hơn mỗi ngày!',
  'mua sắm': 'Mua sắm vui nhưng đừng quên túi tiền! 🛒 Cũng đừng quên học bài nhé!',
  'đọc sách': 'Đọc sách là thói quen tốt! 📖 Ngoài sách giáo khoa, bạn có thể đọc thêm sách lịch sử để mở rộng kiến thức!',
  'viết': 'Viết là cách học hiệu quả! ✍️ Ghi chép bài giảng giúp nhớ lâu hơn!',
  'vẽ': 'Vẽ sơ đồ tư duy là cách học tuyệt vời! 🎨 Giúp bạn liên kết kiến thức và nhớ lâu hơn!',
  'nghe': 'Nghe giảng là quan trọng! 👂 Hãy tập trung khi thầy cô giảng bài nhé!',
  'nói': 'Nói về lịch sử với bạn bè là cách học tốt! 🗣️ Dạy lại cho người khác là cách hiểu sâu nhất!',
  'hỏi': 'Hỏi là cách học tốt! ❓ Đừng ngại hỏi thầy cô, bạn bè, hay cả tôi nhé!',
  'trả lời': 'Trả lời câu hỏi lịch sử: 1) Đọc kỹ đề, 2) Xác định thời gian, 3) Trình bày logic, 4) Kết luận. Tôi có thể tìm tài liệu giúp bạn! 📝',
  'thảo luận': 'Thảo luận nhóm là cách học hiệu quả! 👥 Cùng bạn bè trao đổi, học hỏi lẫn nhau!',
  'tranh luận': 'Tranh luận giúp hiểu bài sâu hơn! ⚔️ Nhưng hãy tôn trọng ý kiến người khác nhé!',
  'đồng ý': 'Đồng ý! 👍',
  'không đồng ý': 'OK! 👍 Mỗi người có quan điểm riêng. Hãy tôn trọng sự khác biệt nhé!',
  'vậy': 'Vậy à! 😊 Có gì cần hỏi thêm không?',
  'thế': 'Thế à! 🤔 Có câu hỏi gì về lịch sử không? Tôi có thể giúp!',
  'sao': 'Sao vậy? 🤔',
  'tại sao': 'Tại vì... để tôi suy nghĩ! 🤔 Thật ra, nhiều sự kiện lịch sử có nguyên nhân phức tạp. Hãy hỏi cụ thể hơn nhé!',
  'như thế nào': 'Như thế nào nhỉ? 🤔 Hãy hỏi cụ thể hơn, tôi sẽ tìm tài liệu giúp bạn!',
  'khi nào': 'Khi nào nhỉ? 🤔 Hãy hỏi cụ thể hơn, tôi sẽ tìm thông tin!',
  'ở đâu': 'Ở đâu nhỉ? 🗺️ Hãy hỏi cụ thể, tôi sẽ tìm thông tin lịch sử cho bạn!',
  'ai': 'Ai nhỉ? 🧐 Hãy hỏi cụ thể, tôi sẽ tìm thông tin về nhân vật lịch sử!',
  'cái gì': 'Cái gì vậy? 🤔 Hãy hỏi cụ thể, tôi sẽ tìm câu trả lời!',
  'bao nhiêu': 'Bao nhiêu nhỉ? 🔢 Hãy hỏi cụ thể, tôi sẽ tìm thông tin số liệu!',
  'bao lâu': 'Bao lâu nhỉ? ⏰ Hãy hỏi cụ thể, tôi sẽ tìm thông tin về thời gian!',
  'mấy': 'Mấy cái? 🤔 Hãy hỏi cụ thể hơn!',
  'gì': 'Gì vậy? 🤔 Hãy hỏi đầy đủ câu hỏi để tôi hiểu và trả lời nhé!',
  'nào': 'Nào vậy? 🤔',
  'nữa': 'Thêm nữa à? 😊',
  'hết chưa': 'Chưa hết đâu! 😅 Còn rất nhiều câu hỏi tôi có thể trả lời. Cứ hỏi tôi nhé!',
  'được': 'Được! 👍',
  'không được': 'Không sao! 😊 Có gì khác tôi có thể giúp không?',
  'nên': 'Bạn nên thử! 👍',
  'không nên': 'OK! 👍 Cẩn thận là đúng!',
  'phải': 'Phải rồi! 👍',
  'không phải': 'Ồ, vậy à? 🤔 Thế thì câu trả lời khác nhé!',
  'có lẽ': 'Có lẽ! 🤔 Có nhiều điều trong lịch sử vẫn còn là bí ẩn!',
  'chắc': 'Chắc chắn! 👍',
  'không chắc': 'Không sao! 🤔 Mình cùng tìm hiểu thêm nhé!',
  'cần': 'Bạn cần gì? 😊 Tôi sẵn sàng giúp!',
  'muốn': 'Bạn muốn gì? 😊 Tôi sẵn sàng giúp bạn tìm tài liệu!',
  'thích': 'Thích là tốt! ❤️ Hãy theo đuổi điều bạn thích!',
  'không thích': 'OK! 👍 Mỗi người có sở thích riêng!',
  'yêu thích': 'Yêu thích lịch sử à? 📚 Tuyệt vời! Đam mê là động lực học tập tốt nhất!',
  'đam mê': 'Đam mê là ngọn lửa thắp sáng tương lai! 🔥 Hãy theo đuổi đam mê của mình nhé!',
  'hứng thú': 'Có hứng thú là tốt! 🌟 Đó là cách học hiệu quả nhất!',
  'chán': 'Chán thì nghỉ ngơi một chút! 😴 Rồi quay lại với năng lượng mới!',
  'mệt mỏi': 'Mệt mỏi thì nghỉ ngơi! 😴 Sức khỏe quan trọng hơn học bài!',
  'stress': 'Stress à? 😰 Hãy thư giãn, hít thở sâu, rồi tiếp tục! 💆',
  'lo lắng': 'Đừng lo! 😊 Có tôi ở đây hỗ trợ bạn! Hãy tập trung vào những gì bạn có thể kiểm soát!',
  'sợ': 'Đừng sợ! �勇敢 Có tôi giúp đỡ bạn! Cứ hỏi tôi nhé!',
  'vui': 'Vui là tốt! 😊 Hãy giữ nụ cười nhé!',
  'hạnh phúc': 'Hạnh phúc là điều tuyệt vời! ❤️ Chúc bạn luôn hạnh phúc!',
  'tự tin': 'Tự tin là tốt! 💪 Bạn làm được!',
  'tự ti': 'Đừng tự ti! 😔 Mỗi người có giá trị riêng. Hãy tin vào bản thân nhé!',
  'ngưỡng mộ': 'Ngưỡng mộ ai đó? ⭐ Hãy học hỏi từ những tấm gương tốt!',
  'ghen tị': 'Ghen tị là bình thường! 😌 Nhưng hãy biến nó thành động lực để phấn đấu nhé!',
  'xấu hổ': 'Đừng xấu hổ! 😊 Mọi người đều có lúc sai lầm. Quan trọng là rút kinh nghiệm!',
  'tức giận': 'Bình tĩnh nào! 😤 Hít thở sâu, suy nghĩ trước khi hành động nhé!',
  'giận': 'Bình tĩnh! 😌 Giận không giải quyết được gì đâu!',
  'buồn': 'Buồn thì chia sẻ với người thân nhé! 💙 Đừng giữ trong lòng một mình!',
  'cô đơn': 'Cô đơn thì tìm người bạn trò chuyện! 💬 Tôi đây sẵn sàng chat với bạn!',
  'bất công': 'Bất công xảy ra trong lịch sử nhiều lần! 😔 Nhưng cuối cùng, công lý luôn chiến thắng!',
  'công lý': 'Công lý luôn tồn tại! ⚖️ Lịch sử đã chứng minh điều đó!',
  'bình đẳng': 'Bình đẳng là quyền của mọi người! 🤝 Xã hội đang ngày càng tiến bộ về vấn đề này!',
  'tự do': 'Tự do là giá trị thiêng liêng! 🕊️ Nhiều người đã hy sinh để giành lấy tự do cho dân tộc!',
  'độc lập': 'Độc lập là điều thiêng liêng! 🇻🇳 Nhân dân Việt Nam đã chiến đấu nhiều thế kỷ để có độc lập!',
  'chủ quyền': 'Chủ quyền quốc gia là thiêng liêng! 🏛️ Việt Nam luôn bảo vệ chủ quyền lãnh thổ!',
  'lãnh thổ': 'Lãnh thổ Việt Nam là thiêng liêng! 🗺️ Mỗi tấc đất đều được cha ông bảo vệ bằng máu!',
  'biên giới': 'Biên giới quốc gia phải được tôn trọng! 🗺️ Việt Nam luôn bảo vệ đường biên giới hòa bình!',
  'hòa bình': 'Hòa bình là điều mà nhân dân Việt Nam luôn mong ước! 🕊️ Đất nước ta trải qua nhiều chiến tranh mới có hòa bình!',
  'chiến tranh': 'Chiến tranh là điều không ai mong muốn! ⚔️ Hãy trân trọng hòa bình và học từ lịch sử để không lặp lại sai lầm!',
  'hận thù': 'Hận thù không dẫn đến đâu tốt đẹp! 💔 Hãy học cách tha thứ và hướng về tương lai!',
  'thù hận': 'Thù hận là gánh nặng! ⚖️ Hãy buông bỏ để nhẹ lòng và tiến về phía trước!',
  'đoàn kết': 'Đoàn kết là sức mạnh! 🤝 Nhân dân Việt Nam đã đoàn kết để chiến thắng mọi kẻ thù!',
  'yêu nước': 'Yêu nước là truyền thống tốt đẹp của người Việt! 🇻🇳 Hãy luôn giữ lòng yêu nước trong tim!',
  'dân tộc': 'Dân tộc Việt Nam kiên cường! 💪 54 dân tộc anh em đoàn kết một lòng!',
  ' quê hương': 'Quê hương là chùm khế ngọt! 🏡 Nơi chôn rau cắt rốn, luôn gợi nhớ trong lòng mỗi người!',
  'đất nước': 'Đất nước Việt Nam tươi đẹp! 🇻🇳 Non sông liền một dải, 54 dân tộc một nhà!',
  'bảo vệ': 'Bảo vệ Tổ quốc là nghĩa vụ thiêng liêng! 🛡️ Hãy sẵn sàng bảo vệ đất nước khi cần!',
  'xây dựng': 'Xây dựng đất nước là trách nhiệm của mỗi người! 🏗️ Hãy góp sức vào sự phát triển của Việt Nam!',
  'phát triển': 'Việt Nam đang phát triển mạnh mẽ! 📈 Cùng nhau xây dựng đất nước ngày càng giàu đẹp!',
  'tiến bộ': 'Xã hội đang tiến bộ! 📈 Công nghệ, giáo dục, kinh tế đều phát triển. Tương lai tươi sáng đang chờ!',
  'hiện đại': 'Thế giới đang hiện đại hóa! 💻 Việt Nam cũng không ngừng đổi mới và phát triển!',
  'tương lai': 'Tương lai tươi sáng đang chờ thế hệ trẻ! 🌅 Hãy cố gắng học tập để xây dựng tương lai!',
  'thế hệ trẻ': 'Trẻ em là tương lai của đất nước! 🌱 Hãy yêu thương và bảo vệ trẻ em!',
  'người già': 'Người già là kho tàng tri thức! 👴👵 Hãy kính trọng và lắng nghe những người đi trước!',
  'phụ nữ': 'Phụ nữ Việt Nam rất giỏi giang! 👩 Có nhiều nữ anh hùng trong lịch sử như Bà Trưng, Bà Triệu!',
  'nam giới': 'Nam giới Việt Nam kiên cường! 👨 Có nhiều anh hùng dân tộc như Trần Hưng Đạo, Lê Lợi, Nguyễn Huệ!',
  'bà trưng': 'Bà Trưng (257-258) - Nữ anh hùng dân tộc, cùng chị Bà Trưng khởi nghĩa chống nhà Đông Hán. 🗡️',
  'bà triệu': 'Bà Triệu (225-248) - Nữ anh hùng chống quân Ngô, tên tuổi lưu danh sử sách. 🗡️',
  'trưng sisters': 'Trưng sisters - Bà Trưng và Bà Triệu là hai nữ anh hùng huyền thoại của Việt Nam! 👑',

  // ============================================
  // THỜI GIAN & NGÀY THÁNG
  // ============================================
  'thứ 2': 'Thứ 2 đầu tuần! 💼 Bắt đầu tuần mới với tinh thần học tập tốt nhất nhé!',
  'thứ 3': 'Thứ 3 rồi! 📅 Thứ 6 còn xa, cố gắng học tập nào!',
  'thứ 4': 'Thứ 4 rồi! 📅 Gần nửa tuần rồi, cố lên!',
  'thứ 5': 'Thứ 5 rồi! 📅 Chỉ còn 1 ngày nữa là đến cuối tuần!',
  'thứ 6': 'Thứ 6 rồi! 🎉 Sắp được nghỉ cuối tuần rồi!',
  'thứ 7': 'Thứ 7! 🎊 Cuối tuần sắp đến rồi!',
  'chủ nhật': 'Chủ nhật! 🏠 Nghỉ ngơi một chút rồi ôn bài cho tuần sau nhé!',
  'tuần này': 'Tuần này bạn có kế hoạch gì? 📅 Hãy cân bằng giữa học tập và nghỉ ngơi nhé!',
  'tuần sau': 'Tuần sau! ⏳ Chuẩn bị tinh thần ôn thi thôi!',
  'tháng này': 'Tháng này bạn có gì đặc biệt không? 📆 Nếu gần thi thì ôn bài ngay nhé!',
  'năm nay': 'Năm nay là năm ${new Date().getFullYear()}. 📅 Bạn có mục tiêu gì cho năm nay không?',
  'mùa xuân': 'Mùa xuân - mùa của sự khởi đầu! 🌸 "Mùa xuân là tết trẻ em, Cả nhà người người nhớ ơn ngày giỗ Tổ".',
  'mùa hè': 'Mùa hè đến rồi! ☀️ Thời gian nghỉ hè để ôn tập và khám phá thêm kiến thức nhé!',
  'mùa thu': 'Mùa thu se lạnh! 🍂 Mùa thu Hà Nội rất đẹp với những hàng cây vàng.',
  'mùa đông': 'Mùa đông lạnh giá! ❄️ Nhưng vẫn phải học bài nhé, bạn có thể học trong nhà ấm áp.',
  'tết': 'Tết Nguyên Đán - lễ hội lớn nhất của người Việt! 🧧 Mùa xuân về, khai bút đầu năm!',
  'tết nguyên đán': 'Tết Nguyên Đán là Tết cổ truyền của dân tộc Việt Nam, diễn ra vào dịp đầu năm âm lịch. 🧧',
  'ngày nhà giáo việt nam': 'Ngày Nhà Giáo Việt Nam 20/11 - Ngày tôn vinh thầy cô giáo! 👨‍🏫 Cảm ơn các thầy cô đã dạy dỗ!',
  'ngày phụ nữ việt nam': 'Ngày Phụ nữ Việt Nam 20/10 - Ngày tôn vinh phụ nữ Việt Nam! 👩 Chúc các mẹ, các chị luôn hạnh phúc!',
  'ngày sinh trung thu': 'Tết Trung Thu (Rằm tháng 8) - Lễ hội đêm trăng tròn, trẻ em rước đèn, phá cỗ! 🏮',
  'ngày quốc khánh': 'Ngày Quốc Khánh 2/9 - Ngày Tuyên ngôn độc lập của Việt Nam! 🇻🇳',
  'ngày thương binh liệt sĩ': 'Ngày Thương binh - Liệt sĩ 27/7 - Ngày tưởng nhớ những người đã hy sinh cho Tổ quốc! 🕯️',
  'giỗ tổ': 'Giỗ Tổ Hùng Vương 10/3 âm lịch - Ngày lễ hội lớn nhất Việt Nam! 🏛️ Tưởng nhớ công ơn các vua Hùng.',
  'lịch âm': 'Lịch âm (nông lịch) có nguồn gốc từ Trung Quốc nhưng được người Việt sử dụng từ lâu, gắn liền với nông nghiệp. 📅',
  'lịch dương': 'Lịch dương là lịch quốc tế, được sử dụng phổ biến hiện nay. Việt Nam dùng cả lịch âm và lịch dương. 📅',

  // ============================================
  // KỸ NĂNG SỐNG & CUỘC SỐNG
  // ============================================
  'kỹ năng sống': 'Kỹ năng sống rất quan trọng: giao tiếp, quản lý thời gian, nấu ăn, giặt đồ... Học tập tốt nhưng cũng phải tự lập nhé! 🌟',
  'quản lý thời gian': 'Quản lý thời gian hiệu quả: 1) Lập kế hoạch, 2) Ưu tiên việc quan trọng, 3) Không hoãn lại, 4) Nghỉ ngơi hợp lý. ⏰',
  'thời gian biểu': 'Thời gian biểu giúp bạn tổ chức cuộc sống tốt hơn! 📅 Hãy lập thời gian biểu học tập và nghỉ ngơi hợp lý nhé!',
  'nghỉ ngơi': 'Nghỉ ngơi rất quan trờ! 😴 Ngủ đủ 7-8 tiếng mỗi đêm để học tập hiệu quả hơn nhé!',
  'giấc ngủ': 'Giấc ngủ quan trọng với sức khỏe và học tập! 😴 Ngủ đủ giấc, không thức khuya quá nhiều nhé!',
  'sức khỏe': 'Sức khỏe là vốn quý nhất! 💪 Hãy giữ gìn sức khỏe bằng cách ăn uống đủ chất, tập thể dục, ngủ đủ giấc.',
  'dinh dưỡng': 'Dinh dưỡng rất quan trọng! 🍎 Ăn đủ 4 nhóm chất: đạm, bột đường, béo, vitamin và khoáng chất.',
  'ăn uống': 'Ăn uống điều độ là thói quen tốt! 🍽️ Đừng bỏ bữa sáng, nó rất quan trọng cho việc học.',
  'thể thao': 'Thể thao giúp cơ thể khỏe mạnh và tinh thần sảng khoái! ⚽ Chơi thể thao đều đặn nhé!',
  'bóng đá': 'Bóng đá - môn thể thao vua! ⚽ Đội tuyển Việt Nam đã có nhiều tiến bộ, bạn theo dõi không?',
  'cầu lông': 'Cầu lông là môn thể thao phổ biến ở Việt Nam! 🏸 Rất tốt cho sức khỏe và dễ chơi!',
  'bơi lội': 'Bơi lội là kỹ năng sinh tồn quan trọng! 🏊 Vừa rèn luyện sức khỏe vừa giải trí.',
  'yoga': 'Yoga giúp thư giãn và tăng tính tập trung! 🧘 Rất tốt để kết hợp với việc học tập.',
  'du lịch': 'Du lịch mở rộng kiến thức! ✈️ Việt Nam có nhiều danh lam thắng cảnh đẹp, bạn đã đi đâu chưa?',
  'nấu ăn': 'Nấu ăn là kỹ năng cần thiết! 🍳 Biết nấu ăn, bạn sẽ tự lập hơn trong cuộc sống.',
  'làm việc nhà': 'Làm việc nhà giúp bạn trở nên tự lập! 🏠 Rửa chén, quét nhà, giặt đồ - những việc đơn giản nhưng hữu ích.',
  'tiết kiệm': 'Tiết kiệm là thói quen tốt! 💰 Hãy học cách quản lý tài chính từ sớm.',
  'bảo vệ môi trường': 'Bảo vệ môi trường là trách nhiệm của mỗi người! 🌍 Hãy góp phần bảo vệ Trái Đất xanh của chúng ta.',
  'an toàn giao thông': 'An toàn giao thông là số một! 🚦 Tuân thủ luật giao thông, đội mũ bảo hiểm khi đi xe máy.',
  'phòng chống thiên tai': 'Việt Nam thường có bão, lũ. 🌀 Hãy nắm vững kiến thức phòng chống thiên tai để bảo vệ bản thân và gia đình.',
  'sơ cứu': 'Biết sơ cứu cơ bản rất hữu ích! 🩹 Nếu bạn hoặc người xung quanh bị thương, có thể xử lý ban đầu trước khi đến bệnh viện.',

  // ============================================
  // TÂM LÝ & CẢM XÚC
  // ============================================
  'tâm lý': 'Tâm lý học đường rất quan trọng! 🧠 Đừng ngại chia sẻ nếu bạn cảm thấy áp lực, có nhiều người sẵn sàng lắng nghe bạn.',
  'áp lực học tập': 'Áp lực học tập là điều bình thường! 😰 Hãy chia nhỏ mục tiêu, nghỉ ngơi đầy đủ, và nhớ rằng bạn không是一个人 đâu!',
  'tự kỷ': 'Tự kỷ là một dạng khuyết tật phát triển. 🧩 Người tự kỷ cần được thấu hiểu và hỗ trợ từ cộng đồng.',
  'trầm cảm': 'Trầm cảm là bệnh lý cần được điều trị! 😔 Nếu bạn hoặc người thân có dấu hiệu trầm cảm, hãy tìm kiếm sự giúp đỡ từ chuyên gia tâm lý.',
  'lo âu': 'Lo âu là cảm xúc bình thường! 😰 Nhưng nếu nó ảnh hưởng đến cuộc sống hàng ngày, hãy tìm kiếm sự hỗ trợ từ người thân hoặc chuyên gia.',
  'sợ hãi': 'Sợ hãi là cảm xúc tự nhiên của con người! 😨 Hãy đối mặt với nỗi sợ, và nhớ rằng bạn mạnh mẽ hơn bạn nghĩ!',
  'xấu hổ': 'Đừng xấu hổ khi mắc lỗi! 😅 Mọi người đều sai lầm. Quan trọng là rút kinh nghiệm và tiếp tục cố gắng.',
  'tự tin': 'Tự tin là chìa khóa thành công! 💪 Hãy tin vào bản thân và những gì bạn có thể làm được!',
  'tự ti': 'Đừng tự ti! 😔 Mỗi người đều có những điểm mạnh riêng. Hãy tập trung vào điểm mạnh của bạn nhé!',
  'động lực': 'Động lực đến từ mục tiêu và đam mê! 🔥 Hãy nhớ vì sao bạn bắt đầu, và tiếp tục tiến về phía trước!',
  'mất tập trung': 'Mất tập trung à? 🤔 Thử: 1) Tắt điện thoại, 2) Học trong không gian yên tĩnh, 3) Học ngắn mỗi lần (25 phút), 4) Nghỉ giải lao giữa giờ.',
  'lười': 'Lười là kẻ thù của thành công! 😴 Nhưng đừng quá khắt khe với bản thân. Hãy bắt đầu từ những bước nhỏ!',
  'từ bỏ': 'Đừng từ bỏ! 💪 "Kiên trì là chìa khóa của thành công". Hãy tiếp tục cố gắng!',
  'hoang mang': 'Hoang mang là bình thường khi đối mặt với quyết định khó khăn! 🤔 Hãy suy nghĩ kỹ, hỏi ý kiến người thân, và tin vào lựa chọn của mình.',
  'bối rối': 'Bối rối à? 🤔 Đừng lo! Hãy bình tĩnh, phân tích vấn đề, và tìm giải pháp từng bước.',
  'bực bội': 'Bực bội thì thở sâu đi! 😤 Hít thở, đếm đến 10, rồi tiếp tục. Bạn làm được!',
  'hối hận': 'Đừng hối hận quá khứ! 😔 Mỗi sai lầm là một bài học. Hãy học từ quá khứ và hướng về tương lai!',
  'so sánh': 'Đừng so sánh bản thân với người khác! ⚖️ Mỗi người có hoàn cảnh và tốc độ phát triển riêng. Hãy tập trung vào sự tiến bộ của chính mình.',
  'ganz neu': 'Hãy tập trung vào hiện tại! 🌟 Quá khứ đã qua, tương lai chưa đến. Hãy tận dụng thời gian hiện tại thật tốt!',
  'cảm ơn': 'Cảm ơn bạn đã nói lời cảm ơn! 🙏 Lòng biết ơn là đức tính tốt đẹp. Hãy luôn biết ơn những người đã giúp đỡ bạn.',
  'xin lỗi': 'Nếu bạn làm sai điều gì, hãy dám nói lời xin lỗi! 🙏 Đó là dấu hiệu của sự trưởng thành.',
  'tha thứ': 'Học cách tha thứ là bài học khó nhưng quan trọng! 💝 Tha thứ không phải cho người khác mà cho chính mình được nhẹ lòng.',
  'kiên nhẫn': 'Kiên nhẫn là đức tính của người thành công! ⏳ Mọi thứ tốt đẹp đều cần thời gian. Hãy kiên trì nhé!',
  'biết ơn': 'Lòng biết ơn làm cuộc sống ý nghĩa hơn! 🙏 Hãy biết ơn những điều tốt đẹp trong cuộc sống.',
  'tử tế': 'Tử tế với người khác là tử tế với chính mình! 💖 Thế giới sẽ tốt đẹp hơn khi mỗi người đều tử tế.',
  'đồng cảm': 'Đồng cảm là khả năng hiểu và chia sẻ cảm xúc của người khác! 💙 Đó là đức tính quý giá của con người.',
  'tôn trọng': 'Tôn trọng người khác là tôn trọng chính mình! 🤝 Mỗi người đều xứng đáng được tôn trọng.',
  'trung thực': 'Trung thực là đức tính quý giá! 💎 Hãy luôn trung thực với bản thân và người khác.',
  'dũng cảm': 'Dũng cảm không phải là không sợ, mà là dù sợ vẫn hành động! 💪 Hãy can đảm trong mọi hoàn cảnh!',

  // ============================================
  // HỌC TẬP & ÔN THI
  // ============================================
  'học online': 'Học online tiện lợi nhưng cần tự giác! 💻 Hãy tạo không gian học tập riêng, không bị phân tâm.',
  'học ở nhà': 'Học ở nhà cần kỷ luật cao! 🏠 Hãy lập thời gian biểu và tuân thủ nghiêm túc nhé!',
  'học ở trường': 'Học ở trường có thầy cô hướng dẫn! 📚 Tập trung nghe giảng và ghi chép bài đầy đủ nhé!',
  'gia sư': 'Nếu cần hỗ trợ thêm, bạn có thể tìm gia sư! 👨‍🏫 Nhưng tự học là cách tốt nhất để hiểu bài sâu sắc.',
  'học thêm': 'Học thêm có thể giúp bạn nắm vững kiến thức hơn! 📚 Nhưng đừng phụ thuộc quá nhiều vào học thêm nhé!',
  'tự học': 'Tự học là kỹ năng quan trọng nhất! 📖 Khi bạn tự tìm tòi, bạn sẽ hiểu bài sâu hơn rất nhiều!',
  'học nhóm': 'Học nhóm rất hiệu quả! 👥 Trao đổi kiến thức với bạn bè giúp củng cố và mở rộng hiểu biết.',
  'ghi chép': 'Ghi chép bài giảng giúp nhớ lâu! ✍️ Viết tay còn giúp bạn thẩm mỹ não bộ thông tin tốt hơn.',
  'sơ đồ tư duy': 'Sơ đồ tư duy là công cụ học tập tuyệt vời! 🎨 Giúp bạn liên kết và nhớ kiến thức một cách hệ thống.',
  'flashcard': 'Flashcard là cách học hiệu quả! 🃏 Ghi câu hỏi một mặt, đáp án mặt kia, rồi tự kiểm tra.',
  'học bằng cách dạy': 'Dạy người khác là cách học hiệu quả nhất! 🗣️ Khi bạn có thể giải thích cho người khác hiểu, bạn đã thực sự hiểu bài.',
  'ôn tập': 'Ôn tập là chìa khóa của ghi nhớ! 🔑 Ôn tập định kỳ giúp kiến thức được củng cố trong trí nhớ dài hạn.',
  'luyện đề': 'Luyện đề thi thử là cách ôn thi hiệu quả! 📝 Làm đề giúp bạn làm quen với cấu trúc đề thi và quản lý thời gian.',
  'bài tập': 'Làm bài tập giúp vận dụng kiến thức! 📝 Đừng chỉ đọc mà hãy chủ động làm bài tập để hiểu sâu hơn.',
  'đề thi': 'Đề thi các năm trước là tài liệu ôn tập quý giá! 📚 Thử làm đề thi thử để đánh giá năng lực của mình nhé!',
  'thi thử': 'Thi thử online có nhiều trên mạng! 💻 Bạn có thể tìm các trang web thi thử uy tín để luyện tập.',
  'lịch thi': 'Lịch thi THPT Quốc gia thường được công bố vào tháng 5 hàng năm. 📅 Bạn nên theo dõi thông tin từ Bộ GD&ĐT.',
  'điểm chuẩn': 'Điểm chuẩn các trường đại học thay đổi mỗi năm. 📊 Hãy tham khảo điểm chuẩn của các năm trước để có kế hoạch ôn tập phù hợp.',
  'xét tuyển': 'Xét tuyển đại học có nhiều phương thức: điểm thi THPT, xét học bạ, chứng chỉ quốc tế... 📋 Tìm hiểu kỹ các phương thức xét tuyển nhé!',
  'nguyện vọng': 'Đăng ký nguyện vọng là bước quan trọng! 📝 Hãy tìm hiểu kỹ và cân nhắc kỹ trước khi đăng ký.',
  'chọn trường': 'Chọn trường đại học phù hợp rất quan trọng! 🎓 Cân nhắc: điểm chuẩn, ngành đào tạo, địa điểm, chi phí...',
  'ngành học': 'Chọn ngành học nên dựa vào đam mê và năng lực! 💡 Đừng chọn ngành chỉ vì xu hướng hay theo ý kiến người khác.',
  'nghề nghiệp': 'Tìm hiểu về nghề nghiệp tương lai là điều tốt! 💼 Biết mình muốn gì sẽ giúp bạn có động lực học tập hơn.',
  'định hướng': 'Định hướng nghề nghiệp là bước quan trọng! 🧭 Hãy tìm hiểu về các ngành nghề và liên hệ với sở thích, năng lực của bản thân.',
  'học đường': 'Học đường là thời kỳ đẹp nhất! 🌟 Hãy trân trọng khoảng thời gian này, học hỏi thật nhiều và tạo những kỷ niệm đẹp!',
  'bạn cùng lớp': 'Bạn cùng lớp là những người bạn đồng hành! 👫 Hãy đoàn kết, giúp đỡ nhau cùng tiến bộ nhé!',
  'thầy cô': 'Thầy cô là những người dẫn đường! 👨‍🏫 Hãy kính trọng và biết ơn các thầy cô giáo, những người đã dạy dỗ chúng ta.',
  'bài văn': 'Bài văn mẫu có thể tham khảo nhưng đừng sao chép! 📝 Hãy viết theo cách của riêng mình để phát triển tư duy.',
  'nghiên cứu': 'Nghiên cứu khoa học là hoạt động rất bổ ích! 🔬 Nếu có cơ hội, hãy tham gia các cuộc thi nghiên cứu khoa học nhé!',
  'olympic': 'Cuộc thi Olympic là sân chơi cho học sinh giỏi! 🏆 Nếu có năng lực, hãy thử sức với các cuộc thi Olympic nhé!',
  'văn nghệ': 'Văn nghệ giúp cân bằng cuộc sống! 🎭 Tham gia các hoạt động văn nghệ giúp bạn phát triển toàn diện.',
  'sở thích': 'Sở thích là điều quan trọng trong cuộc sống! 🎯 Hãy phát triển sở thích của riêng mình, đừng chỉ tập trung vào học tập.',
  'thư giãn': 'Thư giãn là cần thiết để tái tạo năng lượng! 😌 Đừng học quá sức, hãy dành thời gian để thư giãn nhé!',
  'cân bằng': 'Cân bằng giữa học tập và cuộc sống rất quan trọng! ⚖️ Học chăm nhưng cũng đừng quên giải trí và nghỉ ngơi.',
  'mục tiêu': 'Mục tiêu rõ ràng giúp bạn có động lực! 🎯 Hãy đặt mục tiêu cụ thể và theo đuổi nó đến cùng!',
  'thói quen': 'Thói quen tốt tạo nên cuộc sống tốt! 🌱 Hãy xây dựng những thói quen tốt như: dậy sớm, đọc sách, tập thể dục...',
  'rèn luyện': 'Rèn luyện bản thân là quá trình liên tục! 💪 Không ngừng học hỏi, không ngừng tiến bộ!',
  'phấn đấu': 'Phấn đấu vì tương lai! 🚀 Mỗi nỗ lực của bạn hôm nay sẽ được đền đáp trong tương lai!',
  'nỗ lực': 'Nỗ lực không bao giờ là uổng phí! 💯 Cứ tiếp tục cố gắng, thành công sẽ đến với bạn!',
  'cố gắng': 'Cố gắng lên! 💪 Mỗi ngày một bước tiến, bạn sẽ đạt được mục tiêu của mình!',
  'không bỏ cuộc': 'Đừng bao giờ bỏ cuộc! 🔥 "Người chiến thắng không phải là người không bao giờ ngã, mà là người không ngã mãi."',
  'thất bại': 'Thất bại là bài học quý giá! 📚 Đừng nản chí, mỗi lần ngã là một lần đứng dậy mạnh mẽ hơn!',
  'sai lầm': 'Sai lầm là phần không thể tránh khỏi của cuộc sống! 💎 Quan trọng là rút kinh nghiệm và không lặp lại!',
  'kinh nghiệm': 'Kinh nghiệm đến từ thất bại và thành công! 💡 Hãy học hỏi từ mọi trải nghiệm trong cuộc sống.',
  'thành công': 'Thành công đến với những người kiên trì! 🏆 Đừng từ bỏ, tiếp tục cố gắng!',
  'hạnh phúc': 'Hạnh phúc không chỉ đến từ thành công! 💖 Hãy trân trọng những điều nhỏ bé trong cuộc sống!',
  'ý nghĩa cuộc sống': 'Ý nghĩa cuộc sống là điều mỗi người tự định nghĩa! 🌟 Hãy sống có mục đích và đóng góp cho cộng đồng!',
};

// All suggestions for quick access
const allSuggestions = [
  { text: 'Tìm bài giảng lịch sử lớp 12', icon: BookOpen },
  { text: 'Bài giảng về chiến tranh Việt Nam', icon: BookOpen },
  { text: 'Hướng dẫn tìm tài liệu', icon: HelpCircle },
  { text: 'Tài liệu ôn thi THPT', icon: BookOpen },
  { text: 'Website có miễn phí không?', icon: Info },
  { text: 'Hôm nay là ngày mấy?', icon: Calendar },
];

// Search suggestions (to be shown when searching)
const searchSuggestions = [
  'Tìm bài giảng lịch sử lớp 12',
  'Bài giảng về chiến tranh Việt Nam',
  'Tài liệu ôn thi THPT Quốc gia',
  'Bài giảng lịch sử thế giới',
  'Tìm tài liệu về Hồ Chí Minh',
  'Bài giảng cách mạng tháng Tám',
];

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: 'Xin chào! 👋 Tôi là trợ lý tìm bài giảng. Bạn cần tìm tài liệu gì hôm nay?',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check if message matches common Q&A
  const findQAAnswer = (text) => {
    const lowerText = text.toLowerCase().trim();
    
    // Exact or partial match
    for (const [key, value] of Object.entries(commonQA)) {
      if (lowerText.includes(key) || key.includes(lowerText)) {
        return value;
      }
    }
    
    // Check for question marks patterns
    if (lowerText.includes('?')) {
      // Remove question mark and check again
      const cleanText = lowerText.replace(/\?/g, '').trim();
      for (const [key, value] of Object.entries(commonQA)) {
        if (cleanText.includes(key) || key.includes(cleanText)) {
          return value;
        }
      }
    }
    
    return null;
  };

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: 'user', text },
    ]);
    setInputValue('');
    setIsLoading(true);

    // Simulate bot typing
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          isTyping: true,
        },
      ]);
    }, 300);

    // Check for common Q&A first
    const qaAnswer = findQAAnswer(text);

    setTimeout(() => {
      if (qaAnswer) {
        // Update typing message with answer
        setMessages((prev) => prev.map((msg) =>
          msg.isTyping ? { ...msg, text: qaAnswer, isTyping: false } : msg
        ));
        setIsLoading(false);
      } else {
        // It's a search query - navigate and respond
        navigate(`/content?search=${encodeURIComponent(text)}`);
        
        setMessages((prev) => prev.map((msg) =>
          msg.isTyping ? {
            ...msg,
            text: `Đang tìm kiếm: "${text}"...`,
            isTyping: false
          } : msg
        ));

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 2,
              role: 'bot',
              text: `Đã chuyển đến trang kết quả tìm kiếm cho "${text}". Chúc bạn học tốt! 📚`,
            },
          ]);
          setIsLoading(false);
        }, 800);
      }
    }, qaAnswer ? 800 : 1200);
  };

  const handleSuggestionClick = (suggestion) => {
    // If it's a help question, just set it as input
    if (suggestion.text.includes('?') || suggestion.text.includes('Hướng dẫn') || suggestion.text.includes('miễn phí') || suggestion.text.includes('ngày mấy')) {
      setInputValue(suggestion.text);
      inputRef.current?.focus();
    } else {
      // Search questions
      setInputValue(suggestion.text);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-4 z-50 w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        aria-label="AI Assistant"
        title="Trợ lý AI tìm bài giảng"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles className="w-7 h-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-8 z-50 w-80 bg-white rounded-2xl border border-amber-200 overflow-hidden"
            style={{ maxHeight: '480px' }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">
                    Trợ lý tìm bài giảng
                  </h3>
                  <p className="text-amber-100 text-xs">Online</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-amber-50/50" style={{ maxHeight: '300px' }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {msg.role === 'bot' && (
                    <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`px-3 py-2 rounded-xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-amber-500 text-white rounded-tr-none'
                        : 'bg-white border border-amber-200 text-gray-700 rounded-tl-none'
                    }`}
                  >
                    {msg.isTyping ? (
                      <div className="flex gap-1 py-1">
                        <motion.span
                          className="w-2 h-2 bg-amber-500 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.span
                          className="w-2 h-2 bg-amber-500 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                        />
                        <motion.span
                          className="w-2 h-2 bg-amber-500 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                        />
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-amber-700" />
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="px-3 pb-2">
                <p className="text-xs text-gray-500 mb-2">Gợi ý nhanh:</p>
                <div className="flex flex-wrap gap-1">
                  {allSuggestions.map((suggestion, index) => {
                    const IconComponent = suggestion.icon;
                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-700 px-2 py-1.5 rounded-full border border-amber-200 transition-colors flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconComponent className="w-3 h-3" />
                        {suggestion.text.length > 18 ? suggestion.text.substring(0, 18) + '...' : suggestion.text}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-amber-200 bg-white">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="flex-1 px-3 py-2 text-sm border border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-amber-50"
                  disabled={isLoading}
                />
                <motion.button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-10 h-10 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                <Search className="w-3 h-3" />
                <span>Hỏi đáp hoặc tìm bài giảng</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatWidget;
