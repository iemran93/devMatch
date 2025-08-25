package route

import (
	"github.com/iemran93/devMatch/repository"
	"github.com/jmoiron/sqlx"
)

func NewUserSkillRoute(db *sqlx.DB) {
	usr := repository.NewUserSkillRepository(db)
}
