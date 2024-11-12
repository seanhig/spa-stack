package main

import (
	"encoding/gob"
	"fmt"
	"idstudios/gin-web-service/auth"
	"idstudios/gin-web-service/datasource/erpdb"
	"idstudios/gin-web-service/datasource/shipdb"
	"idstudios/gin-web-service/datasource/userdb"
	"idstudios/gin-web-service/services"
	"log/slog"
	"net/http"
	"os"
	"strings"

	"github.com/bradfitz/gomemcache/memcache"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-contrib/sessions/memcached"
	"github.com/gin-contrib/sessions/redis"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/lmittmann/tint"
	"github.com/markbates/goth/gothic"
	"github.com/mattn/go-isatty"
	sloggin "github.com/samber/slog-gin"
)

func main() {

	router := loadConfiguredRouter()

	gob.Register(&userdb.User{})

	if os.Getenv("REDIS_SERVER") != "" {
		slog.Info("Using REDIS for session storage")
		redisStore, _ := redis.NewStore(10, "tcp", os.Getenv("REDIS_SERVER"), os.Getenv("REDIS_PASSWORD"), []byte(os.Getenv("REDIS_SECRET")))
		router.Use(sessions.Sessions("spastack", redisStore))
		gothic.Store = redisStore
	} else if os.Getenv("MEMCACHED_SERVER") != "" {
		slog.Info("Using MEMCACHED for session storage")
		memstore := memcached.NewStore(memcache.New(os.Getenv("MEMCACHED_SERVER")), "", []byte(os.Getenv("MEMCACHED_SECRET")))
		router.Use(sessions.Sessions("spastack", memstore))
		gothic.Store = memstore
	} else {
		// preference would be for the cookie store, no shared state
		slog.Info("Using Cookies for session storage")
		cookieStore := cookie.NewStore([]byte("secret"))
		router.Use(sessions.Sessions("spastack", cookieStore))
		gothic.Store = cookieStore
	}

	apiRouter := router.Group("/api")

	apiRouter.Group("/about").GET("", services.AboutHandler)

	apiRouter.Group("/identity").GET("/current-user", services.IdentityCurrentUserHandler)
	apiRouter.Group("/identity").POST("/external-login", services.IdentityExternalLoginHandler)
	apiRouter.Group("/identity").POST("/external-logout", services.IdentityExternalLogoutHandler)

	apiRouter.Group("/product").GET("", services.ProductFetchHandler)
	apiRouter.Group("/order").GET("", services.OrderFetchHandler)
	apiRouter.Group("/shipment").GET("", services.ShipmentFetchHandler)

	apiRouter.Group("/weborders").POST("", services.WebOrderSubmitHandler)

	if strings.ToLower(os.Getenv("ENVIRONMENT")) == "production" {
		router.NoRoute(func(c *gin.Context) {
			c.Redirect(http.StatusTemporaryRedirect, "/")
		})
	}

	auth.ConfigureOIDC(apiRouter)

	_, erpdberr := erpdb.Connect()
	if erpdberr != nil {
		return
	}

	_, shipdberr := shipdb.Connect()
	if shipdberr != nil {
		return
	}

	_, userdberr := userdb.Connect()
	if userdberr != nil {
		return
	}

	httpPort := fmt.Sprintf(":%s", os.Getenv("PORT"))
	slog.Info(fmt.Sprintf("Server is listening on %s", httpPort))
	router.Run(httpPort)
}

func loadConfiguredRouter() *gin.Engine {
	var router *gin.Engine

	godotenv.Load()

	if strings.ToLower(os.Getenv("ENVIRONMENT")) == "production" {
		gin.SetMode(gin.ReleaseMode)

		if strings.ToLower(os.Getenv("LOG_TYPE")) != "text" {
			router = routerWithJSONLogging()
			slog.Info("Use JSON logging in production")
		} else {
			router = routerWithDefaultLogging()
			slog.Info("Use Default logging in production")
		}
		router.Use(static.Serve("/", static.LocalFile("./public", true)))
		slog.Info("Hosting SPA at public")
	} else {
		router = routerWithDefaultLogging()
	}
	return router
}

func routerWithDefaultLogging() *gin.Engine {
	router := gin.Default()
	w := os.Stdout
	logger := slog.New(
		tint.NewHandler(w, &tint.Options{
			Level:   slog.LevelInfo,
			NoColor: !isatty.IsTerminal(w.Fd()),
		}),
	)
	slog.SetDefault(logger)
	return router
}

func routerWithJSONLogging() *gin.Engine {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	router := gin.New()
	router.Use(sloggin.New(logger))
	router.Use(gin.Recovery())
	return router
}
