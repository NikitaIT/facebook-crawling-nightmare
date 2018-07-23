import 'mocha';
import { expect,should,assert } from 'chai';
import Facebook from '../../../modules/Facebook/Facebook';
import { nightmare } from '../../../config/nightmaretest.config';
import { testConfig } from '../../../config/test.config';
import { auth } from '../../../config/auth.config';
import { PostsTestData } from './TestData';
import { Automapper } from '../../../infrastructure/Automapper';