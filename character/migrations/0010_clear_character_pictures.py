from django.db import migrations


def clear_pictures(apps, schema_editor):
    Character = apps.get_model('character', 'Character')
    Character.objects.update(picture='')


class Migration(migrations.Migration):

    dependencies = [
        ('character', '0009_alter_character_picture'),
    ]

    operations = [
        migrations.RunPython(clear_pictures, migrations.RunPython.noop),
    ]
