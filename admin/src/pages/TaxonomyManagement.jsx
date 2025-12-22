import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Edit2, Trash2, RefreshCcw, AlertCircle } from 'lucide-react';
import { taxonomyAPI } from '../services/api';
import toast from 'react-hot-toast';

const emptyForm = { id: null, name: '', slug: '', order: 0 };

const TaxonomyManagement = () => {
  const queryClient = useQueryClient();
  const [selectedGradeId, setSelectedGradeId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  const [gradeForm, setGradeForm] = useState(emptyForm);
  const [topicForm, setTopicForm] = useState(emptyForm);
  const [sectionForm, setSectionForm] = useState(emptyForm);

  const { data, isLoading, error, isFetching } = useQuery(
    ['taxonomy'],
    () => taxonomyAPI.getTree(),
    { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }
  );

  const grades = data?.data?.data || [];
  const selectedGrade = grades.find((g) => g._id === selectedGradeId) || null;
  const topics = selectedGrade?.topics || [];
  const selectedTopic = topics.find((t) => t._id === selectedTopicId) || null;
  const sections = selectedTopic?.sections || [];

  const invalidate = () => queryClient.invalidateQueries(['taxonomy']);

  // Mutations
  const gradeCreate = useMutation((payload) => taxonomyAPI.createGrade(payload), {
    onSuccess: () => { toast.success('Đã thêm Lớp'); invalidate(); setGradeForm(emptyForm); },
    onError: () => toast.error('Lỗi thêm Lớp'),
  });
  const gradeUpdate = useMutation(({ id, data }) => taxonomyAPI.updateGrade(id, data), {
    onSuccess: () => { toast.success('Đã cập nhật Lớp'); invalidate(); setGradeForm(emptyForm); },
    onError: () => toast.error('Lỗi cập nhật Lớp'),
  });
  const gradeDelete = useMutation((id) => taxonomyAPI.deleteGrade(id), {
    onSuccess: () => { toast.success('Đã xóa Lớp'); invalidate(); setSelectedGradeId(null); setSelectedTopicId(null); },
    onError: (err) => toast.error(err.response?.data?.message || 'Lỗi xóa Lớp'),
  });

  const topicCreate = useMutation((payload) => taxonomyAPI.createTopic(payload), {
    onSuccess: () => { toast.success('Đã thêm Chủ đề'); invalidate(); setTopicForm(emptyForm); },
    onError: () => toast.error('Lỗi thêm Chủ đề'),
  });
  const topicUpdate = useMutation(({ id, data }) => taxonomyAPI.updateTopic(id, data), {
    onSuccess: () => { toast.success('Đã cập nhật Chủ đề'); invalidate(); setTopicForm(emptyForm); },
    onError: () => toast.error('Lỗi cập nhật Chủ đề'),
  });
  const topicDelete = useMutation((id) => taxonomyAPI.deleteTopic(id), {
    onSuccess: () => { toast.success('Đã xóa Chủ đề'); invalidate(); setSelectedTopicId(null); },
    onError: (err) => toast.error(err.response?.data?.message || 'Lỗi xóa Chủ đề'),
  });

  const sectionCreate = useMutation((payload) => taxonomyAPI.createSection(payload), {
    onSuccess: () => { toast.success('Đã thêm Mục'); invalidate(); setSectionForm(emptyForm); },
    onError: () => toast.error('Lỗi thêm Mục'),
  });
  const sectionUpdate = useMutation(({ id, data }) => taxonomyAPI.updateSection(id, data), {
    onSuccess: () => { toast.success('Đã cập nhật Mục'); invalidate(); setSectionForm(emptyForm); },
    onError: () => toast.error('Lỗi cập nhật Mục'),
  });
  const sectionDelete = useMutation((id) => taxonomyAPI.deleteSection(id), {
    onSuccess: () => { toast.success('Đã xóa Mục'); invalidate(); },
    onError: (err) => toast.error(err.response?.data?.message || 'Lỗi xóa Mục'),
  });

  const handleSubmitGrade = (e) => {
    e.preventDefault();
    const payload = { name: gradeForm.name.trim(), slug: gradeForm.slug.trim(), order: Number(gradeForm.order) || 0 };
    if (gradeForm.id) gradeUpdate.mutate({ id: gradeForm.id, data: payload });
    else gradeCreate.mutate(payload);
  };

  const handleSubmitTopic = (e) => {
    e.preventDefault();
    if (!selectedGradeId) return toast.error('Chọn Lớp trước khi thêm Chủ đề');
    const payload = { name: topicForm.name.trim(), slug: topicForm.slug.trim(), order: Number(topicForm.order) || 0, gradeId: selectedGradeId };
    if (topicForm.id) topicUpdate.mutate({ id: topicForm.id, data: payload });
    else topicCreate.mutate(payload);
  };

  const handleSubmitSection = (e) => {
    e.preventDefault();
    if (!selectedTopicId) return toast.error('Chọn Chủ đề trước khi thêm Mục');
    const payload = { name: sectionForm.name.trim(), slug: sectionForm.slug.trim(), order: Number(sectionForm.order) || 0, topicId: selectedTopicId };
    if (sectionForm.id) sectionUpdate.mutate({ id: sectionForm.id, data: payload });
    else sectionCreate.mutate(payload);
  };

  if (isLoading) {
    return <div className="p-6">Đang tải danh mục...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 flex items-center gap-2">
        <AlertCircle className="h-5 w-5" /> Lỗi tải taxonomy
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
          <p className="text-gray-600">CRUD Lớp / Chủ đề / Mục</p>
        </div>
        <button
          onClick={() => invalidate()}
          className="inline-flex items-center px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Làm mới
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Grades */}
        <div className="bg-white rounded-lg shadow-sm border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Lớp</h2>
            <button
              onClick={() => setGradeForm(emptyForm)}
              className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" /> Thêm
            </button>
          </div>
          <form onSubmit={handleSubmitGrade} className="space-y-2">
            <input
              type="text"
              placeholder="Tên lớp (ví dụ: Lớp 10)"
              value={gradeForm.name}
              onChange={(e) => setGradeForm({ ...gradeForm, name: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Slug (ví dụ: lop-10)"
              value={gradeForm.slug}
              onChange={(e) => setGradeForm({ ...gradeForm, slug: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Thứ tự"
              value={gradeForm.order}
              onChange={(e) => setGradeForm({ ...gradeForm, order: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {gradeForm.id ? 'Cập nhật' : 'Thêm lớp'}
            </button>
          </form>
          <div className="divide-y">
            {grades.map((g) => (
              <div
                key={g._id}
                className={`py-2 px-2 rounded cursor-pointer ${selectedGradeId === g._id ? 'bg-blue-50 border border-blue-100' : ''}`}
                onClick={() => { setSelectedGradeId(g._id); setSelectedTopicId(null); }}
              >
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-semibold">{g.name}</div>
                    <div className="text-gray-500 text-xs">{g.slug}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setGradeForm({ id: g._id, name: g.name, slug: g.slug, order: g.order ?? 0 }); }}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (window.confirm('Xóa lớp này?')) gradeDelete.mutate(g._id); }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div className="bg-white rounded-lg shadow-sm border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Chủ đề</h2>
            <button
              onClick={() => setTopicForm(emptyForm)}
              className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
              disabled={!selectedGradeId}
            >
              <Plus className="h-4 w-4 mr-1" /> Thêm
            </button>
          </div>
          <form onSubmit={handleSubmitTopic} className="space-y-2">
            <input
              type="text"
              placeholder="Tên chủ đề"
              value={topicForm.name}
              onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
              disabled={!selectedGradeId}
            />
            <input
              type="text"
              placeholder="Slug"
              value={topicForm.slug}
              onChange={(e) => setTopicForm({ ...topicForm, slug: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
              disabled={!selectedGradeId}
            />
            <input
              type="number"
              placeholder="Thứ tự"
              value={topicForm.order}
              onChange={(e) => setTopicForm({ ...topicForm, order: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              disabled={!selectedGradeId}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={!selectedGradeId}
            >
              {topicForm.id ? 'Cập nhật' : 'Thêm chủ đề'}
            </button>
          </form>
          {!selectedGradeId && <p className="text-sm text-gray-500">Chọn Lớp để xem Chủ đề</p>}
          <div className="divide-y">
            {topics.map((t) => (
              <div
                key={t._id}
                className={`py-2 px-2 rounded cursor-pointer ${selectedTopicId === t._id ? 'bg-emerald-50 border border-emerald-100' : ''}`}
                onClick={() => setSelectedTopicId(t._id)}
              >
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.slug}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setTopicForm({ id: t._id, name: t.name, slug: t.slug, order: t.order ?? 0 }); }}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (window.confirm('Xóa chủ đề này?')) topicDelete.mutate(t._id); }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="bg-white rounded-lg shadow-sm border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Mục</h2>
            <button
              onClick={() => setSectionForm(emptyForm)}
              className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
              disabled={!selectedTopicId}
            >
              <Plus className="h-4 w-4 mr-1" /> Thêm
            </button>
          </div>
          <form onSubmit={handleSubmitSection} className="space-y-2">
            <input
              type="text"
              placeholder="Tên mục"
              value={sectionForm.name}
              onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
              disabled={!selectedTopicId}
            />
            <input
              type="text"
              placeholder="Slug"
              value={sectionForm.slug}
              onChange={(e) => setSectionForm({ ...sectionForm, slug: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
              disabled={!selectedTopicId}
            />
            <input
              type="number"
              placeholder="Thứ tự"
              value={sectionForm.order}
              onChange={(e) => setSectionForm({ ...sectionForm, order: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              disabled={!selectedTopicId}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={!selectedTopicId}
            >
              {sectionForm.id ? 'Cập nhật' : 'Thêm mục'}
            </button>
          </form>
          {!selectedTopicId && <p className="text-sm text-gray-500">Chọn Chủ đề để xem Mục</p>}
          <div className="divide-y">
            {sections.map((s) => (
              <div
                key={s._id}
                className="py-2 px-2 rounded cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-gray-500 text-xs">{s.slug}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSectionForm({ id: s._id, name: s.name, slug: s.slug, order: s.order ?? 0 }); }}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (window.confirm('Xóa mục này?')) sectionDelete.mutate(s._id); }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxonomyManagement;

