import { getUsers, setUsers, setSession } from '@/lib/storage';

export function signup(email: string, password: string): void {
  const users = getUsers();

  if (users.some((u) => u.email === email)) {
    throw new Error('User already exists');
  }

  const user = {
    id: crypto.randomUUID(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  setUsers([...users, user]);
  setSession({ userId: user.id, email: user.email });
}

export function login(email: string, password: string): void {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  setSession({ userId: user.id, email: user.email });
}

export function logout(): void {
  setSession(null);
}
