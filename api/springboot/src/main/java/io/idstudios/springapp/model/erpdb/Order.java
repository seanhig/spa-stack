package io.idstudios.springapp.model.erpdb;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity 
@Table(name = "orders")
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "order_id")
  private Integer orderId;
  @Column(name = "order_ref")
  private String orderRef;
  @Column(name = "customer_name")
  private String customerName;
  @Column(name = "order_date")
  private LocalDateTime orderDate;
  @Column(name = "order_total")
  private Double orderTotal;
  @Column(name = "order_qty")
  private Integer orderQty;
  @Column(name = "product_id")
  private Integer productId;
  @Column(name = "order_status")
  private Integer orderStatus;

  public Integer getOrderId() {
    return orderId;
  }
  public void setOrderId(Integer orderId) {
    this.orderId = orderId;
  }
  public String getOrderRef() {
    return orderRef;
  }
  public void setOrderRef(String orderRef) {
    this.orderRef = orderRef;
  }
  public String getCustomerName() {
    return customerName;
  }
  public void setCustomerName(String customerName) {
    this.customerName = customerName;
  }
  public LocalDateTime getOrderDate() {
    return orderDate;
  }
  public void setOrderDate(LocalDateTime orderDate) {
    this.orderDate = orderDate;
  }
  public Double getOrderTotal() {
    return orderTotal;
  }
  public void setOrderTotal(Double orderTotal) {
    this.orderTotal = orderTotal;
  }
  public Integer getOrderQty() {
    return orderQty;
  }
  public void setOrderQty(Integer orderQty) {
    this.orderQty = orderQty;
  }
  public Integer getProductId() {
    return productId;
  }
  public void setProductId(Integer productId) {
    this.productId = productId;
  }
  public Integer getOrderStatus() {
    return orderStatus;
  }
  public void setOrderStatus(Integer orderStatus) {
    this.orderStatus = orderStatus;
  }





}