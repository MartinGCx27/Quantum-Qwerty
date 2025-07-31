from django.db import models

class Contact(models.Model):
    SEEN_CHOICES = [
        ('No visto', 'No visto'),
        ('Visto', 'Visto'),
    ]

    STATUS_CHOICES = [
        ('NO_ATENDIDO', 'No atendido'),
        ('EN_CURSO', 'En curso'),
        ('ATENDIDO', 'Atendido'),
    ]

    id_contact = models.AutoField(primary_key=True)
    name_contact = models.CharField(max_length=100, null=False, blank=False, unique=False, verbose_name='Nombre')
    lastname_contact = models.CharField(max_length=100, null=False, blank=False, unique=False, verbose_name='Apellido')
    email_contact = models.EmailField(null=False, blank=False, unique=False, verbose_name="Email")
    phone_contact = models.CharField(max_length=10, null=False, blank=False, unique=False, verbose_name='Telefono')
    comments_contact = models.TextField(null=False, blank=False, verbose_name='Comentarios')
    date_contact = models.DateTimeField(auto_now_add=True, verbose_name='Fecha alta')

    # Cambiado a CharField con choices y valor por defecto
    status_contact = models.CharField(
        max_length=100,
        choices=STATUS_CHOICES,
        default='NO_ATENDIDO',
        verbose_name='Estado'
    )

    seen_contact = models.CharField(
        max_length=100,
        choices=SEEN_CHOICES,
        default='No visto',
        verbose_name="Visualizado"
    )
    
    def __str__(self):
        return f"{self.name_contact} ({'Visto' if self.seen_contact == 'SI' else 'No visto'})"
    
    class Meta:
        db_table = 'contact'
        verbose_name = 'Contacto'
        verbose_name_plural = 'Contactos'
        ordering = ['id_contact']