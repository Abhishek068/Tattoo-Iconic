from django.db.models import Q
from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from .models import PortfolioItem, TattooStyle, Placement, Tag
from .serializers import (
    PortfolioItemListSerializer,
    PortfolioItemDetailSerializer,
    TattooStyleSerializer,
    PlacementSerializer,
)

class PublicPortfolioViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public Portfolio API (Phase 8 & 19)
    Provides 24/page paginated queries, multi-filter search, and full item inspection.
    """
    permission_classes = [AllowAny]
    lookup_field = "id"

    def get_queryset(self):
        qs = (
            PortfolioItem.objects.filter(published=True, status="PUBLISHED")
            .select_related("style", "placement")
            .prefetch_related("media_items", "tags")
        )

        style = self.request.query_params.get("style")
        if style and style.lower() != "all":
            qs = qs.filter(Q(style__name__iexact=style) | Q(style__slug__iexact=style))

        placement = self.request.query_params.get("placement")
        if placement and placement.lower() != "all":
            qs = qs.filter(
                Q(placement__name__icontains=placement) | Q(placement__slug__icontains=placement)
            )

        color = self.request.query_params.get("color")
        if color and color.lower() != "all":
            qs = qs.filter(color_type__iexact=color)

        year = self.request.query_params.get("year")
        if year and year.isdigit():
            qs = qs.filter(published_at__year=int(year))

        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(
                Q(title__icontains=search)
                | Q(caption__icontains=search)
                | Q(description__icontains=search)
                | Q(tags__name__icontains=search)
            ).distinct()

        ordering = self.request.query_params.get("ordering", "-published_at")
        if ordering in ("-published_at", "published_at", "-like_count", "-created_at"):
            qs = qs.order_by(ordering)

        return qs

    def get_serializer_class(self):
        if self.action == "retrieve":
            return PortfolioItemDetailSerializer
        return PortfolioItemListSerializer

    @action(detail=False, methods=["get"], url_path="featured")
    def featured(self, request):
        """Top featured masterpieces for homepage and highlight carousels"""
        qs = (
            PortfolioItem.objects.filter(published=True, status="PUBLISHED", featured=True)
            .select_related("style", "placement")
            .prefetch_related("media_items")[:12]
        )
        serializer = PortfolioItemListSerializer(qs, many=True)
        return Response({"success": True, "count": len(serializer.data), "results": serializer.data})

    @action(detail=False, methods=["get"], url_path="styles")
    def styles(self, request):
        """Active tattoo styles catalog"""
        qs = TattooStyle.objects.filter(active=True)
        serializer = TattooStyleSerializer(qs, many=True)
        return Response({"success": True, "results": serializer.data})

    @action(detail=False, methods=["get"], url_path="placements")
    def placements(self, request):
        """Body placements catalog"""
        qs = Placement.objects.all()
        serializer = PlacementSerializer(qs, many=True)
        return Response({"success": True, "results": serializer.data})
