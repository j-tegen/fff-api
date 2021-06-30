import { Test, TestingModule } from '@nestjs/testing';
import { ObjectTileResolver } from './object-tile.resolver';

describe('ObjectTileResolver', () => {
  let resolver: ObjectTileResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ObjectTileResolver],
    }).compile();

    resolver = module.get<ObjectTileResolver>(ObjectTileResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
