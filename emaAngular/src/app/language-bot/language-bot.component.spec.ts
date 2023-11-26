import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageBotComponent } from './language-bot.component';

describe('LanguageBotComponent', () => {
  let component: LanguageBotComponent;
  let fixture: ComponentFixture<LanguageBotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LanguageBotComponent]
    });
    fixture = TestBed.createComponent(LanguageBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
