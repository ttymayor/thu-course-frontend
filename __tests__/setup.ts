import { vi } from 'vitest';

// 模擬 React cache 功能
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    cache: <T extends (...args: unknown[]) => unknown>(fn: T): T => fn, // 在測試環境中直接返回原函式
  };
});

// 模擬 MongoDB 連接
vi.mock('@/lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue(undefined)
}));

// 模擬 mongoose
vi.mock('mongoose', () => ({
  default: {
    connect: vi.fn().mockResolvedValue(undefined),
    models: {},
    model: vi.fn(),
    Schema: vi.fn()
  }
}));

// 模擬 getCourseSchedules 函式
vi.mock('@/lib/courseSchedule', () => ({
  getCourseSchedules: vi.fn().mockResolvedValue([
    {
      _id: '1',
      course_stage: '第一階段選課',
      status: '開放',
      start_time: '2024-01-01T00:00:00Z',
      end_time: '2024-01-07T23:59:59Z',
      result_publish_time: '2024-01-08T00:00:00Z'
    },
    {
      _id: '2',
      course_stage: '第二階段選課',
      status: '未開放',
      start_time: '2024-01-15T00:00:00Z',
      end_time: '2024-01-21T23:59:59Z',
      result_publish_time: '2024-01-22T00:00:00Z'
    }
  ])
}));

// 模擬 CourseScheduleList 組件
vi.mock('@/components/CourseScheduleList', async () => {
  const React = await import('react');
  return {
    default: () => {
      return React.createElement('div', { 'data-testid': 'course-schedule-list' },
        React.createElement('h2', null, '選課時程'),
        React.createElement('p', null, '來看看選課時程表吧')
      );
    }
  };
});

// 設置測試環境變數
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.MONGODB_DB_NAME = 'test';
