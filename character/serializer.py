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
        
        
        for attr, value in validated_data.items():
            if attr not in ['picture', 'skills_data']: 
                setattr(instance, attr, value)
        
        
        picture = validated_data.get('picture', None)
        if picture is not None:  
            instance.picture = picture
        
        
        if 'skills_data' in validated_data:
            if validated_data['skills_data']:  
                instance.skills.set(validated_data['skills_data'])


        instance.save()

        return instance