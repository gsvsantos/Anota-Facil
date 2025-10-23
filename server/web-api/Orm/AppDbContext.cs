using Microsoft.EntityFrameworkCore;
using NoteKeeper.WebApi.Domain;

namespace NoteKeeper.WebApi.Orm;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<Nota> Notas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppContext).Assembly);
    }
}
