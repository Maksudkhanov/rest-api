import { validate, isEmail, isMobilePhone } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { AuthDto } from '../dto/auth.dto';
export async function validateSignUpDto(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const dto = new AuthDto();
	dto.id = req.body.id;
	dto.password = req.body.password;
	const errors = await validate(dto);

	if (!isEmail(dto.id) && !isMobilePhone(dto.id)) {
		return res.status(400).json({error: 'Invalid value of id'})
	}

	if (errors.length > 1) {
		return res.status(400).json({ errors: errors[0].constraints });
	}
	
	next();
}
