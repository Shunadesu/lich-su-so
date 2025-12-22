// Taxonomy seed data derived from _docs/README.md
// Structure: Grade -> Topics -> Sections (mục)

const commonSections = [
  { name: 'Tư liệu Lịch sử gốc', slug: 'tu-lieu-lich-su-goc' },
  { name: 'Video, phim tư liệu Lịch sử', slug: 'video-phim-tu-lieu' },
  { name: 'Video sản phẩm tạo bởi AI', slug: 'video-ai' },
  { name: 'Hình ảnh', slug: 'hinh-anh' },
  { name: 'Kế hoạch bài dạy', slug: 'ke-hoach-bai-day' },
  { name: 'Bài giảng điện tử', slug: 'bai-giang-dien-tu' },
  { name: 'Bài kiểm tra', slug: 'bai-kiem-tra' }
];

module.exports = [
  {
    grade: { name: 'Lớp 10', slug: 'lop-10', order: 10 },
    topics: [
      { name: 'Chủ đề 1: Lịch sử và Sử học', slug: 'chu-de-1-lich-su-va-su-hoc' },
      { name: 'Chủ đề 2: Vai trò của Sử học', slug: 'chu-de-2-vai-tro-cua-su-hoc' },
      { name: 'Chủ đề 3: Một số nền văn minh thế giới thời cổ - trung đại', slug: 'chu-de-3-van-minh-co-trung-dai' },
      { name: 'Chủ đề 4: Các cuộc cách mạng công nghiệp trong lịch sử thế giới', slug: 'chu-de-4-cach-mang-cong-nghiep' },
      { name: 'Chủ đề 5: Văn minh Đông Nam Á thời cổ - trung đại', slug: 'chu-de-5-van-minh-dong-nam-a' },
      { name: 'Chủ đề 6: Một số nền văn minh trên đất nước Việt Nam (trước năm 1858)', slug: 'chu-de-6-van-minh-viet-nam-truoc-1858' },
      { name: 'Chủ đề 7: Cộng đồng các dân tộc Việt Nam', slug: 'chu-de-7-cong-dong-cac-dan-toc-viet-nam' }
    ],
    sections: commonSections
  },
  {
    grade: { name: 'Lớp 11', slug: 'lop-11', order: 11 },
    topics: [
      { name: 'Chủ đề 1: Cách mạng tư sản và sự phát triển của chủ nghĩa tư bản', slug: 'chu-de-1-cach-mang-tu-san' },
      { name: 'Chủ đề 2: Chủ nghĩa xã hội từ năm 1917 đến nay', slug: 'chu-de-2-chu-nghia-xa-hoi-1917-den-nay' },
      { name: 'Chủ đề 3: Quá trình giành độc lập của các quốc gia Đông Nam Á', slug: 'chu-de-3-doc-lap-dong-nam-a' },
      { name: 'Chủ đề 4: Chiến tranh bảo vệ Tổ quốc và chiến tranh giải phóng dân tộc trong lịch sử Việt Nam (trước CMTT 1945)', slug: 'chu-de-4-chien-tranh-bao-ve-to-quoc-truoc-1945' },
      { name: 'Chủ đề 5: Một số cuộc cải cách lớn trong lịch sử Việt Nam (trước năm 1858)', slug: 'chu-de-5-cai-cach-lon-truoc-1858' },
      { name: 'Chủ đề 6: Lịch sử bảo vệ chủ quyền, quyền và lợi ích hợp pháp của Việt Nam ở Biển Đông', slug: 'chu-de-6-chu-quyen-bien-dong' }
    ],
    sections: commonSections
  },
  {
    grade: { name: 'Lớp 12', slug: 'lop-12', order: 12 },
    topics: [
      { name: 'Chủ đề 1: Thế giới trong và sau Chiến tranh Lạnh', slug: 'chu-de-1-the-gioi-trong-va-sau-ctl' },
      { name: 'Chủ đề 2: ASEAN: Những chặng đường lịch sử', slug: 'chu-de-2-asean' },
      { name: 'Chủ đề 3: Cách mạng tháng Tám 1945, chiến tranh giải phóng dân tộc và chiến tranh bảo vệ Tổ quốc (từ 8/1945 đến nay)', slug: 'chu-de-3-cmt8-va-chien-tranh' },
      { name: 'Chủ đề 4: Công cuộc đổi mới ở Việt Nam từ 1986 đến nay', slug: 'chu-de-4-doi-moi-1986' },
      { name: 'Chủ đề 5: Lịch sử đối ngoại của Việt Nam thời cận - hiện đại', slug: 'chu-de-5-lich-su-doi-ngoai' },
      { name: 'Chủ đề 6: Hồ Chí Minh trong lịch sử Việt Nam', slug: 'chu-de-6-ho-chi-minh' }
    ],
    sections: commonSections
  }
];

