import { InternalServerErrorException } from '@nestjs/common';

export const handleErrors = async <T>(promise: Promise<T>): Promise<T> => {
  try {
    return await promise;
  } catch (error) {
    throw new InternalServerErrorException(error);
  }
};
