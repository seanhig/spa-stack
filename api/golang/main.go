package main

import (
	"fmt"
	"idstudios/gin-web-service/services"
	"log/slog"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/lmittmann/tint"
	"github.com/mattn/go-isatty"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
		return
	}

	router := gin.Default()

	apiRouter := router.Group("/api")
	apiRouter.Group("/about").GET("", services.AboutHandler)

	apiRouter.Group("/identity").GET("/current-user", services.IdentityCurrentUserHandler)
	apiRouter.Group("/identity").POST("/external-login", services.IdentityExternalLoginHandler)
	apiRouter.Group("/identity").POST("/external-logout", services.IdentityExternalLogoutHandler)

	apiRouter.Group("/product").GET("", services.ProductFetchHandler)
	apiRouter.Group("/order").GET("", services.OrderFetchHandler)
	apiRouter.Group("/shipment").GET("", services.ShipmentFetchHandler)

	apiRouter.Group("/weborder").POST("", services.WebOrderSubmitHandler)

	if strings.ToLower(os.Getenv("ENVIRONMENT")) == "production" {

		logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
		slog.SetDefault(logger)
		slog.Info("Use JSON logging in production")

		fs := http.FileServer(http.Dir("public/"))
		http.Handle("/", http.StripPrefix("/public/", fs))

		http.Handle("/site/home", http.StripPrefix("/public/", fs))
		http.Handle("/auth/signin", http.StripPrefix("/public/", fs))
		http.Handle("/user/my-orders", http.StripPrefix("/public/", fs))
		http.Handle("/admin/products", http.StripPrefix("/public/", fs))
		http.Handle("/admin/orders", http.StripPrefix("/public/", fs))
		http.Handle("/admin/shipments", http.StripPrefix("/public/", fs))

		slog.Info("Hosting SPA at public")
	} else {
		w := os.Stdout
		logger := slog.New(
			tint.NewHandler(w, &tint.Options{
				Level:   slog.LevelInfo,
				NoColor: !isatty.IsTerminal(w.Fd()),
			}),
		)
		slog.SetDefault(logger)
	}

	httpPort := fmt.Sprintf(":%s", os.Getenv("PORT"))
	slog.Info(fmt.Sprintf("Server is listening on %s", httpPort))
	http.ListenAndServe(httpPort, router)
}
