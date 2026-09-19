from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "is_staff", "is_superuser", "role"]

    def get_role(self, obj):
        if obj.is_staff or obj.is_superuser:
            return "artist"
        return "client"


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT Token Serializer returning user details alongside access/refresh tokens.
    Supports login via either username or email.
    """
    def validate(self, attrs):
        # Allow email as username
        username_or_email = attrs.get("username")
        password = attrs.get("password")

        if username_or_email and "@" in username_or_email:
            user = User.objects.filter(email__iexact=username_or_email).first()
            if user:
                attrs["username"] = user.username

        data = super().validate(attrs)
        user_serializer = UserSerializer(self.user)
        data["user"] = user_serializer.data
        return data
