package auth

import (
	"fmt"
	"idstudios/gin-web-service/datasource/userdb"
	"log/slog"
	"net/http"
	"os"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
	"github.com/markbates/goth/providers/microsoftonline"
)

func ConfigureOIDC(apiRouter *gin.RouterGroup) {

	goth.UseProviders(
		google.New(os.Getenv("GOOGLECLIENTID"), os.Getenv("GOOGLECLIENTSECRET"), os.Getenv("OIDC_CALLBACK_HOST")+"/api/oauth2/callback/google"),
		microsoftonline.New(os.Getenv("MICROSOFTCLIENTID"), os.Getenv("MICROSOFTCLIENTSECRET"), os.Getenv("OIDC_CALLBACK_HOST")+"/api/oauth2/callback/microsoft"),
	)

	slog.Info("Configured OIDC providers")

	apiRouter.Group("/oauth2/callback/:provider").GET("", func(c *gin.Context) {

		user, err := gothic.CompleteUserAuth(c.Writer, c.Request)
		if err != nil {
			c.AbortWithError(http.StatusInternalServerError, err)
			return
		}

		slog.Info(fmt.Sprintf("OIDC Authentication Success [%s]", user.Email))

		spaUser := new(userdb.User)
		spaUser.Id = 0
		spaUser.Email = user.Email
		spaUser.UserName = user.Email
		spaUser.FirstName = user.FirstName
		spaUser.LastName = user.LastName

		session := sessions.Default(c)
		session.Set("user", spaUser)
		session.Set("useremail", spaUser.Email)
		session.Save()

		if session.Get("user") != nil {
			slog.Info("Set the spaUser session value")
		}

		c.Redirect(http.StatusFound, "/")
	})

}

func GetUserFromSession(defaultSession sessions.Session) *userdb.User {
	userObj := defaultSession.Get("user")
	if userObj == nil {
		slog.Warn("There is no active user!")
		return nil
	} else {
		user := userObj.(*userdb.User)
		slog.Info("The active user is: " + user.Email)
		return user
	}
}
