package services

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func ProductFetchHandler(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, gin.H{"product_id": "123"})
}
