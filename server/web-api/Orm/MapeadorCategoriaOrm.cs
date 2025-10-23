using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NoteKeeper.WebApi.Domain;

namespace NoteKeeper.WebApi.Orm;

public class MapeadorCategoriaOrm : IEntityTypeConfiguration<Categoria>
{
    public void Configure(EntityTypeBuilder<Categoria> builder)
    {
        builder.ToTable("TBCategoria");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Titulo)
            .IsRequired();
    }
}
