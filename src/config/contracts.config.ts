import { registerAs } from '@nestjs/config';

export default registerAs('contracts', () => ({
  pt: {
    address:
      process.env.PT_ADDRESS || '0x0000000000000000000000000000000000000000',
    deployedBlock: parseInt(process.env.PT_DEPLOYED_BLOCK || '0', 10),
  },
}));
