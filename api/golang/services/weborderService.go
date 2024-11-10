package services

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func WebOrderSubmitHandler(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, gin.H{"weborder_id": "123"})
}
