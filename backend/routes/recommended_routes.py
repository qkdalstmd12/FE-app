from flask import Blueprint, request, jsonify

route_bp = Blueprint("recommended_routes", __name__)

@route_bp.route("/api/route/fixed/recommended", methods=["GET"])
def get_recommended_routes():
    user_id = request.args.get("user_id")
    fixed_route_id = request.args.get("fixed_route_id")
    print(f"추천 요청 → user_id: {user_id}, fixed_route_id: {fixed_route_id}")

    return jsonify({
        fixed_route_id: [
            {
                "route_id": 201,
                "custom_name": "추천 경로 A",
                "duration": 50,
                "coordinates": [
                    {"latitude": 35.8711, "longitude": 128.6011},
                    {"latitude": 35.8732, "longitude": 128.6044}
                ],
                "feature": { 
                    "park": { "count": 3, "area": 0.0, "ratio": "0.00%" },
                    "river": { "count": 1, "area": 0.0, "ratio": "0.00%" },
                    "amenity": { "count": 2 },
                    "cross": { "count": 1 }
                }
            },
            {
                "route_id": 202,
                "custom_name": "추천 경로 B",
                "duration": 48,
                "coordinates": [
                    {"latitude": 35.8705, "longitude": 128.6022},
                    {"latitude": 35.8728, "longitude": 128.6066}
                ],
                "feature": {
                    "park": { "count": 1, "area": 0.0, "ratio": "0.00%" },
                    "river": { "count": 0, "area": 0.0, "ratio": "0.00%" },
                    "amenity": { "count": 4 },
                    "cross": { "count": 2 }
                }
            }
        ]
    })
