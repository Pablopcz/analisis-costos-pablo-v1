import { TestBed } from '@angular/core/testing';

import { ProyectosAnalisisCostosMockService } from './proyectos-analisis-costos-mock.service';

describe('ProyectosAnalisisCostosMockService', () => {
  let service: ProyectosAnalisisCostosMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProyectosAnalisisCostosMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
