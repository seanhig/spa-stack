package erpdb

import (
	"fmt"
	"log/slog"
	"os"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Product struct {
	Id          uint    `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float32 `sql:"type:decimal(10,2);" json:"price"`
}

type Order struct {
	OrderId      uint       `json:"orderId"`
	OrderRef     string     `json:"orderRef"`
	OrderDate    *time.Time `json:"orderDate"`
	CustomerName string     `json:"customerName"`
	OrderTotal   float32    `sql:"type:decimal(10,2);" json:"orderTotal"`
	OrderQty     uint       `json:"orderQty"`
	ProductId    uint       `json:"productId"`
	OrderStatus  uint       `json:"orderStatus"`
}

func Connect() (*gorm.DB, error) {
	// refer https://github.com/go-sql-driver/mysql#dsn-data-source-name for details
	dsn := os.Getenv("ERPDB_URL")
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		slog.Error("[erpdb] Error connecting")
		slog.Error(err.Error())
		return nil, err
	}
	sqlDB, err := db.DB()
	if err == nil {
		sqlDB.SetMaxIdleConns(10)
		sqlDB.SetMaxOpenConns(100)

		slog.Info("[erpdb] Connected")
	}

	return db, err
}

func FindAllOrders() ([]Order, error) {
	db, err := Connect()
	if err != nil {
		return nil, err
	}

	var orders []Order
	result := db.Find(&orders).Order("order_date DESC").Limit(200)
	if result.Error != nil {
		return nil, result.Error
	}

	slog.Info(fmt.Sprintf("Loaded all [%d] orders", result.RowsAffected))

	return orders, nil
}

func FindOrdersByCustomer(customerName string) ([]Order, error) {
	db, err := Connect()
	if err != nil {
		return nil, err
	}

	var orders []Order
	result := db.Where("customer_name = ?", customerName).Find(&orders).Order("order_date DESC").Limit(200)
	if result.Error != nil {
		return nil, result.Error
	}

	slog.Info(fmt.Sprintf("Loaded [%d] orders for [%s]", result.RowsAffected, customerName))

	return orders, nil
}

func FindAllProducts() ([]Product, error) {
	db, err := Connect()
	if err != nil {
		return nil, err
	}

	var products []Product
	result := db.Find(&products)
	if result.Error != nil {
		return nil, result.Error
	}

	slog.Info(fmt.Sprintf("Loaded all [%d] products", result.RowsAffected))

	return products, nil
}
