import { Meal } from '.';

describe('Meal', () => {

  describe('getMacroHistory()', () => {
    it('should calculate sum of daily macro from last week', async () => {
      const daysInWeek = 7;

      const macroHistory = await Meal.getMacroHistory();
      
      expect(macroHistory.length).toEqual(daysInWeek);
    });

    it('should sort records by day descendingly ⬇️', async () => {
      const mealMock = await Meal.save({ name: 'Soup', macro: { carbs: 40 }});
      
      const macroHistory = await Meal.getMacroHistory();
      const lastMeal = macroHistory[macroHistory.length - 1];

      expect(lastMeal.carbs).toEqual(mealMock.macro.carbs);
    });
  });

  describe('getMacroSummary()', () => {
    it('should calculate average macro from last week', async () => {
      const daysInWeek = 7;
      await Meal.save({ name: 'Soup', macro: { carbs: 40 }});
    
      const macroSummary = await Meal.getMacroSummary();

      expect(macroSummary.data.length).toEqual(daysInWeek);
      expect(macroSummary.average.carbs).toBeGreaterThan(0);
    });
  });

});