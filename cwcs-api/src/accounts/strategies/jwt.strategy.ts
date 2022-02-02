import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Account } from '../interfaces/account.interface'
import { JwtPayload } from '../interfaces/jwt-payload.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel('Account') private readonly accountModel: Model<Account>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jWnZr4u7x!A%D*F-JaNdRgUkXp2s5v8y'
    })
  }

  async validate(payload: JwtPayload): Promise<Account> {
    const { id, role } = payload

    const account = await this.accountModel.findOne({ _id: id, role: role }).exec()

    if (account) return account
    
    throw new UnauthorizedException('Invalid credentials!')
  }
}