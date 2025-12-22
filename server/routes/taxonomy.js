const express = require('express');
const { body, validationResult } = require('express-validator');
const Grade = require('../models/Grade');
const Topic = require('../models/Topic');
const Section = require('../models/Section');
const Content = require('../models/Content');
const taxonomyData = require('../seed/taxonomyData');
const { auth, isTeacher } = require('../middleware/auth');

const router = express.Router();

const formatErrors = (errors) => ({
  success: false,
  errors: errors.array()
});

// Build taxonomy tree: grade -> topics -> sections
const buildTree = async () => {
  const grades = await Grade.find().sort({ order: 1, name: 1 }).lean();
  const topics = await Topic.find().sort({ order: 1, name: 1 }).lean();
  const sections = await Section.find().sort({ order: 1, name: 1 }).lean();

  const topicsByGrade = topics.reduce((acc, t) => {
    acc[t.grade.toString()] = acc[t.grade.toString()] || [];
    acc[t.grade.toString()].push(t);
    return acc;
  }, {});

  const sectionsByTopic = sections.reduce((acc, s) => {
    acc[s.topic.toString()] = acc[s.topic.toString()] || [];
    acc[s.topic.toString()].push(s);
    return acc;
  }, {});

  return grades.map((g) => ({
    ...g,
    topics: (topicsByGrade[g._id.toString()] || []).map((t) => ({
      ...t,
      sections: sectionsByTopic[t._id.toString()] || []
    }))
  }));
};

// GET /api/taxonomy - public
router.get('/', async (req, res) => {
  try {
    const tree = await buildTree();
    res.json({ success: true, data: tree });
  } catch (err) {
    console.error('Error fetching taxonomy:', err);
    res.status(500).json({ success: false, message: 'Lỗi tải taxonomy' });
  }
});

// POST /api/taxonomy/seed - reset and seed defaults (teacher only)
router.post('/seed', auth, isTeacher, async (req, res) => {
  try {
    await Grade.deleteMany({});
    await Topic.deleteMany({});
    await Section.deleteMany({});

    for (const gradeData of taxonomyData) {
      const grade = await Grade.create(gradeData.grade);

      // create topics for grade
      for (const [index, topicData] of gradeData.topics.entries()) {
        const topic = await Topic.create({
          ...topicData,
          grade: grade._id,
          order: topicData.order ?? index
        });

        // create sections for topic
        for (const [sIndex, sectionData] of gradeData.sections.entries()) {
          await Section.create({
            ...sectionData,
            topic: topic._id,
            order: sectionData.order ?? sIndex
          });
        }
      }
    }

    const tree = await buildTree();
    res.json({ success: true, message: 'Đã seed taxonomy mặc định', data: tree });
  } catch (err) {
    console.error('Error seeding taxonomy:', err);
    res.status(500).json({ success: false, message: 'Lỗi seed taxonomy' });
  }
});

// Create grade
router.post('/grades', auth, isTeacher, [
  body('name').notEmpty().withMessage('Tên lớp là bắt buộc'),
  body('slug').notEmpty().withMessage('Slug là bắt buộc')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(formatErrors(errors));

  try {
    const grade = await Grade.create({
      name: req.body.name,
      slug: req.body.slug.toLowerCase(),
      order: req.body.order ?? 0
    });
    res.json({ success: true, data: grade });
  } catch (err) {
    console.error('Error creating grade:', err);
    res.status(500).json({ success: false, message: 'Lỗi tạo lớp' });
  }
});

// Update grade
router.put('/grades/:id', auth, isTeacher, [
  body('name').optional().notEmpty(),
  body('slug').optional().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(formatErrors(errors));

  try {
    const updated = await Grade.findByIdAndUpdate(
      req.params.id,
      {
        ...(req.body.name ? { name: req.body.name } : {}),
        ...(req.body.slug ? { slug: req.body.slug.toLowerCase() } : {}),
        ...(req.body.order !== undefined ? { order: req.body.order } : {})
      },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Error updating grade:', err);
    res.status(500).json({ success: false, message: 'Lỗi cập nhật lớp' });
  }
});

// Delete grade (only if no topics)
router.delete('/grades/:id', auth, isTeacher, async (req, res) => {
  try {
    const topics = await Topic.countDocuments({ grade: req.params.id });
    if (topics > 0) {
      return res.status(400).json({ success: false, message: 'Không thể xóa lớp vì còn chủ đề con' });
    }
    await Grade.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Đã xóa lớp' });
  } catch (err) {
    console.error('Error deleting grade:', err);
    res.status(500).json({ success: false, message: 'Lỗi xóa lớp' });
  }
});

// Create topic
router.post('/topics', auth, isTeacher, [
  body('name').notEmpty().withMessage('Tên chủ đề là bắt buộc'),
  body('slug').notEmpty().withMessage('Slug là bắt buộc'),
  body('gradeId').notEmpty().withMessage('Grade là bắt buộc')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(formatErrors(errors));

  try {
    const topic = await Topic.create({
      name: req.body.name,
      slug: req.body.slug.toLowerCase(),
      grade: req.body.gradeId,
      order: req.body.order ?? 0
    });
    res.json({ success: true, data: topic });
  } catch (err) {
    console.error('Error creating topic:', err);
    res.status(500).json({ success: false, message: 'Lỗi tạo chủ đề' });
  }
});

// Update topic
router.put('/topics/:id', auth, isTeacher, [
  body('name').optional().notEmpty(),
  body('slug').optional().notEmpty(),
  body('gradeId').optional().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(formatErrors(errors));

  try {
    const updated = await Topic.findByIdAndUpdate(
      req.params.id,
      {
        ...(req.body.name ? { name: req.body.name } : {}),
        ...(req.body.slug ? { slug: req.body.slug.toLowerCase() } : {}),
        ...(req.body.gradeId ? { grade: req.body.gradeId } : {}),
        ...(req.body.order !== undefined ? { order: req.body.order } : {})
      },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Error updating topic:', err);
    res.status(500).json({ success: false, message: 'Lỗi cập nhật chủ đề' });
  }
});

// Delete topic (only if no sections)
router.delete('/topics/:id', auth, isTeacher, async (req, res) => {
  try {
    const sections = await Section.countDocuments({ topic: req.params.id });
    if (sections > 0) {
      return res.status(400).json({ success: false, message: 'Không thể xóa chủ đề vì còn mục con' });
    }
    await Topic.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Đã xóa chủ đề' });
  } catch (err) {
    console.error('Error deleting topic:', err);
    res.status(500).json({ success: false, message: 'Lỗi xóa chủ đề' });
  }
});

// Create section
router.post('/sections', auth, isTeacher, [
  body('name').notEmpty().withMessage('Tên mục là bắt buộc'),
  body('slug').notEmpty().withMessage('Slug là bắt buộc'),
  body('topicId').notEmpty().withMessage('Topic là bắt buộc')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(formatErrors(errors));

  try {
    const section = await Section.create({
      name: req.body.name,
      slug: req.body.slug.toLowerCase(),
      topic: req.body.topicId,
      order: req.body.order ?? 0
    });
    res.json({ success: true, data: section });
  } catch (err) {
    console.error('Error creating section:', err);
    res.status(500).json({ success: false, message: 'Lỗi tạo mục' });
  }
});

// Update section
router.put('/sections/:id', auth, isTeacher, [
  body('name').optional().notEmpty(),
  body('slug').optional().notEmpty(),
  body('topicId').optional().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(formatErrors(errors));

  try {
    const updated = await Section.findByIdAndUpdate(
      req.params.id,
      {
        ...(req.body.name ? { name: req.body.name } : {}),
        ...(req.body.slug ? { slug: req.body.slug.toLowerCase() } : {}),
        ...(req.body.topicId ? { topic: req.body.topicId } : {}),
        ...(req.body.order !== undefined ? { order: req.body.order } : {})
      },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Error updating section:', err);
    res.status(500).json({ success: false, message: 'Lỗi cập nhật mục' });
  }
});

// Delete section (only if no contents)
router.delete('/sections/:id', auth, isTeacher, async (req, res) => {
  try {
    const contents = await Content.countDocuments({ section: req.params.id });
    if (contents > 0) {
      return res.status(400).json({ success: false, message: 'Không thể xóa mục vì còn nội dung sử dụng' });
    }
    await Section.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Đã xóa mục' });
  } catch (err) {
    console.error('Error deleting section:', err);
    res.status(500).json({ success: false, message: 'Lỗi xóa mục' });
  }
});

module.exports = router;

