package com.property.portal.exception;

import com.property.portal.service.MlClientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MlClientService.MlApiException.class)
    public ProblemDetail handleMlApiException(MlClientService.MlApiException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.valueOf(ex.getStatusCode()), ex.getMessage());
        problem.setType(URI.create("/errors/ml-api-error"));
        problem.setTitle("ML API Error");
        return problem;
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ProblemDetail handleIllegalArgument(IllegalArgumentException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, ex.getMessage());
        problem.setType(URI.create("/errors/invalid-argument"));
        problem.setTitle("Invalid Argument");
        return problem;
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericException(Exception ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
        problem.setType(URI.create("/errors/internal-error"));
        problem.setTitle("Internal Server Error");
        return problem;
    }
}
