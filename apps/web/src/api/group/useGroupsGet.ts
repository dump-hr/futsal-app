import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { GroupDto } from '@futsal-app/types';

const groupsGet = () => {
  return api.get<never, GroupDto[]>('/group');
};

export const useGroupsGet = () => {
  return useQuery({
    queryFn: groupsGet,
    queryKey: ['groups'],
  });
};
