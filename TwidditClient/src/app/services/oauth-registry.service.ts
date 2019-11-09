import { Injectable } from '@angular/core';
import jwt from 'jsonwebtoken';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OauthRegistryService {
  twitterApiPath = environment.apiUrl + '/auth/twitter-oauth';
  redditApiPath = environment.apiUrl + '/auth/reddit-oauth';

  postsInitialized = false;

  // tslint:disable-next-line: max-line-length
  dummyJwt = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjNkYjNlZDZiOTU3NGVlM2ZjZDlmMTQ5ZTU5ZmYwZWVmNGY5MzIxNTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzNDE0OTg1ODA4NzAtZmtqaW5ndmE1b2RoY2o4bGJnc3I5anI3ZWhqcGxhcjQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzNDE0OTg1ODA4NzAtZmtqaW5ndmE1b2RoY2o4bGJnc3I5anI3ZWhqcGxhcjQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTc0ODQ0NzAxNDQxODkzNDkzMjgiLCJlbWFpbCI6ImF0bGFudGtvZ21AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJGOEJHb3h2Mk9odFNIcWNiQ3hEd2FRIiwibm9uY2UiOiJ6Z0dUbXdqQm5wRE01MkVmVGR2MEZvLTJTbWFMNVd3TThPM1c1OVhic21UaWciLCJuYW1lIjoiTHVjYSBOaXhkb3JmIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BQXVFN21DaExJbnZ0YTF1RUJSOF9BSnVMdVUzNHZfNUJwanFoVFJfeVpyR0VnPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ikx1Y2EiLCJmYW1pbHlfbmFtZSI6Ik5peGRvcmYiLCJsb2NhbGUiOiJkZSIsImlhdCI6MTU3MTMzMDU4MSwiZXhwIjoxNTcxMzM0MTgxLCJqdGkiOiI5YjE3MzFhMzIzMWIwMDgxM2RiZDQxOThiYzRlM2FmY2NlMjk0MWNiIn0.AsA8tQnJLuvL5-NHVOqRieyDVnQc_Fdntsoc32NXVNNSa8QG3oDWA8beVjuHiWxUB76pdIWKncNgS0kFgUBiA2FMfJmK74Doi8XFK5_YLiteTsn_SyOA-wB0lorrHjxEPEvvWaDEngXDe27b7T9zDahrgpoMmFNkz1e4ahGLcvUuA4-89Kxn5U1BlTbVszXQA5g6v2Vxyeudti-JbwzeBAfTTeBKd5QKcPPo5t-gKobYkQ99GbgdoFGdwmUoqSMmhHhHC45C-lfr7cf-xrKgd5SE38nOR5hCesIfsjW_f0BjdRb6zZobiX5h-glVXk8QSlnO41HKvhEu0MLG95kgVg';

  defaultHeader: HttpHeaders;

  constructor(private httpClient: HttpClient) {
    this.defaultHeader = new HttpHeaders();
    this.defaultHeader = this.defaultHeader.set('Content-Type', 'application/json');
    if (!environment.production) {
      this.defaultHeader = this.defaultHeader.set('Authorization', 'Bearer ' + this.dummyJwt);
    }
  }

  public isOauthExpired(oauth: string): boolean {
    try {
      jwt.verify(oauth, 'wrong-secret');
      return true;
    } catch (err) {
      return false;
    }
  }

  public async getTwitterOauth(): Promise<string> {
    const response = await this.httpClient.get<string>(
      this.twitterApiPath,
      { headers: this.defaultHeader, observe: 'response' }
    ).toPromise();

    if (200 <= response.status && response.status < 300) {
      return response.body;
    } else {
      return undefined;
    }
  }

  public async getRedditOauth(): Promise<string> {
    const response = await this.httpClient.get<string>(
      this.redditApiPath,
      { headers: this.defaultHeader, observe: 'response' }
    ).toPromise();

    if (200 <= response.status && response.status < 300) {
      return response.body;
    } else {
      return undefined;
    }
  }
}
