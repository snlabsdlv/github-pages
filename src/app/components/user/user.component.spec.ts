import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GithubService } from 'src/app/services/github.service';

import { User } from 'src/app/interfaces/user.model';

import { UserComponent } from './user.component';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { delay, of, Subscription } from 'rxjs';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  //  let githubService: GithubService;
  let user: User[] = [];
  let githubServiceSpy: jasmine.SpyObj<GithubService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('GithubService', ['getAllUsers']);
    await TestBed.configureTestingModule({
      declarations: [UserComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatListModule,
        MatGridListModule,
        MatButtonModule,
      ],
      providers: [{ provide: GithubService, useValue: spy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
   
    githubServiceSpy = TestBed.inject(
      GithubService
    ) as jasmine.SpyObj<GithubService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should have button toggleDidStart === true ', () => {
    const didStart = component.toggleDidStart;
    expect(didStart).toEqual(true);
  });

  it('ngOnit should be loaded', fakeAsync(() => {
    githubServiceSpy.getAllUsers.and.returnValue(of(user).pipe(delay(1)));
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.toggleDidStart).toBeTruthy();
      expect(component.userData).toBeUndefined();
      expect(githubServiceSpy.getAllUsers).toHaveBeenCalledWith();
    });

    tick(1);
    expect(component.timerRunning).toBeFalsy();
    expect(component.userData).toEqual(user);
  }));

  it('expect data to have a length of 10 elements', fakeAsync(() => {
    component.getUserData();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.userData.length).toEqual(10);
    });
  }));

  it('it should have maxUserId a value', () => {
    const userId = component.maxUserId;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(userId).not.toBeNull();
    });
  });
  // it('it should have timer running', async () => {
  //   const subscription = component.timerSubscription;
  //   await fixture.whenStable().then(() => {
  //     fixture.detectChanges();
  //     expect(userId).toEqual(0);
  //   });
  // });

  // it('it should unsubscribe', async (done: DoneFn) => {
  //   const unsubcribe = spyOn(Subscription.prototype, 'unsubscribe');
  //   fixture.whenStable().then(() => {
  //     component.ngOnDestroy();
  //     expect(unsubcribe).toHaveBeenCalledTimes(1);
  //     done();
  //   });
  // });
});
