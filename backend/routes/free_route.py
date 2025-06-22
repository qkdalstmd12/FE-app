from flask import Blueprint, request, jsonify

route_bp = Blueprint("recommend_free", __name__)

@route_bp.route("/api/route/recommend/free", methods=["POST"])
def recommend_free_route():
    data = request.get_json()
    print("자유 루트 추천 요청:", data)

    return jsonify({
        "route_id": 302,
        "custom_name": "자유 추천 경로",
        "duration": 42,
        "coordinates": [
            { "latitude": 35.8691, "longitude": 128.5987 },
            { "latitude": 35.8709, "longitude": 128.6001 }
        ],
        "feature": { 
            "park": { "count": 1, "area": 0.0, "ratio": "0.00%" },
            "river": { "count": 0, "area": 0.0, "ratio": "0.00%" },
            "amenity": { "count": 3 },
            "cross": { "count": 0 }
        },
        "recommend": { 
            "expected_time": 42,
            "recommended_pace": 6.9,
            "similarity": 0.80,
            "pace_score": 0.75,
            "final_score": 0.81
        }
    })
