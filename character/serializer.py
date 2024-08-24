from rest_framework import serializers
from .model import Character, Race, Skill, Region

class RaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Race
        fields = '__all__'

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'

class CharacterSerializer(serializers.ModelSerializer):
    race = RaceSerializer(read_only=True)  # Detalhes da raça para leitura
    race_id = serializers.PrimaryKeyRelatedField(queryset=Race.objects.all(), source='race', write_only=True)  # ID da raça para escrita
    region = RegionSerializer(read_only=True)  # Detalhes da região para leitura
    region_id = serializers.PrimaryKeyRelatedField(queryset=Region.objects.all(), source='region', write_only=True)  # ID da região para escrita
    skills = SkillSerializer(many=True, read_only=True)  # Detalhes das habilidades para leitura
    
    skills_data = serializers.PrimaryKeyRelatedField(many=True, queryset=Skill.objects.all(), write_only=True, required=False)  # IDs das habilidades para escrita
    picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Character
        fields = '__all__'

    def create(self, validated_data):
        skills_data = validated_data.pop('skills_data', None)

        character = Character.objects.create(**validated_data)
        
        if skills_data:
            character.skills.set(skills_data)

        return character

    def update(self, instance, validated_data):
        # Atualiza todos os campos que são fornecidos, exceto a imagem e as habilidades
        for attr, value in validated_data.items():
            if attr not in ['picture', 'skills_data']:  # Ignora a imagem e as habilidades por enquanto
                setattr(instance, attr, value)
        
        # Verifica se uma nova imagem foi fornecida; se não, mantém a imagem antiga
        picture = validated_data.get('picture', None)
        if picture is not None:  # Atualiza a imagem apenas se fornecida
            instance.picture = picture
        
        # Verifica se novas habilidades foram fornecidas
        if 'skills_data' in validated_data:
            if validated_data['skills_data']:  # Se skills_data não for vazio, atualiza as skills
                instance.skills.set(validated_data['skills_data'])
            # Se skills_data for uma lista vazia, preserva as habilidades existentes
            # Se quiser implementar remoção com lista vazia, colocar a lógica aqui

        instance.save()

        return instance