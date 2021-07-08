import { TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { SortEnum } from './enums/sort.enum';
import { INestState } from './interfaces/nest-state.interface';
import { NgQubeeService } from './ng-qubee.service';
import { queryBuilderReducer } from './reducers/query-builder.reducer';

describe('NgQubeeService', () => {
  let service: NgQubeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({nest: queryBuilderReducer})
      ],
      providers: [{
        deps: [Store],
        provide: NgQubeeService,
        useFactory: (store: Store<INestState>) =>
          new NgQubeeService(store)
      }]
    });
    service = TestBed.inject(NgQubeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a URI', (done: DoneFn) => {
    service.setModel('users');

    service.generateUri().subscribe(uri => {
      expect(uri).toContain('/users');
      done();
    });
  });

  it('should generate a URI with a custom limit', (done: DoneFn) => {
    service.setModel('users');
    service.setLimit(25);

    service.generateUri().subscribe(uri => {
      expect(uri).toContain('limit=25');
      done();
    });
  });

  it('should generate a URI with a default limit', (done: DoneFn) => {
    service.setModel('users');

    service.generateUri().subscribe(uri => {
      expect(uri).toContain('limit=15');
      done();
    });
  });

  it('should generate a URI with a custom page', (done: DoneFn) => {
    service.setModel('users');
    service.setPage(5);

    service.generateUri().subscribe(uri => {
      expect(uri).toContain('page=5');
      done();
    });
  });

  it('should generate a URI with a default page', (done: DoneFn) => {
    service.setModel('users');

    service.generateUri().subscribe(uri => {
      expect(uri).toContain('page=1');
      done();
    });
  });

  it('should generate a URI with fields (single model)', (done: DoneFn) => {
    service.addFields('users', ['email', 'name']);
    service.setModel('users');

    service.generateUri().subscribe(uri => {
      expect(uri).toContain('fields[users]=email,name');
      done();
    });
  });

  it('should generate a URI with included models', (done: DoneFn) => {
    service.addIncludes('model1', 'model2');
    service.setModel('users');

    service.generateUri().subscribe(uri => {
      expect(uri).toContain('include=model1,model2');
      done();
    });
  });

  it('should generate a URI with fields (multiple models)', (done: DoneFn) => {
    service.addFields('users', ['email', 'name']);
    service.addFields('settings', ['field1', 'field2']);
    service.addIncludes('settings');
    service.setModel('users');

    service.generateUri().subscribe(uri => {
      expect(uri).toContain('fields[users]=email,name');
      expect(uri).toContain('fields[users]=email,name');
      done();
    });
  });

  it('should generate a URI with sorted field ASC', (done: DoneFn) => {
    service.addSort('f', SortEnum.ASC);
    service.setModel('users');

    service.generateUri().subscribe(uri => {
      expect(uri).toContain('sort=f');
      done();
    });
  });

  it('should generate a URI with sorted fields mixed ASC and DESC', (done: DoneFn) => {
    service.addSort('f1', SortEnum.DESC);
    service.addSort('f2', SortEnum.ASC);
    service.setModel('users');

    service.generateUri().subscribe(uri => {
      expect(uri).toContain('sort=-f1,f2');
      done();
    });
  });

  it('should generate a URI with sorted field DESC', (done: DoneFn) => {
    service.addSort('f', SortEnum.DESC);
    service.setModel('users');

    service.generateUri().subscribe(uri => {
      expect(uri).toContain('sort=-f');
      done();
    });
  });

  // it('should generate a URL if a base url is given', (done: DoneFn) => {
  //   service.setModel('users');
  //   service.setBaseUrl('https://domain.com');

  //   service.generateUri().subscribe(uri => {
  //     expect(uri).toContain('https://domain.com/users');
  //     done();
  //   });
  // });

  // it('should throw an error if the model requested as field is not the model property / included in the includes object', () => {
  //   service.fields = {users: ['email', 'name'], settings: ['field1', 'field2']};

  //   try {
  //     service.generateUri('users');
  //   } catch (err) {
  //     expect(err.message).toEqual(new UnselectableModelError('settings').message);
  //   }
  // });
});