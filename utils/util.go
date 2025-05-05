package utils

import (
	"encoding/json"
	"net/http"

	"github.com/jmoiron/sqlx"
	"github.com/oguzhantasimaz/Go-Clean-Architecture-Template/bootstrap"

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
	err = m.Steps(1)
	if err != nil || err != migrate.ErrNoChange {
		log.Error("error while migrating database: ", err)
		return
	}
}

func SetCookie(w http.ResponseWriter, name string, value string) {
	cookie := http.Cookie{
		Name:  name,
		Value: value,
		Path:  "/",
	}
	http.SetCookie(w, &cookie)
}
