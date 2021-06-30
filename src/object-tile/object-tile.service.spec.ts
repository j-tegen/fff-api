import { Test, TestingModule } from '@nestjs/testing';
import { ObjectTileService } from './object-tile.service';

describe('ObjectTileService', () => {
  let service: ObjectTileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ObjectTileService],
    }).compile();

    service = module.get<ObjectTileService>(ObjectTileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
