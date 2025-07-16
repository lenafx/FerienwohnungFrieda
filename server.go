package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	// Create a server with a timeout for graceful shutdown
	srv := &http.Server{
		Addr:    ":8000",
		Handler: http.FileServer(http.Dir(".")),
	}

	// Channel to listen for errors coming from the server
	serverErrors := make(chan error, 1)

	// Start the server
	go func() {
		fmt.Println("Starting server at http://localhost:8000")
		serverErrors <- srv.ListenAndServe()
	}()

	// Channel to listen for an interrupt or terminate signal from the OS
	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, os.Interrupt, syscall.SIGTERM)

	// Blocking select waiting for either a server error or a shutdown signal
	select {
	case err := <-serverErrors:
		log.Printf("Error starting server: %v", err)

	case sig := <-shutdown:
		log.Printf("Received signal %v, starting graceful shutdown...", sig)

		// Give outstanding requests a deadline for completion
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		// Attempt graceful shutdown
		if err := srv.Shutdown(ctx); err != nil {
			log.Printf("Could not stop server gracefully: %v", err)
			if err := srv.Close(); err != nil {
				log.Printf("Could not stop server: %v", err)
			}
		}
	}
}
