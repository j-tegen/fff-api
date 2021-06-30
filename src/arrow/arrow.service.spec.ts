import { Test, TestingModule } from '@nestjs/testing';
import { ArrowService } from './arrow.service';

describe('ArrowService', () => {
  let service: ArrowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArrowService],
    }).compile();

    service = module.get<ArrowService>(ArrowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
