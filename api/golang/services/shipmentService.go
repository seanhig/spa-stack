package services

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func ShipmentFetchHandler(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, gin.H{"shipment_id": "123"})
}
