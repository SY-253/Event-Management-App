import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechBotComponent } from './speech-bot.component';

describe('SpeechBotComponent', () => {
  let component: SpeechBotComponent;
  let fixture: ComponentFixture<SpeechBotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpeechBotComponent]
    });
    fixture = TestBed.createComponent(SpeechBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
