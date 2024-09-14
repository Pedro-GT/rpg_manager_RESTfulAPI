from rest_framework import serializers
from .model import Mission
from character.serializer import RegionSerializer
from character.model import Region

class MissionSerializer(serializers.ModelSerializer):
    region = RegionSerializer(read_only=True)  # Detalhes da região para leitura
    region_id = serializers.PrimaryKeyRelatedField(queryset=Region.objects.all(), source='region', write_only=True)  # ID da região para escrita
    class Meta:
        model = Mission
        fields = '__all__'