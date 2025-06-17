import { Test, TestingModule } from '@nestjs/testing';
import { DifyChatController } from './dify-chat.controller';
import { DifyChatService } from './dify-chat.service';

describe('DifyChatController', () => {
  let controller: DifyChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DifyChatController],
      providers: [DifyChatService],
    }).compile();

    controller = module.get<DifyChatController>(DifyChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
