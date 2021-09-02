import { Test, TestingModule } from '@nestjs/testing';
import { ColaboratorsController } from './colaborators.controller';

describe('ColaboratorsController', () => {
  let controller: ColaboratorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColaboratorsController],
    }).compile();

    controller = module.get<ColaboratorsController>(ColaboratorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
