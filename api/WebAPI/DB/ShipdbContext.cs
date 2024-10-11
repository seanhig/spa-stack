using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.DB;

public partial class ShipdbContext : DbContext
{
    public ShipdbContext(IConfiguration configuration)
    {
        this.config = configuration;
    }

    public ShipdbContext(DbContextOptions<ShipdbContext> options, IConfiguration configuration)
        : base(options)
    {
        this.config = configuration;
    }

    private readonly IConfiguration config;

    public virtual DbSet<Shipment> Shipments { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql(config.GetConnectionString("ShipDBConnectionString"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Shipment>(entity =>
        {
            entity.HasKey(e => e.ShipmentId).HasName("shipments_pkey");

            entity.ToTable("shipments");

            entity.Property(e => e.ShipmentId).HasColumnName("shipment_id");
            entity.Property(e => e.Destination)
                .HasMaxLength(255)
                .HasColumnName("destination");
            entity.Property(e => e.HasArrived).HasColumnName("has_arrived");
            entity.Property(e => e.OrderId)
                .ValueGeneratedOnAdd()
                .HasColumnName("order_id");
            entity.Property(e => e.Origin)
                .HasMaxLength(255)
                .HasDefaultValueSql("'W1'::character varying")
                .HasColumnName("origin");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
