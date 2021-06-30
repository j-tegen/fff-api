import { Test, TestingModule } from '@nestjs/testing';
import { ArrowResolver } from './arrow.resolver';

describe('ArrowResolver', () => {
  let resolver: ArrowResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArrowResolver],
    }).compile();

    resolver = module.get<ArrowResolver>(ArrowResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
