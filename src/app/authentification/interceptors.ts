import {  HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const token = localStorage.getItem('token');

    let requestToSend = req;

    if (token) {
        const headers = req.headers.set('Authorization', 'Token ' + token);
        requestToSend = req.clone({
            headers: headers
        })
    }

    return next(requestToSend);

};