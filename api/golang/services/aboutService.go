package services

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AboutHandler(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, gin.H{"apiName": "GoLang", "version": "1.0.0"})
}
