import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';

// JWT payload에 들어오는 최소 데이터 형태
// login 시 jwt.sign({ sub: user.id }) 했던 그 값
type JwtPayload = { sub: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        // JWT payload의 userId(sub)로 실제 유저를 조회하기 위한 서비스
        private readonly usersService: UsersService,
        // 환경변수(JWT_SECRET) 접근용
        configService: ConfigService,
    ) {
        super({
            // Authorization: Bearer <token> 헤더에서 JWT 추출
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

            // 토큰 서명 검증에 사용할 시크릿 키
            // ConfigModule.forRoot({ isGlobal: true })가 AppModule에 있어야 동작
            secretOrKey: configService.get<string>('JWT_SECRET')!,

            // 만료된 토큰은 통과시키지 않음
            ignoreExpiration: false,
        });
    }

    // 토큰 검증이 끝난 뒤 호출됨
    // 여기서 반환한 값이 req.user로 주입된다
    async validate(payload: JwtPayload) {
        // payload.sub = user.id
        const user = await this.usersService.findById(payload.sub);

        // 토큰은 유효하지만, 유저가 삭제된 경우 등
        if (!user) {
            throw new UnauthorizedException();
        }

        // 이후 컨트롤러에서 req.user로 접근 가능
        return user;
    }
}
