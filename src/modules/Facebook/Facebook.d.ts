
import Nightmare from '../../@types/nightmare';
declare class FacebookAuth {
    authPage(nightmare: Nightmare, email: string, password: string): Promise<{}>;
}
export default FacebookAuth;
