import type { User } from '@/types/models';

export async function getUsers(): Promise<User[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');

  if (!res.ok) {
    throw new Error('Error fetching users');
  }

  return res.json();
}