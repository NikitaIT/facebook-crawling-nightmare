import 'mocha';
import { expect,should,assert } from 'chai';
import { nightmare } from '../config/nightmaretest.config';
import { auth } from '../config/auth.config';
import { goToPage, getUserIdByPage } from './Facebook';
import { testConfig } from '../config/test.config';


describe('Fasebook utils', function() {
  this.timeout(35000);

  describe('goToPage function', function() {
    const test = (done,id:string|number,urlEnd:string) =>{
      const app = goToPage(nightmare, id);
      app.url().then(x=>{
            expect(x).be.equal(`https://www.facebook.com/${urlEnd}`);
            done();
          }).catch((error) => {
            done(error);
          });
    }
    it('should redirect to Person page if send short name', (done) => {
      test(done, testConfig.shortName,testConfig.shortName)
    });
    it('should redirect to Person page if send UserId and short name exists', (done) => {
      test(done, testConfig.id,testConfig.shortName)
    });
  });

  describe('getUserIdByPage function', function() {
    const test = (done,returnId:number|string) =>{
      getUserIdByPage(goToPage(nightmare, testConfig.shortName))
        .then(x=>{
            expect(x).be.equal(returnId);
            done();
          }).catch((error) => {
            done(error);
          });
    }
    it('should return id', (done) => {
      test(done,testConfig.id)
    });
  });
});