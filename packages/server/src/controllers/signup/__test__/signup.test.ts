import { HttpRequest, HttpResponse } from './../../../protocols/http.protocol';
import SignUpController from '../signup.controller'

describe('SignUpController', () => {
     const signUpController = new SignUpController()
    test('should return error case username is not provided', () => {
        
        const httpRequest: HttpRequest = {
            body: {
              username: '',
              email: 'valid_email@email.com',
              password: 'valid_password',
              passwordConfirmation: 'valid_password',
            }
        }
        const httpResponse: HttpResponse = signUpController.handle(httpRequest)
        
        expect(httpResponse.statusCode).toBe(400) 
    });

    
    test('should return error case email is not provided', () => {
        const httpRequest: HttpRequest = {
            body: {
              username: 'valid_username',
              email: '',
              password: 'valid_password',
              passwordConfirmation: 'valid_password',
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
