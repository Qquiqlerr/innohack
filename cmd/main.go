package main

import "contest/internal/db"

func main() {
	_, err := db.Connect()
	if err != nil {
		panic("Can't connect to database")
	}
	println("Connected")
}
