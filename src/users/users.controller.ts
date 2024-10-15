import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard } from '@nestjs/passport';
import type { Model } from 'mongoose';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { User, type UserDocument } from '../schemas/user.schema';
import { Request } from 'express';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Post()
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    const { email, password, displayName } = registerUserDto;

    const user = new this.userModel({
      email,
      password,
      displayName,
      role: 'user',
    });

    user.generateToken();

    return await user.save();
  }

  @Post('sessions')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(TokenAuthGuard)
  @Get('secret')
  async secret(@Req() req: Request) {
    const user = req.user as UserDocument;
    return { message: 'This is a secret message', email: user.email };
  }
}
