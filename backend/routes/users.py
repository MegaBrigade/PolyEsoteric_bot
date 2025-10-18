from fastapi import APIRouter, Request

router = APIRouter()

@router.post("/userdata")
async def get_user_data(request: Request):
    data = await request.json()
    user_id = data.get("user_id", "неизвестный")
    name = data.get("name", "гость")
    return {"message": f"Привет, {name}!", "user_id": user_id}
