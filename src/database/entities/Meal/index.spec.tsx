import { Meal } from '.';

describe('Meal', () => {

  describe('getMacroHistory()', () => {
    it('should sum daily macro from last week', async () => {
      const daysInWeek = 7;
      const mealMock = await Meal.save({ name: 'Soup', macro: { carbs: 40 }});
    
      const macroHistory = await Meal.getMacroHistory();
      
      expect(macroHistory.length).toEqual(daysInWeek);
      expect(macroHistory[macroHistory.length - 1].carbs).toEqual(mealMock.macro.carbs);
    });
  });

  describe('getMacroSummary()', () => {
    it('should calculate average macro from last week', async () => {
      await Meal.save({ name: 'Soup', macro: { carbs: 40 }});
    
      const macroSummary = await Meal.getMacroSummary();

      expect(macroSummary.average.carbs).toBeGreaterThan(0);
    });
  });

});