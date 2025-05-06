import { Prisma } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { randomInt } from 'crypto'

export const isUniqueConstraintPrismaError = (error: any): error is PrismaClientKnownRequestError => {
	return error instanceof PrismaClientKnownRequestError && error.code === 'P2002'
}

export const isNotFoundPrismaError = (error: any): error is PrismaClientKnownRequestError => {
	return error instanceof PrismaClientKnownRequestError && error.code === 'P2025'
}

export const generateOTP = (): string => {
	return String(randomInt(0, 100000)).padStart(6, '0')
}
export function isForeignKeyConstraintPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
	return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003'
}
