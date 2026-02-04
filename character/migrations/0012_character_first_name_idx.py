from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('character', '0011_alter_character_picture'),
    ]

    operations = [
        migrations.AlterField(
            model_name='character',
            name='first_name',
            field=models.CharField(db_index=True, max_length=50),
        ),
    ]
