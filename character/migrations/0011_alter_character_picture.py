from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('character', '0010_clear_character_pictures'),
    ]

    operations = [
        migrations.AlterField(
            model_name='character',
            name='picture',
            field=models.ImageField(blank=True, upload_to='characters/'),
        ),
    ]
