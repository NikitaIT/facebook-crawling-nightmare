import 'mocha';
import { expect,should,assert } from 'chai';
import { nightmare } from '../../config/nightmaretest.config';
import { auth } from '../../config/auth.config';
import Facebook from './Facebook';
import { testConfig } from '../../config/test.config';
import { PostsTestData } from '../../Area/Person/Posts/TestData';
import { Automapper } from '../../infrastructure/Automapper';
import { PhotosTestData, AlbumsTestData } from '../../Area/Person/Photos/TestData';


describe('Facebook', function() {
  this.timeout(135000);
  const facebook = new Facebook(nightmare, testConfig.shortName),
        app = facebook.authPage(nightmare, auth.email, auth.password);
        
  describe('getGroup function', function() {
    it('should return GSTResearchGroup', (done) => {
      app.then((e: any)=>{
        return facebook.getGroup(nightmare,"GSTResearchGroup");
      })
      .then(x=>{
          console.log(x);
            expect(x).be.equal(AlbumsTestData.map(Automapper.mapToAlbum.FromTAlbumPage));
            done();
          })
      .catch((error) => {
          done(error);
      });
    });
  });
  describe('getAlbum function', function() {
    it('should return AlbumsTestData', (done) => {
      app.then((e: any)=>{
        return facebook.getAlbum(nightmare);
      })
      .then(x=>{
          console.log(x);
            expect(x).be.equal(AlbumsTestData.map(Automapper.mapToAlbum.FromTAlbumPage));
            done();
          })
      .catch((error) => {
          done(error);
      });
    });
  });
  describe('getPost function', function() {
    it('should return PostsTestData', (done) => {
      app.then((e: any)=>{
        return facebook.getPost(nightmare);
      })
      .then(x=>{
            expect(x).be.equal(PostsTestData.map(Automapper.mapToPost.FromTPostPage));
            done();
          })
      .catch((error) => {
          done(error);
      });
    });
  });
  describe('getPhotos function', function() {
    it('should return PhotosTestData', (done) => {
      app.then((e: any)=>{
        return facebook.getPhoto(nightmare);
      })
      .then(x=>{
            expect(x).be.equal(PhotosTestData.map(Automapper.mapToPhoto.FromTPhotoPage));
            done();
          })
      .catch((error) => {
          done(error);
      });
    });
  });
  
});