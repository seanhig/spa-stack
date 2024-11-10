package services

import (
	"idstudios/gin-web-service/datasource/shipdb"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ShipmentFetchHandler(c *gin.Context) {
	shipments, err := shipdb.FindAllShipments()
	if err != nil {
		slog.Error("Error fetching shipments.")
		slog.Error(err.Error())
	}
	c.IndentedJSON(http.StatusOK, shipments)
}
