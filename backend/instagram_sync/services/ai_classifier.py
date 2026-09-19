import re

class AIClassifier:
    """
    AI-Assisted Classification Engine (Phase 6)
    Suggests tattoo style, body placement, color type, and descriptive tags from captions & hashtags.
    All suggestions are non-destructive and editable by the artist.
    """

    STYLE_KEYWORDS = {
        "Spiritual": [
            "shiva", "mahadev", "trishul", "damru", "rudraksha", "hanuman", "bajrangbali",
            "ganesha", "ganpati", "krishna", "radha", "buddha", "nirvana", "spiritual",
            "devotional", "om", "mantra", "sanskrit", "bhagwan", "tilak", "morpankh"
        ],
        "Realism": [
            "realism", "portrait", "lion", "tiger", "king", "crown", "shivaji", "maharaj",
            "dark realism", "photorealistic", "clock", "pocket watch", "broken glass", "hyper"
        ],
        "Fine Line": [
            "fine line", "single needle", "delicate", "minimalist", "tiny", "micro",
            "lotus", "butterfly", "flower", "botanical", "fern", "floral"
        ],
        "Geometric": [
            "geometric", "mandala", "sacred geometry", "metatron", "dotwork", "stipple",
            "polygon", "symmetry", "geometry"
        ],
        "Script": [
            "script", "calligraphy", "maa", "papa", "name", "lettering", "quote",
            "devanagari", "heartbeat", "ecg"
        ],
        "Blackwork": [
            "blackwork", "serpent", "snake", "peony", "darkwork", "solid black",
            "tribal", "illustrative blackwork"
        ],
        "Traditional": [
            "traditional", "neo traditional", "old school", "flash", "vintage"
        ],
    }

    PLACEMENT_KEYWORDS = {
        "Forearm": ["forearm", "wrist to elbow", "lower arm"],
        "Bicep": ["bicep", "upper arm", "arm"],
        "Full Sleeve": ["sleeve", "full sleeve", "half sleeve"],
        "Shoulder": ["shoulder", "shoulder blade", "deltoid"],
        "Wrist": ["wrist", "wristband"],
        "Spine": ["spine", "backbone", "full back", "upper back", "back"],
        "Chest": ["chest", "pectoral", "sternum", "collarbone"],
        "Neck": ["neck", "throat", "behind ear"],
        "Thigh": ["thigh", "leg", "calf", "ankle"],
    }

    @classmethod
    def classify(cls, caption: str = "", media_type: str = "IMAGE") -> dict:
        text = (caption or "").lower()
        
        # 1. Style Scoring
        style_scores = {style: 0 for style in cls.STYLE_KEYWORDS}
        for style, keywords in cls.STYLE_KEYWORDS.items():
            for kw in keywords:
                if kw in text:
                    style_scores[style] += 1

        best_style = max(style_scores, key=style_scores.get)
        style_confidence = min(0.95, 0.50 + (style_scores[best_style] * 0.15))
        if style_scores[best_style] == 0:
            best_style = "Custom"
            style_confidence = 0.40

        # 2. Placement Detection
        detected_placement = "Forearm"
        placement_confidence = 0.50
        for placement, keywords in cls.PLACEMENT_KEYWORDS.items():
            for kw in keywords:
                if kw in text:
                    detected_placement = placement
                    placement_confidence = 0.85
                    break
            if placement_confidence > 0.50:
                break

        # 3. Color Type Heuristic
        if "color" in text or "colour" in text or "coloured" in text:
            color_type = "Color"
        elif "single needle" in text or "micro" in text:
            color_type = "Single Needle"
        else:
            color_type = "Black & Grey"

        # 4. Extract Hashtags & Tags
        raw_tags = re.findall(r"#(\w+)", caption or "")
        filtered_tags = [
            t for t in raw_tags
            if t.lower() not in ("instagram", "instagood", "explore", "reels", "viral", "foryou", "fyp")
        ][:6]

        if not filtered_tags:
            filtered_tags = [best_style, detected_placement, "Tattoo Iconic"]

        # 5. Generate Concise Clean Title
        clean_title = ""
        first_line = (caption or "").split("\n")[0].strip()
        # Strip leading emojis
        first_line_clean = re.sub(r"^[^\w\s]+", "", first_line).strip()
        if len(first_line_clean) >= 6:
            clean_title = first_line_clean[:70]
        else:
            clean_title = f"{best_style} {detected_placement} Tattoo Artwork"

        return {
            "suggested_title": clean_title,
            "suggested_style": best_style,
            "suggested_placement": detected_placement,
            "suggested_color": color_type,
            "suggested_tags": filtered_tags,
            "confidence_score": round((style_confidence + placement_confidence) / 2, 2),
        }
