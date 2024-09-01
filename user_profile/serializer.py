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

