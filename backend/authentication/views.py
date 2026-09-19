from rest_framework import views, status, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from .serializers import CustomTokenObtainPairSerializer, UserSerializer


class CustomLoginView(TokenObtainPairView):
    """
    POST /api/v1/auth/login/
    Returns access token, refresh token, and user payload.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenObtainPairSerializer


class CurrentUserView(views.APIView):
    """
    GET /api/v1/auth/me/
    Returns the profile of the currently authenticated user/artist.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        data = serializer.data
        data["artist_profile"] = {
            "name": getattr(settings, "ARTIST_NAME", "Jainik Patel"),
            "studio": getattr(settings, "ARTIST_STUDIO", "Tattoo Iconic"),
            "phone": getattr(settings, "ARTIST_PHONE", "+918238767100"),
            "location": getattr(settings, "STUDIO_LOCATION", "Bhadam, Rajpipla, Narmada, Gujarat"),
            "handle": getattr(settings, "INSTAGRAM_HANDLE", "tatoo.iconic"),
        }
        return Response(data)
