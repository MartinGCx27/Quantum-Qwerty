# Generated by Django 5.2.1 on 2025-07-13 20:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_alter_contact_options_remove_contact_id_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Contact',
        ),
    ]
