using System;
using System.Collections.Generic;

namespace WebAPI;

public partial class Order
{
    public int OrderId { get; set; }

    public string? OrderRef { get; set; }

    public DateTime OrderDate { get; set; }

    public string CustomerName { get; set; } = null!;

    public decimal OrderTotal { get; set; }

    public int OrderQty { get; set; }

    public int ProductId { get; set; }

    public int OrderStatus { get; set; }
}
