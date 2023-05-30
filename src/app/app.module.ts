import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {SocialLoginModule, SocialAuthServiceConfig, GoogleSigninButtonModule} from '@abacritt/angularx-social-login';
import {GoogleLoginProvider} from '@abacritt/angularx-social-login';

import {AppComponent} from './app.component';
import {LoginComponent} from './Pages/login/login.component';
import {HomeComponent} from './Pages/home/home.component';
import {DashboardComponent} from './Pages/dashboard/dashboard.component';
import {HeaderComponent} from './Components/header/header.component';
import {CreateQuestionComponent} from './Pages/create-question/create-question.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    HeaderComponent,
    CreateQuestionComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, SocialLoginModule, GoogleSigninButtonModule],
  providers: [{
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            '814334065115-sk0m67fdt5jq2shd3jv6qgb5ed88k469.apps.googleusercontent.com'
          )
        }
      ],
      onError: (err) => {
        console.error(err);
      }
    } as SocialAuthServiceConfig,
  }],
  bootstrap: [AppComponent],
})
export class AppModule {
}
