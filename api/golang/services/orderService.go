package services

import (
	"fmt"
	"idstudios/gin-web-service/datasource/erpdb"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
)

func OrderFetchHandler(c *gin.Context) {

	customerName := c.Query("customerName")
	if customerName != "" {
		orders, err := erpdb.FindOrdersByCustomer(customerName)
		if err != nil {
			slog.Error(fmt.Sprintf("Error fetching orders for [%s]", customerName))
			slog.Error(err.Error())
		}
		c.IndentedJSON(http.StatusOK, orders)
	} else {
		orders, err := erpdb.FindAllOrders()
		if err != nil {
			slog.Error("Error fetching orders.")
			slog.Error(err.Error())
		}
		c.IndentedJSON(http.StatusOK, orders)
	}
}
