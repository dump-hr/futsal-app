export type PlayerModalAdd = { type: 'add' };

export type PlayerModalEditByIndex = {
  type: 'edit';
  index: number;
};

export type PlayerModalEditById = {
  type: 'edit';
  playerId: number;
  firstName: string;
  lastName: string;
};
