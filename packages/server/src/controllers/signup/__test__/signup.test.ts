import { HttpRequest, HttpResponse } from './../../../protocols/http.protocol';
import SignUpController from '../signup.controller'

describe('SignUpController', () => {
     const signUpController = new SignUpController()
    test('should return error case username is not provided', () => {
        
        const httpRequest: HttpRequest = {
            body: {
              username: ''
            }
        }
        const httpResponse: HttpResponse = signUpController.handle(httpRequest)
        
        expect(httpResponse.statusCode).toBe(400) 
    });
});

// username
// email
// password
// confirmPassowrd
