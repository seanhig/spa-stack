package services

import (
	"idstudios/gin-web-service/kafka"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
)

func WebOrderSubmitHandler(c *gin.Context) {

	var incomingWebOrder kafka.WebOrder
	if err := c.BindJSON(&incomingWebOrder); err != nil {
		slog.Error("Unable to BindJSON for incomingWebOrder:", slog.Any("err", err))
		c.AbortWithError(500, err)
	}

	submittedOrder, err := kafka.SendWebOrderMessage(incomingWebOrder)
	if err != nil {
		slog.Error("Failure sending web order to kafka", slog.Any("err", err))
		c.AbortWithError(500, err)
	}

	c.IndentedJSON(http.StatusOK, submittedOrder)
}
