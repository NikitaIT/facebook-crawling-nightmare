import 'mocha';
import { expect,should,assert } from 'chai';
import Facebook from '../modules/Facebook/Facebook';
import { auth } from '../config/auth.config';
import { nightmare } from '../config/nightmaretest.config';

describe('Test function', () => {
    it('should return Test works', () => {
      expect('Test works').to.equal('Test works');
    });
});