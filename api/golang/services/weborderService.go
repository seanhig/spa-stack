package services

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
)

func WebOrderSubmitHandler(c *gin.Context) {

	/* 	jsonData, err := io.ReadAll(c.Request.Body)
	   	if err != nil {
	   		// Handle error
	   	}
	   	slog.Info(fmt.Sprintf("Request Body: %s", jsonData))
	*/
	var incomingWebOrder WebOrder
	if err := c.BindJSON(&incomingWebOrder); err != nil {
		slog.Error("Unable to BindJSON for incomingWebOrder:", slog.Any("err", err))
		c.AbortWithError(500, err)
	}

	submittedOrder, err := SendMessage(incomingWebOrder)
	if err != nil {
		slog.Error("Failure sending web order to kafka", slog.Any("err", err))
		c.AbortWithError(500, err)
	}

	c.IndentedJSON(http.StatusOK, submittedOrder)
}
