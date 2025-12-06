#!/usr/bin/env python3
"""Quick test for analyze-toy endpoint"""
import requests

image_path = "/Users/jeroenvanduijn/Downloads/619C8A1D-003B-4471-B90F-588CD1AB9F08_1_105_c.jpeg"

with open(image_path, "rb") as f:
    files = {"file": ("knuffel.jpeg", f, "image/jpeg")}
    response = requests.post(
        "http://localhost:8000/analyze-toy",
        files=files,
        timeout=120
    )

print(f"Status: {response.status_code}")
print(f"Response: {response.text}")
