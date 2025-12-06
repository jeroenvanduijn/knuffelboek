"""
Enums for visual style options in Knuffelboek
"""
from enum import Enum


class RealismLevel(str, Enum):
    """
    Main visual mode - how realistic should the images look?
    """
    PHOTO = "photo"              # Foto-realistisch (zoals echte foto's)
    SEMI_REAL = "semi_real"      # Lijkt-op-echt (half realistisch, warm)
    ILLUSTRATIVE = "illustrative"  # Getekend (illustratie / cartoon)
    MINIMAL = "minimal"          # Simpel & zacht (minimalistisch)


class IllustrationStyle(str, Enum):
    """
    Specific illustration style within a realism level
    """
    PHOTO_REALISTIC = "photo_realistic"    # Foto-realistisch
    WATERCOLOR = "watercolor"              # Waterverf
    PASTEL = "pastel"                      # Zachte pastel
    CARTOON = "cartoon"                    # Kinderboek-cartoon
    DIGITAL_PAINTING = "digital_painting"  # Digital painting (storybook)
    PLUSH_3D = "plush_3d"                  # 3D knuffel stijl
    MINIMALISTIC = "minimalistic"          # Minimalistisch / Scandinavisch pastel


# Mapping: which styles are valid for each realism level
STYLE_OPTIONS_BY_REALISM = {
    RealismLevel.PHOTO: [IllustrationStyle.PHOTO_REALISTIC],
    RealismLevel.SEMI_REAL: [
        IllustrationStyle.WATERCOLOR,
        IllustrationStyle.PASTEL,
        IllustrationStyle.DIGITAL_PAINTING,
        IllustrationStyle.PLUSH_3D,
    ],
    RealismLevel.ILLUSTRATIVE: [
        IllustrationStyle.CARTOON,
        IllustrationStyle.WATERCOLOR,
        IllustrationStyle.DIGITAL_PAINTING,
        IllustrationStyle.PASTEL,
    ],
    RealismLevel.MINIMAL: [
        IllustrationStyle.MINIMALISTIC,
        IllustrationStyle.PASTEL,
    ],
}


# Default style for each realism level
DEFAULT_STYLE_BY_REALISM = {
    RealismLevel.PHOTO: IllustrationStyle.PHOTO_REALISTIC,
    RealismLevel.SEMI_REAL: IllustrationStyle.WATERCOLOR,
    RealismLevel.ILLUSTRATIVE: IllustrationStyle.CARTOON,
    RealismLevel.MINIMAL: IllustrationStyle.MINIMALISTIC,
}


# Human-readable labels (Dutch)
REALISM_LABELS = {
    RealismLevel.PHOTO: "Foto-realistisch (zoals echte foto's)",
    RealismLevel.SEMI_REAL: "Lijkt-op-echt (half realistisch, warm)",
    RealismLevel.ILLUSTRATIVE: "Getekend (illustratie / cartoon)",
    RealismLevel.MINIMAL: "Simpel & zacht (minimalistisch)",
}

STYLE_LABELS = {
    IllustrationStyle.PHOTO_REALISTIC: "Foto-realistisch",
    IllustrationStyle.WATERCOLOR: "Waterverf",
    IllustrationStyle.PASTEL: "Zachte pastel",
    IllustrationStyle.CARTOON: "Kinderboek-cartoon",
    IllustrationStyle.DIGITAL_PAINTING: "Digital painting (storybook)",
    IllustrationStyle.PLUSH_3D: "3D knuffel stijl",
    IllustrationStyle.MINIMALISTIC: "Minimalistisch / Scandinavisch pastel",
}


# Prompt modifiers for image generation
REALISM_PROMPT_MODIFIERS = {
    RealismLevel.PHOTO: "high quality photo, realistic lighting, sharp details, looks like a real toy, natural colors, photographic",
    RealismLevel.SEMI_REAL: "semi-realistic storybook style, soft lighting, warm and cozy, detailed but slightly painterly, gentle and inviting",
    RealismLevel.ILLUSTRATIVE: "children's book illustration, clear line art, playful shapes, bright friendly colors, expressive and charming",
    RealismLevel.MINIMAL: "minimalistic illustration, simple shapes, soft pastel colors, lots of white space, calm composition, serene",
}

STYLE_PROMPT_MODIFIERS = {
    IllustrationStyle.PHOTO_REALISTIC: "photo-realistic, looks like a real photo, natural lens, realistic depth of field, studio quality",
    IllustrationStyle.WATERCOLOR: "soft watercolor illustration, visible brush strokes, gentle gradients, warm and dreamy, artistic",
    IllustrationStyle.PASTEL: "pastel illustration, soft textures, muted colors, cozy and calm mood, gentle tones",
    IllustrationStyle.CARTOON: "cartoon children's book style, bold shapes, expressive faces, clear outlines, playful",
    IllustrationStyle.DIGITAL_PAINTING: "digital painting style, rich shading, smooth gradients, polished storybook look, vibrant",
    IllustrationStyle.PLUSH_3D: "3D rendered plush toy, soft fabric texture, subtle lighting, high-quality 3D render, tactile",
    IllustrationStyle.MINIMALISTIC: "minimalist Scandinavian style, simple shapes, soft pastel palette, lots of negative space, clean",
}


def get_style_prompt(realism_level: RealismLevel, illustration_style: IllustrationStyle) -> str:
    """
    Combine realism level and illustration style into a single prompt modifier string.
    """
    realism_mod = REALISM_PROMPT_MODIFIERS.get(realism_level, "")
    style_mod = STYLE_PROMPT_MODIFIERS.get(illustration_style, "")
    return f"{realism_mod}, {style_mod}"


def validate_style_for_realism(realism_level: RealismLevel, illustration_style: IllustrationStyle) -> bool:
    """
    Check if the given illustration style is valid for the realism level.
    """
    valid_styles = STYLE_OPTIONS_BY_REALISM.get(realism_level, [])
    return illustration_style in valid_styles


def get_default_style(realism_level: RealismLevel) -> IllustrationStyle:
    """
    Get the default illustration style for a given realism level.
    """
    return DEFAULT_STYLE_BY_REALISM.get(realism_level, IllustrationStyle.WATERCOLOR)
