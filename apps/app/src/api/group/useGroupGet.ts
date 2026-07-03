import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { GroupDto } from '@futsal-app/types';

const groupGet = (id: number) => {
  return api.get<never, GroupDto>(`/group/${id}`);
};

export const useGroupGet = (id: number) => {
  return useQuery({
    queryFn: () => groupGet(id),
    queryKey: ['group', id],
    enabled: !!id,
  });
};
