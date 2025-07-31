package domain

import "errors"

type ErrorResponse struct {
	Message string `json:"message"`
}

// Error List:
var (
	ErrUserAlreadyExists          = errors.New("user already exists")
	ErrUserNotAllowed             = errors.New("user not allowed")
	ErrUserNotFound               = errors.New("user not found")
	ErrUnauthorized               = errors.New("unauthorized")
	ErrInvalidPassword            = errors.New("invalid password")
	ErrUserShouldLoginWithGoogle  = errors.New("user should login with Google")
	ErrCodeExchangeWrong          = errors.New("code exchange wrong")
	ErrFailedGetGoogleUser        = errors.New("failed to get google user")
	ErrFailedToReadResponse       = errors.New("failed to read response")
	ErrUnexpectedSigningMethod    = errors.New("unexpected signing method")
	ErrInvalidToken               = errors.New("invalid token")
	ErrIncorrectRequestBody       = errors.New("incorrect request body")
	ErrProjectNotFound            = errors.New("project not found")
	ErrRequestAlreadyExists       = errors.New("request already exists")
	ErrRequestNotFound            = errors.New("request not found")
	ErrFaildToChangeRequestStatus = errors.New("failed to change request status")
	ErrRequestNorAllowed          = errors.New("Request not allowed")
)
