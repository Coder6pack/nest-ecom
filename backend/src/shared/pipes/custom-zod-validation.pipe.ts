import { UnprocessableEntityException } from '@nestjs/common'
import { createZodValidationPipe } from 'nestjs-zod'
import { ZodError } from 'zod'

const CustomZodValidationPipe = createZodValidationPipe({
	createValidationException(errors: ZodError) {
		console.log(errors.errors)
		return new UnprocessableEntityException(
			errors.errors.map((error) => {
				return {
					...error,
					path: error.path.join('.'),
				}
			}),
		)
	},
})

export default CustomZodValidationPipe
