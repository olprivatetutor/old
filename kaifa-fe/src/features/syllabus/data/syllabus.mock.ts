import type { SyllabusCatalog } from '../types/syllabus.types';

const curriculum = 'Bahasa Inggris CEFR';
const subject = 'English';
const language = 'english';

export const englishSyllabi: SyllabusCatalog[] = [
  {
    id: 'syllabus-kelas-9',
    grade: 9,
    level: 'SMP Islam',
    cefr: 'A2-B1',
    subject,
    language,
    curriculum,
    units: [
      {
        unit_id: 'unit-9-1',
        unit_title: 'Personal Identity & Social Interaction',
        items: [
          {
            item_id: 'modul-9-1-1',
            module_title: 'Introducing Yourself',
            topics: [
              'Greetings & Islamic Etiquette',
              'Personal Information',
              'Talking About Yourself',
              'Introducing Friends',
              'Assessment',
            ],
          },
          {
            item_id: 'modul-9-1-2',
            module_title: 'Family & Relationships',
            topics: [
              'Family Members',
              'Describing Family',
              'Family Activities',
              'Family Conversation',
              'Project',
            ],
          },
        ],
      },
      {
        unit_id: 'unit-9-2',
        unit_title: 'School Life',
        items: [
          {
            item_id: 'modul-9-2-1',
            module_title: 'School Environment',
            topics: ['Places at School', 'Facilities', 'Rules', 'Asking for Help'],
          },
          {
            item_id: 'modul-9-2-2',
            module_title: 'Subjects & Schedules',
            topics: ['School Subjects', 'Timetable', 'Favorite Subject', 'Classroom Discussion'],
          },
        ],
      },
      {
        unit_id: 'unit-9-3',
        unit_title: 'Daily Life & Habits',
        items: [
          {
            item_id: 'modul-9-3-1',
            module_title: 'Daily Activities',
            topics: ['Daily Routine', 'Weekend Activities', 'Frequency Expressions'],
          },
          {
            item_id: 'modul-9-3-2',
            module_title: 'Time Management',
            topics: ['Telling Time', 'Making Schedules', 'Productive Habits', 'Study Planning'],
          },
        ],
      },
      {
        unit_id: 'unit-9-4',
        unit_title: 'Hobbies & Interests',
        items: [
          {
            item_id: 'modul-9-4-1',
            module_title: 'Hobbies',
            topics: ['Sports', 'Reading', 'Gaming', 'Arts & Creativity'],
          },
          {
            item_id: 'modul-9-4-2',
            module_title: 'Clubs & Communities',
            topics: ['School Clubs', 'Community Activities', 'Volunteering'],
          },
        ],
      },
      {
        unit_id: 'unit-9-5',
        unit_title: 'Health & Lifestyle',
        items: [
          {
            item_id: 'modul-9-5-1',
            module_title: 'Healthy Living',
            topics: ['Food', 'Exercise', 'Sleep', 'Mental Health'],
          },
          {
            item_id: 'modul-9-5-2',
            module_title: 'Visiting a Doctor',
            topics: ['Symptoms', 'Advice', 'Roleplay'],
          },
        ],
      },
      {
        unit_id: 'unit-9-6',
        unit_title: 'Travel & Directions',
        items: [
          {
            item_id: 'modul-9-6-1',
            module_title: 'Public Places',
            topics: ['Asking Directions', 'Giving Directions', 'Reading Maps'],
          },
          {
            item_id: 'modul-9-6-2',
            module_title: 'Transportation',
            topics: ['Buying Tickets', 'Travel Conversations'],
          },
        ],
      },
      {
        unit_id: 'unit-9-7',
        unit_title: 'Experiences & Storytelling',
        items: [
          {
            item_id: 'modul-9-7-1',
            module_title: 'Memorable Experiences',
            topics: ['School Events', 'Holiday Experiences'],
          },
          {
            item_id: 'modul-9-7-2',
            module_title: 'Recount Text',
            topics: ['Past Tense', 'Sequencing Events', 'Writing Recount'],
          },
        ],
      },
      {
        unit_id: 'unit-9-8',
        unit_title: 'Future Plans',
        items: [
          {
            item_id: 'modul-9-8-1',
            module_title: 'Dream Jobs',
            topics: ['Educational Goals', 'Personal Development'],
          },
          {
            item_id: 'modul-9-8-2',
            module_title: 'Future Intentions',
            topics: ['Commitments', 'Vision Board Project'],
          },
        ],
      },
    ],
  },
  {
    id: 'syllabus-kelas-12',
    grade: 12,
    level: 'SMA Islam',
    cefr: 'B1-B2',
    subject,
    language,
    curriculum,
    units: [
      {
        unit_id: 'unit-12-1',
        unit_title: 'Academic & Professional Communication',
        items: [
          { item_id: 'modul-12-1-1', module_title: 'Formal Communication' },
          { item_id: 'modul-12-1-2', module_title: 'Email & Correspondence' },
        ],
      },
      {
        unit_id: 'unit-12-2',
        unit_title: 'Higher Education & Careers',
        items: [
          { item_id: 'modul-12-2-1', module_title: 'University Life' },
          { item_id: 'modul-12-2-2', module_title: 'Career Preparation' },
          { item_id: 'modul-12-2-3', module_title: 'CV & Resume' },
          { item_id: 'modul-12-2-4', module_title: 'Job Interviews' },
        ],
      },
      {
        unit_id: 'unit-12-3',
        unit_title: 'Technology & Digital Society',
        items: [
          { item_id: 'modul-12-3-1', module_title: 'Digital Communication' },
          { item_id: 'modul-12-3-2', module_title: 'Artificial Intelligence' },
          { item_id: 'modul-12-3-3', module_title: 'AI Debate' },
        ],
      },
      {
        unit_id: 'unit-12-4',
        unit_title: 'Global Issues',
        items: [
          { item_id: 'modul-12-4-1', module_title: 'Environment' },
          { item_id: 'modul-12-4-2', module_title: 'Sustainability' },
          { item_id: 'modul-12-4-3', module_title: 'Social Issues' },
        ],
      },
      {
        unit_id: 'unit-12-5',
        unit_title: 'Critical Thinking & Opinion',
        items: [
          { item_id: 'modul-12-5-1', module_title: 'Expressing Opinions' },
          { item_id: 'modul-12-5-2', module_title: 'Debate Structure' },
          { item_id: 'modul-12-5-3', module_title: 'Formal Debate Practice' },
        ],
      },
      {
        unit_id: 'unit-12-6',
        unit_title: 'Business & Entrepreneurship',
        items: [
          { item_id: 'modul-12-6-1', module_title: 'Business Fundamentals' },
          { item_id: 'modul-12-6-2', module_title: 'Entrepreneurship' },
          { item_id: 'modul-12-6-3', module_title: 'Startup Ideas' },
          { item_id: 'modul-12-6-4', module_title: 'Pitching' },
        ],
      },
      {
        unit_id: 'unit-12-7',
        unit_title: 'Media & Information Literacy',
        items: [
          { item_id: 'modul-12-7-1', module_title: 'News & Journalism' },
          { item_id: 'modul-12-7-2', module_title: 'Fake News Detection' },
          { item_id: 'modul-12-7-3', module_title: 'Public Speaking' },
        ],
      },
      {
        unit_id: 'unit-12-8',
        unit_title: 'Leadership & Future Readiness',
        items: [
          { item_id: 'modul-12-8-1', module_title: 'Leadership' },
          { item_id: 'modul-12-8-2', module_title: 'Teamwork' },
          { item_id: 'modul-12-8-3', module_title: 'Conflict Resolution' },
          { item_id: 'modul-12-8-4', module_title: 'Future Planning Project' },
        ],
      },
    ],
  },
];
