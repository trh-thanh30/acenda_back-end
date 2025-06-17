import { Test, TestingModule } from '@nestjs/testing';
import { DifyChatService } from './dify-chat.service';

describe('DifyChatService', () => {
  let service: DifyChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DifyChatService],
    }).compile();

    service = module.get<DifyChatService>(DifyChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
