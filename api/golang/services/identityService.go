package services

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func IdentityCurrentUserHandler(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, gin.H{"email": "stubby@dummy.com"})
}

func IdentityExternalLoginHandler(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, gin.H{"email": "stubby@dummy.com"})
}

func IdentityExternalLogoutHandler(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, gin.H{"email": "stubby@dummy.com"})
}
