package io.idstudios.springapp.model.payload;

import lombok.Data;

@Data
public class WebOrderDTO {
    private String web_order_id;
    private Long order_date;
    private String customer_name;
    private String destination;
    private Integer quantity;
    private Integer product_id;
}
