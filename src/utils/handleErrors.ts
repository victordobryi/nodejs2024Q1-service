import { InternalServerErrorException } from '@nestjs/common';

export const handleErrors = async <T>(promise: Promise<T>): Promise<T> => {
  try {
    return promise;
  } catch (error) {
    throw new InternalServerErrorException(error);
  }
};
