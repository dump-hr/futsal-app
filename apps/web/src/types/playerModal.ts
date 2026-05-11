export type PlayerModalAdd = { type: 'add' };

export type PlayerModalEditById = {
  type: 'edit';
  playerId: number;
  firstName: string;
  lastName: string;
};
