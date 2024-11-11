package services

import (
	"idstudios/gin-web-service/auth"
	"log/slog"
	"net/http"
	"strings"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/markbates/goth/gothic"
)

func IdentityCurrentUserHandler(c *gin.Context) {
	user := auth.GetUserFromSession(sessions.Default(c))
	if user != nil {
		slog.Info("Returning user: " + user.Email)
		c.IndentedJSON(http.StatusOK, user)
	} else {
		slog.Info("Current user is NIL!")
		c.IndentedJSON(http.StatusOK, gin.H{})
	}

}

func IdentityExternalLoginHandler(c *gin.Context) {

	q := c.Request.URL.Query()
	provider := strings.ToLower(q.Get("provider"))
	q.Del("provider")
	q.Add("provider", provider)
	c.Request.URL.RawQuery = q.Encode()

	gothic.BeginAuthHandler(c.Writer, c.Request)
}

func IdentityExternalLogoutHandler(c *gin.Context) {

	gothic.Logout(c.Writer, c.Request)
	c.Redirect(http.StatusTemporaryRedirect, "/")
}
