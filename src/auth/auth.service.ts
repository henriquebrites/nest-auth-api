import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { type SignInDTO, type SignUpDTO } from './dtos/auth';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService, 
    private jwtService: JwtService
  ) {}


  async signup(data: SignUpDTO) {
    const userAlreadyExists =  await this.prismaService.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (userAlreadyExists) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prismaService.user.create({ 
      data: { 
        ...data, 
        password: hashedPassword 
      }, 
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
  }
  
  async signin(data: SignInDTO) {
    const user =  await this.prismaService.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordsMatch = await bcrypt.compare(data.password, user.password);

    if (!passwordsMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = await this.jwtService.signAsync({ 
      id: user.id, 
      name: user.name,
      email: user.email
    });

    return {
      accessToken
    };
  }
}
