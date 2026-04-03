import toast from 'react-hot-toast';

type PlayerLike = {
  firstName: string;
  lastName: string;
};

export const validatePlayers = (players: PlayerLike[]): boolean => {
  for (let i = 0; i < players.length; i++) {
    const fn = players[i].firstName.trim();
    const ln = players[i].lastName.trim();
    if (fn.length < 2 || fn.length > 20) {
      toast.error(`Igrač #${i + 1}: ime mora imati između 2 i 20 znakova`);
      return false;
    }
    if (ln.length < 2 || ln.length > 20) {
      toast.error(
        `Igrač #${i + 1}: prezime mora imati između 2 i 20 znakova`,
      );
      return false;
    }
  }
  return true;
};
