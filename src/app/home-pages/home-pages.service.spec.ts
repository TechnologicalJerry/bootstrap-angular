import { TestBed } from '@angular/core/testing';

import { HomePagesService } from './home-pages.service';

describe('HomePagesService', () => {
  let service: HomePagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomePagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
