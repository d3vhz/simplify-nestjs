import { Injectable } from '@nestjs/common';

import { UsersRepository } from '../repository';
import { UpdateUser } from '../types';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  getUserById(id: string) {
    return this.repository.findById(id);
  }

  updateUser(id: string, updateUserDto: UpdateUser) {
    return this.repository.update(id, updateUserDto);
  }

  deleteUser(id: string) {
    return this.repository.delete(id);
  }
}
