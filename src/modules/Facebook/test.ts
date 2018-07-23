import 'mocha';
import { expect,should,assert } from 'chai';
import { nightmare } from '../../config/nightmaretest.config';
import { auth } from '../../config/auth.config';
import Facebook from './Facebook';
import { testConfig } from '../../config/test.config';
import { PostsTestData } from '../../Area/Person/Posts/TestData';
import { Automapper } from '../../infrastructure/Automapper';
import { PhotosTestData } from '../../Area/Person/Photos/TestData';


describe('Fasebook', function() {
  this.timeout(135000);
  const facebook = new Facebook(nightmare, testConfig.shortName),
        app = facebook.authPage(nightmare, auth.email, auth.password);
  
  describe('getPost function', function() {
    it('should redirect to Person page if send short name', (done) => {
      app.then((e: any)=>{
        return facebook.getPost(nightmare);
      })
      .then(x=>{
            expect(x).be.equal(PostsTestData.map(Automapper.mapPostPageToPosts));
            done();
          })
      .catch((error) => {
          done(error);
      });
    });
  });
  describe('getPhotos function', function() {
    it('should redirect to Person page if send short name', (done) => {
      app.then((e: any)=>{
        return facebook.getPhoto(nightmare);
      })
      .then(x=>{
            expect(x).be.equal(PhotosTestData.map(Automapper.mapPhotoPageToPhotos));
            done();
          })
      .catch((error) => {
          done(error);
      });
    });
  });
});