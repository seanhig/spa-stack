package io.idstudios.springapp.model.shipdb;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity 
@Table(name = "shipments")
public class Shipment {
  @Id
  @GeneratedValue(strategy=GenerationType.IDENTITY)
  @Column(name="shipment_id")
  private Integer shipmentId;
  @Column(name="order_id")
  private Integer orderId;
  private String origin;
  private String destination;
  @Column(name="has_arrived")
  private Boolean hasArrived;

  public Integer getShipmentId() {
    return shipmentId;
  }
  public void setShipmentId(Integer shipmentId) {
    this.shipmentId = shipmentId;
  }
  public Integer getOrderId() {
    return orderId;
  }
  public void setOrderId(Integer orderId) {
    this.orderId = orderId;
  }
  public String getOrigin() {
    return origin;
  }
  public void setOrigin(String origin) {
    this.origin = origin;
  }
  public String getDestination() {
    return destination;
  }
  public void setDestination(String destination) {
    this.destination = destination;
  }
  public Boolean getHasArrived() {
    return hasArrived;
  }
  public void setHasArrived(Boolean hasArrived) {
    this.hasArrived = hasArrived;
  }




}
