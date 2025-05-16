package bootstrap

import (
	"github.com/jmoiron/sqlx"
	"github.com/rs/cors"
)

type Application struct {
	Env   *Env
	MySql *sqlx.DB
	Cors  *cors.Cors
}

func App() Application {
	app := &Application{}
	app.Env = NewEnv()
	app.MySql = NewMySQLDatabase(app.Env)
	app.Cors = NewCorsHandler()
	return *app
}

func (app *Application) CloseDBConnection() {
	CloseMySqlConnection(app.MySql)
}
