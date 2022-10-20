import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
	@IsString()
	@MinLength(5)
	@MaxLength(20)
	@IsNotEmpty({ message: 'Id can not be empty' })
	id: string;

	@IsString({
		message: 'Password field is not string',
	})
	@MinLength(5)
	@MaxLength(20)
	@IsNotEmpty({ message: 'Password can not be empty' })
	password: string;
}

// export default new AuthRegisterDto()