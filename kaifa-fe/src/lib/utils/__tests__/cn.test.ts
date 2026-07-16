import { cn } from '../cn';

describe('cn utility', () => {
  it('returns a single class unchanged', () => {
    expect(cn('foo')).toBe('foo');
  });

  it('merges multiple classes', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('ignores falsy values', () => {
    expect(cn('foo', false, null, undefined, 'bar')).toBe('foo bar');
  });

  it('resolves tailwind conflicts (last wins)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('resolves complex tailwind conflicts', () => {
    expect(cn('text-red-500', 'text-blue-600')).toBe('text-blue-600');
  });

  it('supports conditional classes via object syntax', () => {
    expect(cn({ 'font-bold': true, italic: false })).toBe('font-bold');
  });
});
