from flask import Blueprint, request, jsonify

route_bp = Blueprint("recommend_new", __name__)

@route_bp.route("/api/route/recommend/new", methods=["POST"])
def recommend_new_route():
    data = request.get_json()
    print("새 루트 추천 요청:", data)

    start = data.get("start_point", {})
    end = data.get("end_point", {})

    start_lat = start.get("lat", 35.0)
    start_lng = start.get("lng", 128.0)
    end_lat = end.get("lat", 35.01)
    end_lng = end.get("lng", 128.01)

    mid_lat = (start_lat + end_lat) / 2
    mid_lng = (start_lng + end_lng) / 2

    return jsonify({
        "route_id": 301,
        "custom_name": "새 추천 경로",
        "duration": 55,
        "coordinates": [
            { "latitude": start_lat, "longitude": start_lng },
            { "latitude": mid_lat, "longitude": mid_lng },
            { "latitude": end_lat, "longitude": end_lng }
        ],
        "feature": {
            "park": { "count": 2, "area": 0.0, "ratio": "0.00%" },
            "river": { "count": 1, "area": 0.0, "ratio": "0.00%" },
            "amenity": { "count": 3 },
            "cross": { "count": 1 }
        },
        "recommend": {
            "expected_time": 55,
            "recommended_pace": 6.5,
            "similarity": 0.82,
            "pace_score": 0.76,
            "final_score": 0.84
        }
    })
