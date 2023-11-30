import * as bcrypt from 'bcrypt';

export const hashUtils = {
  hashData: async <T>(data: T) => {
    return await bcrypt.hash(data, 7);
  },
  compareHashData: async (data: string, hash: string) => {
    return await bcrypt.compare(data, hash);
  },
};
