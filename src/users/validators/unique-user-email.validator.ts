import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  registerDecorator,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';
import type { Model } from 'mongoose';
import { User, type UserDocument } from '../../schemas/user.schema';

@ValidatorConstraint({ name: 'UniqueUserEmail', async: true })
@Injectable()
export class UniqueUserEmailConstraint implements ValidatorConstraintInterface {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async validate(email: string) {
    const user = await this.userModel.findOne({ email });
    return !user;
  }

  defaultMessage(): string {
    return 'Email already exists';
  }
}

export function UniqueUserEmail(validationOptions?: ValidationOptions) {
  return function (
    object: { constructor: CallableFunction },
    propertyName: string,
  ) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueUserEmailConstraint,
    });
  };
}
