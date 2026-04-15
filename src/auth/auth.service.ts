
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth, UserRole } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // @InjectRepository(Auth)
  // private authRepository: Repository<Auth>;
  constructor(@InjectRepository(Auth)
  private authRepository: Repository<Auth>, private jwtService: JwtService) { }

  async onModuleInit() {
    await this.seedUser();
  }

  async seedUser() {
    const adminEmail = 'demo@example.com';
    
    const userExists = await this.authRepository.findOne({ where: { email: adminEmail } });

    if (!userExists) {
      console.log('Seeding default admin user...');
      
      const hashedPassword = await bcrypt.hash('demo123', 10);
      
      const newUser = this.authRepository.create({
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN
      });

      await this.authRepository.save(newUser);
      console.log('Default user created: demo@example.com / demo123');
    } else {
      console.log('Default user already exists in DB.');
    }
  }

  async login(userDto: any) {
    const user = await this.authRepository.findOne({ where: { email: userDto.email } });

    if (user && await bcrypt.compare(userDto.password, user.password)) {
      const payload = { email: user.email, sub: user.id, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
        user: { email: user.email, role: user.role , id: user.id }
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  };

  async register(registerDto: any) {
    const existingUser = await this.authRepository.findOne({ where: { email: registerDto.email } });  
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    } else {  
      console.log('1. Raw data from Frontend:', registerDto);
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const newUser = this.authRepository.create({
        email: registerDto.email,
        password: hashedPassword,
        role: registerDto.role
      });
      console.log('2. New user entity before saving:', newUser);
      await this.authRepository.save(newUser);
      console.log('3. New user saved to DB:', newUser);
      return { message: 'User registered successfully',
        user: { email: newUser.email, role: newUser.role, id: newUser.id }
       };
    }
  }
}

