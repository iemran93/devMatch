package route

import (
	"time"

	"github.com/gorilla/mux"
	"github.com/iemran93/devMatch/api/controller"
	"github.com/iemran93/devMatch/bootstrap"
	"github.com/jmoiron/sqlx"
)

func NewLogoutRouter(env *bootstrap.Env, timeout time.Duration, db *sqlx.DB, r *mux.Router) {
	lc := &controller.LogoutController{}
	r.HandleFunc("/logout", lc.Logout).Methods("POST")
}
