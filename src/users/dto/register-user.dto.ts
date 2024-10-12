import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { UniqueUserEmail } from '../validators/unique-user-email.validator';

export class RegisterUserDto {
  @UniqueUserEmail()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsStrongPassword()
  password: string;

  displayName: string;
}
