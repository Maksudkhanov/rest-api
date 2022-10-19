import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { AuthRegisterDto } from '../dto/auth.register.dto';
export async function validateSignUpDto(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const dto = new AuthRegisterDto();
	dto.id = req.body.id;
	dto.password = req.body.password;
	const errors = await validate(dto);

	if (errors.length > 1) {
		return res.status(400).json({ errors: errors[0].constraints });
	}
	
	next();
}
