import { NotFoundException } from '@nestjs/common'

export const NotFoundPermissionException = new NotFoundException('Not found permission is database')
