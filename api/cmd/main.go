package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/iemran93/devMatch/api/route"
	"github.com/iemran93/devMatch/bootstrap"
	"github.com/iemran93/devMatch/utils"

	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
)

func main() {
	app := bootstrap.App()
	env := app.Env
	db := app.MySql
	defer app.CloseDBConnection()

	utils.MigrateDB(db, env)

	timeout := time.Duration(env.ContextTimeout) * time.Second

	r := mux.NewRouter()

	route.Setup(env, timeout, db, r)

	// Create CORS handler
	corsHandler := bootstrap.NewCorsHandler()

	srv := &http.Server{
		Addr:         env.ServerAddress,
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
		Handler:      corsHandler.Handler(r),
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil {
			log.Error(err)
		}
	}()

	log.Info("server started")

	// Graceful Shutdown
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	// Block until we receive our signal.
	<-c

	// Create a deadline to wait for.
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()
	srv.Shutdown(ctx)
	log.Info("shutting down")
	os.Exit(0)
}
