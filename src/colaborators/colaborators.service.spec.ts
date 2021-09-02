import { Test, TestingModule } from '@nestjs/testing';
import { ColaboratorsService } from './colaborators.service';

describe('ColaboratorsService', () => {
  let service: ColaboratorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColaboratorsService],
    }).compile();

    service = module.get<ColaboratorsService>(ColaboratorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
