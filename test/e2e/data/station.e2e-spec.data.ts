export const url = 'http://localhost:3001';
export const usersUrl = 'http://localhost:3000';

export const mongoUri = 'mongodb://localhost:27017/';

export const registerDto = {
  first_name: 'Adrián',
  last_name: 'Cardozo',
  email: 'adriancardozo@mail.com',
  password: 'Adriancardozo1234!',
};

export const user = {
  first_name: registerDto.first_name,
  last_name: registerDto.last_name,
  email: registerDto.email,
};

export const loginDto = { email: registerDto.email, password: registerDto.password };

export function createDto(owner_id: string) {
  return {
    name: 'Station-1',
    longitude: 0,
    latitude: 0,
    sensor_model: 'T-1000',
    owner_id,
  };
}

export function createUserDto() {
  return {
    first_name: 'Juan',
    last_name: 'Pérez',
    email: 'juanperez@mail.com',
    password: 'Juanperez1234!',
  };
}

export function headers(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

export const createdUser = {
  first_name: 'Juan',
  last_name: 'Pérez',
  email: 'juanperez@mail.com',
};
