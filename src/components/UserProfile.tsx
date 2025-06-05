import React from 'react';
import { useUser } from '../hooks/useApi';

interface UserProfileProps {
  userId: number;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const { data: user, isLoading, error } = useUser(userId);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка загрузки данных</div>;
  }

  return (
    <div>
      <h2>Профиль пользователя</h2>
      <p>Имя: {user!.name}</p>
      <p>Email: {user!.email}</p>
    </div>
  );
}; 