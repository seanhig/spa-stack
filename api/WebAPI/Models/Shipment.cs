using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Shipment
{
    public int ShipmentId { get; set; }

    public int OrderId { get; set; }

    public string Origin { get; set; } = null!;

    public string Destination { get; set; } = null!;

    public bool HasArrived { get; set; }
}
