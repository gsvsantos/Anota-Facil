using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NoteKeeper.WebApi.Domain;

namespace NoteKeeper.WebApi.Orm;

public class MapeadorNotaOrm : IEntityTypeConfiguration<Nota>
{
    public void Configure(EntityTypeBuilder<Nota> builder)
    {
        builder.ToTable("TBNota");

        builder.Property(x => x.Titulo)
            .IsRequired();

        builder.Property(x => x.Conteudo)
          .IsRequired();

        builder.Property(x => x.Arquivada)
            .IsRequired();

        builder.HasOne(x => x.Categoria)
            .WithMany(x => x.Notas)
            .HasForeignKey(x => x.CategoriaId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}