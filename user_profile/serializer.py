from rest_framework import serializers
from .model import Log, User_Profile


class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = ['id', 'title', 'content']

class UserProfileSerializer(serializers.ModelSerializer):
    logs = LogSerializer(many=True, read_only=True)
    logs_data = serializers.PrimaryKeyRelatedField(many=True, queryset=Log.objects.all(), write_only=True, required=False)
    
    class Meta:
        model = User_Profile
        fields = '__all__'

    def create(self, validated_data):
        logs_data = validated_data.pop('logs_data', None)

        user_profile = User_Profile.objects.create(**validated_data)
        
        if logs_data:
            user_profile.logs.set(logs_data)

        return user_profile

    def update(self, instance, validated_data):
        
        
        for attr, value in validated_data.items():
            if attr not in ['characters', 'logs_data']: 
                setattr(instance, attr, value)
        
        
        if 'logs_data' in validated_data:
            if validated_data['logs_data']:  
                instance.logs.set(validated_data['logs_data'])


        instance.save()

        return instance