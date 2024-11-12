package shipdb

import (
	"fmt"
	"log/slog"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Shipment struct {
	ShipmentId  uint   `json:"shipmentId"`
	OrderId     uint   `json:"orderId"`
	Origin      string `json:"origin"`
	Destination string `json:"destination"`
	HasArrived  bool   `json:"hasArrived"`
}

func Connect() (*gorm.DB, error) {
	// refer https://github.com/go-sql-driver/mysql#dsn-data-source-name for details
	dsn := os.Getenv("SHIPDB_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		slog.Error("[shipdb] Error connecting")
		slog.Error(err.Error())
		return nil, err
	}
	sqlDB, err := db.DB()
	if err == nil {
		sqlDB.SetMaxIdleConns(10)
		sqlDB.SetMaxOpenConns(100)

		slog.Info("[shipdb] Connected")
	}

	return db, err
}

func FindAllShipments() ([]Shipment, error) {
	db, err := Connect()
	if err != nil {
		return nil, err
	}

	var shipments []Shipment
	result := db.Find(&shipments).Order("order_id DESC").Limit(200)
	if result.Error != nil {
		return nil, result.Error
	}

	slog.Info(fmt.Sprintf("Loaded all [%d] shipments", result.RowsAffected))

	return shipments, nil
}
