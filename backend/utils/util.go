package utils

import (
	"crypto/rand"
	"encoding/json"
	"errors"
	"math/big"
	"net/http"

	"github.com/iemran93/devMatch/bootstrap"
	"github.com/jmoiron/sqlx"

	_ "github.com/go-sql-driver/mysql"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"

	log "github.com/sirupsen/logrus"
)

func JSON(w http.ResponseWriter, code int, obj interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	enc := json.NewEncoder(w)
	enc.Encode(obj)
}

func MigrateDB(db *sqlx.DB, env *bootstrap.Env) {
	m, err := migrate.New(
		"file://"+env.MigrationPath, "mysql://"+env.DBUser+":"+env.DBPass+"@tcp("+env.DBHost+":"+env.DBPort+")/"+env.DBName)
	if err != nil {
		log.Error("error while creating migration instance: ", err)
		return
	}
	err = m.Up()
	if err != nil && err != migrate.ErrNoChange {
		log.Error("error while migrating database: ", err)
		return
	}
}

func SetCookie(w http.ResponseWriter, name string, value string) {
	// For development environment (http://localhost)
	// In production, you'd set Secure: true
	cookie := http.Cookie{
		Name:     name,
		Value:    value,
		Path:     "/",
		HttpOnly: true,                 // Prevents JavaScript access
		SameSite: http.SameSiteLaxMode, // Allows the cookie to be sent in same-site requests and top-level navigations
		MaxAge:   86400 * 30,           // 30 days
	}

	http.SetCookie(w, &cookie)
}

func GetCookie(r *http.Request, name string) (string, error) {
	cookie, err := r.Cookie(name)
	if err != nil {
		switch {
		case errors.Is(err, http.ErrNoCookie):
			return "", errors.New("cookie not found")
		default:
			return "", errors.New("server error")
		}
	}
	return cookie.Value, nil
}

const charset = "abcdefghijklmnopqrstuvwxyz0123456789"

func GenerateID(length int) (string, error) {
	result := make([]byte, length)
	for i := range result {
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if err != nil {
			return "", err
		}
		result[i] = charset[num.Int64()]
	}
	return string(result), nil
}
