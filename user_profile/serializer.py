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
        # Handle logs_data
        logs_data = validated_data.pop('logs_data', None)
        
        # Update other fields as usual
        instance = super().update(instance, validated_data)

        if logs_data is not None:
            # Clear existing logs and set new ones
            instance.logs.set(logs_data)
        
        return instance