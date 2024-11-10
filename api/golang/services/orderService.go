package services

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func OrderFetchHandler(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, gin.H{"order_id": "123"})
}
