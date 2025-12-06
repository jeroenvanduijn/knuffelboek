"""
Templates package voor verhaalsjablonen
"""

from .story_templates import (
    STORY_TEMPLATES,
    AGE_GUIDELINES,
    get_themes_for_age,
    get_template,
    get_guidelines
)

__all__ = [
    "STORY_TEMPLATES",
    "AGE_GUIDELINES",
    "get_themes_for_age",
    "get_template",
    "get_guidelines"
]
