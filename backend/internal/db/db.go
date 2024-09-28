package db

import (
	"database/sql"
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"os"
	"time"
)

func waitForDB(dsn string) error {
	for i := 0; i < 30; i++ {
		db, err := sql.Open("pgx", dsn)
		if err == nil {
			defer db.Close()
			if err = db.Ping(); err == nil {
				return nil
			}
		}
		time.Sleep(time.Second)
	}
	return fmt.Errorf("could not connect to database")
}

func Connect() (*gorm.DB, error) {
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	DBAddress := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=disable",
		host, user, password, dbname)
	err := waitForDB(DBAddress)
	if err != nil {
		return nil, err
	}
	db, err := gorm.Open(postgres.Open(DBAddress), &gorm.Config{})
	return db, err
}
