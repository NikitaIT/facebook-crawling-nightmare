import 'mocha';
import { expect,should,assert } from 'chai';
import { nightmare } from '../../config/nightmaretest.config';
import { auth } from '../../config/auth.config';
import { testConfig } from '../../config/test.config';
import { PostsTestData } from '../../Area/Person/Posts/TestData';
import { Automapper } from '../../infrastructure/Automapper';
import { PhotosTestData, AlbumsTestData } from '../../Area/Person/Photos/TestData';
import Facebook from '../../modules/Facebook/Facebook';
import { getGroupCommunity } from './Community';


describe('CommunityOrPublicFigure', function() {
  this.timeout(135000);
  const facebook = new Facebook(nightmare, testConfig.shortName),
        app = facebook.authPage(nightmare, auth.email, auth.password);
 
  describe('getCommunity function', function() {
    it('should return Community', (done) => {
      app.then((e: any)=>{
        return facebook.getCommunityOrPublicFigure(nightmare, "asdpecs");
      })
      .then(x=>{
          console.log(x);
            expect(x).be.equal([].map(Automapper.mapToPerson.FromTFriend));
            done();
          })
      .catch((error) => {
          done(error);
      });
    });
  });
});