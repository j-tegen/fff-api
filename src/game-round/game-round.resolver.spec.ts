import { Test, TestingModule } from '@nestjs/testing';
import { GameRoundResolver } from './game-round.resolver';

describe('GameRoundResolver', () => {
  let resolver: GameRoundResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameRoundResolver],
    }).compile();

    resolver = module.get<GameRoundResolver>(GameRoundResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
