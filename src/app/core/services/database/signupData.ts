export const signupData = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    userName: 'johndoe',
    email: 'john.doe@example.com',
    password: 'password123',
    phone: '+1234567890',
    gender: 'male' as const,
    dob: '1990-01-15',
    role: 'user' as const,
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    userName: 'janesmith',
    email: 'jane.smith@example.com',
    password: 'password123',
    phone: '+1234567891',
    gender: 'female' as const,
    dob: '1992-05-20',
    role: 'admin' as const,
  },
] as const;

