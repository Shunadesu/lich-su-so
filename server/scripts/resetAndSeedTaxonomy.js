/* eslint-disable no-console */
const mongoose = require('mongoose');
require('dotenv').config();

const Content = require('../models/Content');
const Grade = require('../models/Grade');
const Topic = require('../models/Topic');
const Section = require('../models/Section');
const taxonomyData = require('../seed/taxonomyData');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lich-su-so';
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');
};

const resetData = async () => {
  console.log('⚠️  Deleting contents and taxonomy (grades/topics/sections)...');
  await Content.deleteMany({});
  await Grade.deleteMany({});
  await Topic.deleteMany({});
  await Section.deleteMany({});
  console.log('🗑️  Cleared Content, Grade, Topic, Section collections');

  // Drop old unique index on slug if it still exists (migration)
  try {
    const sectionIndexes = await Section.collection.indexes();
    const hasOldSlugIndex = sectionIndexes.find((idx) => idx.name === 'slug_1');
    if (hasOldSlugIndex) {
      console.log('🧹 Dropping legacy index slug_1 on sections...');
      await Section.collection.dropIndex('slug_1');
      console.log('✅ Dropped legacy index slug_1');
    }
  } catch (idxErr) {
    console.warn('⚠️  Could not inspect/drop old slug_1 index on sections:', idxErr.message);
  }
};

const seedTaxonomy = async () => {
  console.log('🌱 Seeding taxonomy from taxonomyData.js ...');

  for (const gradeData of taxonomyData) {
    const grade = await Grade.create(gradeData.grade);

    for (const [tIndex, topicData] of gradeData.topics.entries()) {
      const topic = await Topic.create({
        ...topicData,
        grade: grade._id,
        order: topicData.order ?? tIndex
      });

      for (const [sIndex, sectionData] of gradeData.sections.entries()) {
        await Section.create({
          ...sectionData,
          topic: topic._id,
          order: sectionData.order ?? sIndex
        });
      }
    }
  }

  console.log('✅ Seeded taxonomy successfully');
};

const run = async () => {
  try {
    await connectDB();
    await resetData();
    await seedTaxonomy();

    const grades = await Grade.countDocuments();
    const topics = await Topic.countDocuments();
    const sections = await Section.countDocuments();
    const contents = await Content.countDocuments();

    console.log('\n📊 Summary after seed:');
    console.log('   Grades   :', grades);
    console.log('   Topics   :', topics);
    console.log('   Sections :', sections);
    console.log('   Contents :', contents);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error during reset/seed:', err);
    process.exit(1);
  }
};

run();

