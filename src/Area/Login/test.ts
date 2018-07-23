import 'mocha';
import { expect,should,assert } from 'chai';
import { nightmare } from '../../config/nightmare.config';
import { auth } from '../../config/auth.config';
import { Login } from './Login';

describe('Login function', function() {
  this.timeout(35000);
  it('should redirect to profile and return cookie', (done) => {
    const app = Login(nightmare, auth.email, auth.password)();
    app.then(x => {
        expect(x).length.is.not.equal(0);
        nightmare.url().then(x=>{
          nightmare.end().then();
          expect(x).be.not.equal('https://www.facebook.com/login/');
          done();
        }).catch((error) => {
          nightmare.end().then();
          done(error);
        });
      }).catch((error) => {
        nightmare.end().then();
        done(error);
      });
  });
});