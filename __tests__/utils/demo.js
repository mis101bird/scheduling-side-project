import { calcScheduleAllHour } from '../../src/utils/briefCalcUtils';

test('if utils mocked automatically', () => {
  const sum = calcScheduleAllHour({})
  expect(sum).toBe(0);
});