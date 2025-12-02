const filterHabits = (habits, hideExpired) => {
  if (!hideExpired) return habits;
  return habits.filter(h => !h.is_expired);
};

describe('Filtra habitos por expired flaag', () => {
  test('hideExpired=false returna todos os habitos', () => {
    const habits = [
      { id: 1, name: 'A', is_expired: false },
      { id: 2, name: 'B', is_expired: true },
    ];
    const res = filterHabits(habits, false);
    expect(res).toHaveLength(2);
    expect(res).toEqual(habits);
  });

  test('hideExpired=true remove todos os habitos expirados', () => {
    const habits = [
      { id: 1, name: 'A', is_expired: false },
      { id: 2, name: 'B', is_expired: true },
      { id: 3, name: 'C', is_expired: false },
    ];
    const res = filterHabits(habits, true);
    expect(res).toHaveLength(2);
    expect(res.map(h => h.id)).toEqual([1,3]);
  });

  test('Tratamento sem is_expired (trata como se n estivesse expirado)', () => {
    const habits = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B', is_expired: true },
    ];
    const res = filterHabits(habits, true);
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe(1);
  });

  test('Lista vazia', () => {
    const res = filterHabits([], true);
    expect(res).toHaveLength(0);
  });
});
