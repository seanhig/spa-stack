package services

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

var apiName = "GoLang"

func AboutHandler(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, gin.H{"apiName": apiName, "version": "1.0.0"})
}
