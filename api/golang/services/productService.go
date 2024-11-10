package services

import (
	"idstudios/gin-web-service/datasource/erpdb"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ProductFetchHandler(c *gin.Context) {
	products, err := erpdb.FindAllProducts()
	if err != nil {
		slog.Error("Error fetching products.")
		slog.Error(err.Error())
	}
	c.IndentedJSON(http.StatusOK, products)
}
