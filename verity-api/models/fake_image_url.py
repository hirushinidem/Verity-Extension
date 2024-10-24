from pydantic import BaseModel

class ImageURL(BaseModel):
    url: str
